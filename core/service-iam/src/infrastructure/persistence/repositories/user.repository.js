import { ValidationError } from '@restart/errors';
import { makeUser } from '../../../domain/entities/user.entity.js';
import { makeDefaultUserStats, makeUserStats } from '../../../domain/entities/user-stats.entity.js';

const rowToUser = (row) =>
  makeUser({
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    fullName: row.full_name,
    role: row.role,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  });

export const makeUserRepository = ({ query }) => ({
  findByEmail: async (email) => {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows.length ? rowToUser(result.rows[0]) : null;
  },

  findById: async (id) => {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows.length ? rowToUser(result.rows[0]) : null;
  },

  getUserStats: async (userId) => {
    const result = await query('SELECT * FROM user_stats WHERE user_id = $1', [userId]);
    if (result.rows.length === 0) {
      await query(
        'INSERT INTO user_stats (user_id, total_points, total_earnings, repaired_count, prevented_waste_kg) VALUES ($1, 0, 0, 0, 0)',
        [userId]
      );
      return makeDefaultUserStats();
    }
    const row = result.rows[0];
    return makeUserStats({
      totalPoints: row.total_points,
      totalEarnings: row.total_earnings,
      repairedCount: row.repaired_count,
      preventedWasteKg: row.prevented_waste_kg,
    });
  },

  create: async (user) => {
    const { email, passwordHash, fullName } = user;
    const result = await query(
      'INSERT INTO users (email, password_hash, full_name) VALUES ($1, $2, $3) RETURNING *',
      [email, passwordHash, fullName]
    );
    const row = result.rows[0];

    await query('INSERT INTO user_stats (user_id, total_points) VALUES ($1, 0)', [row.id]);

    return rowToUser(row);
  },

  getLeaderboard: async ({ limit = 3 } = {}) => {
    const result = await query(
      `SELECT u.id, u.full_name, s.total_points,
              RANK() OVER (ORDER BY s.total_points DESC) AS rank
       FROM user_stats s
       JOIN users u ON u.id = s.user_id
       ORDER BY s.total_points DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows.map((row) => ({
      rank: Number(row.rank),
      userId: row.id,
      fullName: row.full_name,
      totalPoints: row.total_points,
    }));
  },

  getUserRank: async (userId) => {
    const result = await query(
      `SELECT rank, full_name, total_points FROM (
         SELECT u.id, u.full_name, s.total_points,
                RANK() OVER (ORDER BY s.total_points DESC) AS rank
         FROM user_stats s
         JOIN users u ON u.id = s.user_id
       ) ranked
       WHERE id = $1`,
      [userId]
    );
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return { rank: Number(row.rank), fullName: row.full_name, totalPoints: row.total_points };
  },

  getRewards: async () => {
    const result = await query(
      'SELECT * FROM rewards WHERE is_active = true ORDER BY points_cost ASC'
    );
    return result.rows.map((row) => ({
      id: row.id,
      title: row.title,
      subtitle: row.subtitle,
      pointsCost: row.points_cost,
      imageUrl: row.image_url,
    }));
  },

  redeemReward: async ({ userId, rewardId }) => {
    const rewardResult = await query(
      'SELECT * FROM rewards WHERE id = $1 AND is_active = true',
      [rewardId]
    );
    if (rewardResult.rows.length === 0) {
      throw new ValidationError('Reward not found');
    }
    const reward = rewardResult.rows[0];

    const statsResult = await query(
      'SELECT total_points FROM user_stats WHERE user_id = $1',
      [userId]
    );
    const currentPoints = statsResult.rows[0]?.total_points ?? 0;
    if (currentPoints < reward.points_cost) {
      throw new ValidationError('Insufficient points');
    }

    await query(
      'UPDATE user_stats SET total_points = total_points - $1 WHERE user_id = $2',
      [reward.points_cost, userId]
    );

    const redemptionResult = await query(
      `INSERT INTO reward_redemptions (user_id, reward_id, points_spent)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, rewardId, reward.points_cost]
    );

    await query(
      `INSERT INTO activities (user_id, activity_type, title, description, points_earned)
       VALUES ($1, 'reward', 'Ödül Kullanıldı', $2, $3)`,
      [userId, `${reward.title} ödülü kullanıldı`, -reward.points_cost]
    );

    return {
      id: redemptionResult.rows[0].id,
      rewardId,
      pointsSpent: reward.points_cost,
      remainingPoints: currentPoints - reward.points_cost,
    };
  },

  getNotifications: async (userId) => {
    const result = await query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      body: row.body,
      isRead: row.is_read,
      createdAt: row.created_at,
    }));
  },

  markNotificationRead: async (notificationId) => {
    await query('UPDATE notifications SET is_read = true WHERE id = $1', [notificationId]);
  },

  updatePasswordHash: async (userId, passwordHash) => {
    await query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, userId]);
  },

  getNotificationPreferences: async (userId) => {
    const result = await query('SELECT * FROM notification_preferences WHERE user_id = $1', [userId]);
    const row = result.rows[0];
    return { recycle: row?.recycle ?? true, marketplace: row?.marketplace ?? true, rewards: row?.rewards ?? true, system: row?.system ?? true };
  },

  saveNotificationPreferences: async (userId, prefs) => {
    await query(
      `INSERT INTO notification_preferences (user_id, recycle, marketplace, rewards, system)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE SET recycle = $2, marketplace = $3, rewards = $4, system = $5`,
      [userId, prefs.recycle, prefs.marketplace, prefs.rewards, prefs.system]
    );
  },

  markAllNotificationsRead: async (userId) => {
    await query('UPDATE notifications SET is_read = true WHERE user_id = $1', [userId]);
  },
});

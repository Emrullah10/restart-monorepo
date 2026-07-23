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
    return makeUserStats(result.rows[0]);
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
});

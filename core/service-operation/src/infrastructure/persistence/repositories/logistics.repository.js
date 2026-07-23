export const makeLogisticsRepository = ({ query }) => ({
  findNearbyCouriers: async ({ lat, lng, radius, vehicleType }) => {
    // Mocking for MVP
    return [{ name: 'Eco Courier #1', distance: 0.5, vehicle: vehicleType }];
  },

  logRecycle: async (recycle) => {
    const { userId, centerId, wasteType, amount, pointsEarned } = recycle;
    const result = await query(
      'INSERT INTO activities (user_id, activity_type, title, description, points_earned) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, 'recycle', 'Geri Dönüşüm', `${amount} ${wasteType} geri dönüştürüldü`, pointsEarned]
    );
    return result.rows[0];
  },

  updatePoints: async (userId, points) => {
    await query('UPDATE user_stats SET total_points = total_points + $1 WHERE user_id = $2', [points, userId]);
  },
});

export const makeGamificationController = ({ getLeaderboard, getUserBadges }) => ({
  getLeaderboard: async (req, res) => {
    const { userId, limit } = req.query;
    const result = await getLeaderboard({ userId, limit: limit ? parseInt(limit, 10) : undefined });
    res.json(result);
  },

  getUserBadges: async (req, res) => {
    const { userId } = req.params;
    const badges = await getUserBadges({ userId });
    res.json(badges);
  },
});

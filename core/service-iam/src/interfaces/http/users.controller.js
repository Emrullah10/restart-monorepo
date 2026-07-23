import { userToJSON } from '../../domain/entities/user.entity.js';

export const makeUsersController = ({ registerUser, loginUser, getUserProfile }) => ({
  register: async (req, res) => {
    const { email, password, fullName } = req.body;
    const user = await registerUser({ email, password, fullName });
    res.status(201).json({ message: 'User registered successfully', user: userToJSON(user) });
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    const { user, token } = await loginUser({ email, password });
    res.status(200).json({ message: 'Login successful', token, user: userToJSON(user) });
  },

  getProfile: async (req, res) => {
    const { userId } = req.params;
    const { user, stats } = await getUserProfile({ userId });
    res.status(200).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt,
      stats: {
        totalPoints: stats.totalPoints,
        totalEarnings: stats.totalEarnings,
        repairedCount: stats.repairedCount,
        preventedWasteKg: stats.preventedWasteKg,
        co2Saved: stats.co2Saved.toFixed(2),
      },
    });
  },
});

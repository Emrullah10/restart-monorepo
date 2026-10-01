import { userToJSON } from '../../domain/entities/user.entity.js';

export const makeUsersController = ({ registerUser, loginUser, getUserProfile, changePassword, getNotificationPreferences, updateNotificationPreferences }) => ({
  // Identity comes from the gateway (x-user-id is set from the verified session).
  changePassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    await changePassword({ userId: req.headers['x-user-id'], currentPassword, newPassword });
    res.status(200).json({ message: 'Password updated' });
  },

  getNotificationPreferences: async (req, res) => {
    res.status(200).json(await getNotificationPreferences({ userId: req.headers['x-user-id'] }));
  },

  updateNotificationPreferences: async (req, res) => {
    res.status(200).json(await updateNotificationPreferences({ userId: req.headers['x-user-id'], preferences: req.body }));
  },

  register: async (req, res) => {
    const { email, password, fullName } = req.body;
    const { user, token } = await registerUser({ email, password, fullName });
    res.status(201).json({ message: 'User registered successfully', token, user: userToJSON(user) });
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

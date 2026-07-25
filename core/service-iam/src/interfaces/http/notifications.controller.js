export const makeNotificationsController = ({
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
}) => ({
  getNotifications: async (req, res) => {
    const { userId } = req.params;
    const notifications = await getNotifications(userId);
    res.json(notifications);
  },

  markRead: async (req, res) => {
    const { id } = req.params;
    await markNotificationRead(id);
    res.status(200).json({ success: true });
  },

  markAllRead: async (req, res) => {
    const { userId } = req.params;
    await markAllNotificationsRead(userId);
    res.status(200).json({ success: true });
  },
});

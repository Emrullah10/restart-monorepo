export const makeMiscController = ({ getRewards, submitContactMessage }) => ({
  getRewards: async (req, res) => {
    const rewards = await getRewards();
    res.json(rewards);
  },

  submitContactMessage: async (req, res) => {
    const { name, email, message } = req.body;
    const result = await submitContactMessage({ name, email, message });
    res.status(200).json(result);
  },
});

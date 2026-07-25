export const makeMiscController = ({ getRewards, submitContactMessage, redeemReward }) => ({
  getRewards: async (req, res) => {
    const rewards = await getRewards();
    res.json(rewards);
  },

  submitContactMessage: async (req, res) => {
    const { name, email, message } = req.body;
    const result = await submitContactMessage({ name, email, message });
    res.status(200).json(result);
  },

  redeemReward: async (req, res) => {
    const { userId, rewardId } = req.body;
    const result = await redeemReward({ userId, rewardId });
    res.status(201).json(result);
  },
});

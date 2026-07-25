export const makeMarketplaceController = ({ getProducts, getUserListings }) => ({
  getProducts: async (req, res) => {
    const products = await getProducts();
    res.json(products);
  },

  getUserListings: async (req, res) => {
    const { userId } = req.params;
    const listings = await getUserListings({ userId });
    res.json(listings);
  },
});

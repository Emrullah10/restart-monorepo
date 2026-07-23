export const makeMarketplaceController = ({ getProducts }) => ({
  getProducts: async (req, res) => {
    const products = await getProducts();
    res.json(products);
  },
});

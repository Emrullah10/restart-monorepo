export const makeMarketplaceController = ({ getPublicListings, getUserListings, createListing, uploadImages }) => ({
  getProducts: async (req, res) => {
    const { category, q, limit } = req.query;
    const listings = await getPublicListings({
      category,
      q,
      limit: limit ? Number(limit) : undefined,
    });
    res.json(listings);
  },

  getUserListings: async (req, res) => {
    const { userId } = req.params;
    const listings = await getUserListings({ userId });
    res.json(listings);
  },

  createListing: async (req, res) => {
    const listing = await createListing(req.body);
    res.status(201).json(listing);
  },

  uploadImages: async (req, res) => {
    const imageUrls = uploadImages(req.files || []);
    res.status(201).json({ imageUrls });
  },
});

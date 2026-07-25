import { makeProduct } from '../../../domain/entities/product.entity.js';

export const makeMarketplaceRepository = ({ query }) => ({
  findAll: async () => {
    const result = await query('SELECT * FROM products WHERE is_available = true ORDER BY created_at DESC');
    return result.rows.map((row) =>
      makeProduct({
        id: row.id,
        sellerId: row.seller_id,
        title: row.title,
        description: row.description,
        category: row.category,
        price: row.price,
        rating: row.rating,
        location: row.location,
        imageUrl: row.image_url,
        isAvailable: row.is_available,
        createdAt: row.created_at,
      })
    );
  },

  findAllListings: async () => {
    const result = await query('SELECT * FROM listings ORDER BY created_at DESC');
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      price: row.price,
      status: row.status,
      imageUrl: row.image_url,
      createdAt: row.created_at,
    }));
  },

  findListingsByUserId: async (userId) => {
    const result = await query('SELECT * FROM listings WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      description: row.description,
      price: row.price,
      status: row.status,
      imageUrl: row.image_url,
      createdAt: row.created_at,
    }));
  },
});

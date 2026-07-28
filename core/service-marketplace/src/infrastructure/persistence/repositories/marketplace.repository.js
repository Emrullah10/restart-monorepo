import { makeProduct } from '../../../domain/entities/product.entity.js';

const rowToListing = (row) => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  description: row.description,
  category: row.category,
  price: row.price,
  status: row.status,
  imageUrl: row.image_url,
  location: row.location,
  createdAt: row.created_at,
  images: row.image_urls ? row.image_urls.filter(Boolean) : [],
});

const LISTING_SELECT_WITH_IMAGES = `
  SELECT l.*, array_agg(li.image_url ORDER BY li.sort_order) FILTER (WHERE li.image_url IS NOT NULL) AS image_urls
  FROM listings l
  LEFT JOIN listing_images li ON li.listing_id = l.id
`;

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

  findAllListings: async ({ category, q, limit } = {}) => {
    const conditions = [`l.status = 'active'`];
    const values = [];

    if (category) {
      values.push(category);
      conditions.push(`l.category = $${values.length}`);
    }

    if (q) {
      values.push(`%${q}%`);
      conditions.push(`(l.title ILIKE $${values.length} OR l.description ILIKE $${values.length})`);
    }

    let sql = `${LISTING_SELECT_WITH_IMAGES} WHERE ${conditions.join(' AND ')} GROUP BY l.id ORDER BY l.created_at DESC`;

    if (limit) {
      values.push(limit);
      sql += ` LIMIT $${values.length}`;
    }

    const result = await query(sql, values);
    return result.rows.map(rowToListing);
  },

  findListingsByUserId: async (userId) => {
    const result = await query(
      `${LISTING_SELECT_WITH_IMAGES} WHERE l.user_id = $1 GROUP BY l.id ORDER BY l.created_at DESC`,
      [userId]
    );
    return result.rows.map(rowToListing);
  },

  createListing: async (listing) => {
    const result = await query(
      `INSERT INTO listings (user_id, title, description, category, price, status, image_url, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        listing.userId,
        listing.title,
        listing.description,
        listing.category,
        listing.price,
        listing.status,
        listing.imageUrl,
        listing.location,
      ]
    );
    const created = result.rows[0];

    const imageUrls = listing.images || [];
    if (imageUrls.length > 0) {
      const values = [];
      const placeholders = imageUrls.map((url, i) => {
        values.push(created.id, url, i);
        const base = i * 3;
        return `($${base + 1}, $${base + 2}, $${base + 3})`;
      });
      await query(
        `INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES ${placeholders.join(', ')}`,
        values
      );
    }

    return rowToListing({ ...created, image_urls: imageUrls });
  },
});

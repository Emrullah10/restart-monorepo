import { ValidationError } from '@restart/errors';

export const makeProduct = ({ id, sellerId, title, description, category, price, rating, location, imageUrl, isAvailable, createdAt }) => ({
  id,
  sellerId,
  title,
  description,
  category,
  price,
  rating: rating || 0,
  location,
  imageUrl,
  isAvailable: isAvailable !== undefined ? isAvailable : true,
  createdAt: createdAt || new Date(),
});

export const validateProduct = (product) => {
  if (!product.title) throw new ValidationError('Product title is required');
  if (product.price < 0) throw new ValidationError('Product price cannot be negative');
};

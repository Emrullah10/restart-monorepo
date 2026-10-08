import { ValidationError } from '@teknolup/errors';

export const makeListing = ({ id, userId, title, description, category, price, status, imageUrl, location, createdAt }) => ({
  id,
  userId,
  title,
  description,
  category,
  price,
  status: status || 'active',
  imageUrl,
  location,
  createdAt: createdAt || new Date(),
});

export const validateListing = (listing) => {
  if (!listing.title) throw new ValidationError('Title is required');
  if (listing.price < 0) throw new ValidationError('Price cannot be negative');
};

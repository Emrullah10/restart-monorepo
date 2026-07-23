export const makeServiceCenter = ({ id, name, type, latitude, longitude, rating, tags, address, isActive, createdAt }) => ({
  id,
  name,
  type,
  latitude,
  longitude,
  rating,
  tags,
  address,
  isActive: isActive !== undefined ? isActive : true,
  createdAt: createdAt || new Date(),
});

export const serviceCenterToJSON = (service) => ({
  id: service.id,
  name: service.name,
  type: service.type,
  latitude: service.latitude,
  longitude: service.longitude,
  rating: service.rating,
  tags: service.tags ? service.tags.split(',') : [],
  address: service.address,
  isActive: service.isActive,
});

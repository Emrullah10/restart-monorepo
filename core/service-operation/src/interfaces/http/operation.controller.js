import { serviceCenterToJSON } from '../../domain/entities/service.entity.js';
import { activityToJSON } from '../../domain/entities/activity.entity.js';

export const makeOperationController = ({
  getServices,
  getNearbyServices,
  getActivities,
  logRecycle,
  calculateImpact,
  operationRepo,
}) => ({
  getServices: async (req, res) => {
    const { type } = req.query;
    const services = await getServices({ type });
    res.json(services.map(serviceCenterToJSON));
  },

  getNearbyServices: async (req, res) => {
    const { lat, lng, radius = 5000, type } = req.query;
    const services = await getNearbyServices({ lat, lng, radiusMeters: radius, type });
    res.json(services);
  },

  getActivities: async (req, res) => {
    const { userId } = req.params;
    const { limit = 10 } = req.query;
    const activities = await getActivities({ userId, limit: parseInt(limit, 10) });
    res.json(activities.map(activityToJSON));
  },

  logRecycle: async (req, res) => {
    const result = await logRecycle(req.body);
    res.status(201).json(result);
  },

  getRecycleHistory: async (req, res) => {
    const { userId } = req.params;
    const history = await operationRepo.getRecycleHistory(userId);
    res.json(history);
  },

  calculateImpact: async (req, res) => {
    const { productModel, condition } = req.body;
    const result = await calculateImpact({ productModel, condition });
    res.json(result);
  },

  findCouriers: async (req, res) => {
    const { lat, lng, radius = 3000, vehicleType, electricOnly } = req.body;
    const couriers = await operationRepo.findNearbyCouriers({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      radiusMeters: parseInt(radius, 10),
      vehicleType,
      electricOnly: electricOnly === true,
    });
    res.json(couriers);
  },
});

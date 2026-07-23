import { makeServiceCenter, serviceCenterToJSON } from '../../../domain/entities/service.entity.js';
import { makeActivity } from '../../../domain/entities/activity.entity.js';

const toRad = (deg) => deg * (Math.PI / 180);

const haversineDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const rowToServiceCenter = (row) =>
  makeServiceCenter({
    id: row.id,
    name: row.name,
    type: row.type,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    rating: parseFloat(row.rating),
    tags: row.tags,
    address: row.address,
    isActive: row.is_active,
    createdAt: row.created_at,
  });

const rowToActivity = (row) =>
  makeActivity({
    id: row.id,
    userId: row.user_id,
    activityType: row.activity_type,
    title: row.title,
    description: row.description,
    pointsEarned: row.points_earned,
    amountEarned: parseFloat(row.amount_earned) || 0,
    createdAt: row.created_at,
  });

export const makeOperationRepository = ({ query }) => {
  const findNearbyWithPostGIS = async ({ lat, lng, radiusMeters, type }) => {
    let sql = `
      SELECT *, ST_Distance(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance_meters
      FROM service_centers
      WHERE is_active = true AND location IS NOT NULL
        AND ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
    `;
    const params = [lng, lat, radiusMeters];
    if (type) {
      sql += ' AND type = $4';
      params.push(type);
    }
    sql += ' ORDER BY distance_meters ASC';

    const result = await query(sql, params);
    return result.rows.map((row) => ({
      ...serviceCenterToJSON(rowToServiceCenter(row)),
      distanceMeters: parseFloat(row.distance_meters) || 0,
    }));
  };

  const findNearbyWithHaversine = async ({ lat, lng, radiusMeters, type }) => {
    let sql = 'SELECT * FROM service_centers WHERE is_active = true';
    const params = [];
    if (type) {
      sql += ' AND type = $1';
      params.push(type);
    }
    sql += ' ORDER BY rating DESC';

    const result = await query(sql, params);
    return result.rows
      .map((row) => {
        const service = rowToServiceCenter(row);
        const distanceMeters = Math.round(haversineDistanceKm(lat, lng, row.latitude, row.longitude) * 1000);
        return { ...serviceCenterToJSON(service), distanceMeters };
      })
      .filter((s) => s.distanceMeters <= radiusMeters)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  };

  return {
    findAllServices: async ({ type } = {}) => {
      let sql = 'SELECT * FROM service_centers WHERE is_active = true';
      const params = [];
      if (type) {
        sql += ' AND type = $1';
        params.push(type);
      }
      sql += ' ORDER BY rating DESC';

      const result = await query(sql, params);
      return result.rows.map(rowToServiceCenter);
    },

    findNearbyServices: async ({ lat, lng, radiusMeters = 5000, type } = {}) => {
      try {
        const postgisResult = await findNearbyWithPostGIS({ lat, lng, radiusMeters, type });
        if (postgisResult.length > 0) return postgisResult;
      } catch (e) {
        console.log('[NearbyServices] PostGIS failed, using fallback:', e.message);
      }
      return findNearbyWithHaversine({ lat, lng, radiusMeters, type });
    },

    findActivitiesByUserId: async (userId, limit = 10) => {
      const result = await query('SELECT * FROM activities WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2', [
        userId,
        limit,
      ]);
      return result.rows.map(rowToActivity);
    },

    logRecycle: async ({ userId, serviceCenterId, wasteType, weightKg, isElectricTransport = false }) => {
      const basePoints = Math.round(weightKg * 10);
      const electricMultiplier = isElectricTransport ? 1.5 : 1.0;
      const bonusPoints = isElectricTransport ? Math.round(basePoints * 0.5) : 0;
      const totalPoints = Math.round(basePoints * electricMultiplier);
      const commissionTl = weightKg * 0.5;

      const logResult = await query(
        `INSERT INTO recycle_logs
          (user_id, service_center_id, waste_type, weight_kg, is_electric_transport,
           base_points, bonus_points, total_points, commission_tl, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'completed')
         RETURNING *`,
        [userId, serviceCenterId, wasteType, weightKg, isElectricTransport, basePoints, bonusPoints, totalPoints, commissionTl]
      );

      await query(
        `INSERT INTO activities (user_id, activity_type, title, description, points_earned)
         VALUES ($1, 'recycle', 'Geri Dönüşüm', $2, $3)`,
        [userId, `${weightKg} kg ${wasteType} geri dönüştürüldü`, totalPoints]
      );

      await query(
        `UPDATE user_stats
         SET total_points = total_points + $1, prevented_waste_kg = prevented_waste_kg + $2
         WHERE user_id = $3`,
        [totalPoints, weightKg, userId]
      );

      return { ...logResult.rows[0], totalPoints, bonusPoints, commissionTl };
    },

    getRecycleHistory: async (userId) => {
      const result = await query('SELECT * FROM recycle_logs WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      return result.rows;
    },

    updatePoints: async (userId, points) => {
      await query('UPDATE user_stats SET total_points = total_points + $1 WHERE user_id = $2', [points, userId]);
    },

    findNearbyCouriers: async ({ lat, lng, radiusMeters = 3000, vehicleType, electricOnly = false }) => {
      let sql = `
        SELECT c.*, u.full_name,
          ST_Distance(c.location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) as distance_meters
        FROM couriers c
        JOIN users u ON c.user_id = u.id
        WHERE c.is_available = true AND c.location IS NOT NULL
          AND ST_DWithin(c.location::geography, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
      `;
      const params = [lng, lat, radiusMeters];

      if (electricOnly) sql += ' AND c.is_electric = true';
      if (vehicleType) {
        sql += ` AND c.vehicle_type = $${params.length + 1}`;
        params.push(vehicleType);
      }
      sql += ' ORDER BY c.is_electric DESC, distance_meters ASC';

      const result = await query(sql, params);
      return result.rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        fullName: row.full_name,
        vehicleType: row.vehicle_type,
        isElectric: row.is_electric,
        capacityKg: parseFloat(row.capacity_kg),
        rating: parseFloat(row.rating),
        totalDeliveries: row.total_deliveries,
        distanceMeters: parseFloat(row.distance_meters),
        estimatedMinutes: Math.ceil(parseFloat(row.distance_meters) / 200),
      }));
    },
  };
};

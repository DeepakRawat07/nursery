import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  createPlant,
  findPlantById,
  listPlants,
  softDeletePlant,
  updatePlant
} from '../models/plant.model.js';
import {
  validateCreatePlantPayload,
  validateUpdatePlantPayload
} from '../validators/plant.validator.js';

const normalizeFilters = (query) => ({
  q: query.q ? String(query.q).trim() : undefined,
  category: query.category ? String(query.category).trim() : undefined,
  minPrice: query.minPrice !== undefined ? Number(query.minPrice) : undefined,
  maxPrice: query.maxPrice !== undefined ? Number(query.maxPrice) : undefined,
  inStock: query.inStock === 'true' || query.inStock === true,
  sort: query.sort ? String(query.sort) : 'newest',
  page: query.page,
  limit: query.limit
});

export const getPlants = asyncHandler(async (req, res) => {
  const plants = await listPlants(req.db, normalizeFilters(req.query));

  res.json({
    success: true,
    data: plants
  });
});

export const getAdminPlants = asyncHandler(async (req, res) => {
  const plants = await listPlants(req.db, normalizeFilters(req.query), { includeInactive: true });

  res.json({
    success: true,
    data: plants
  });
});

export const getPlantById = asyncHandler(async (req, res) => {
  const plant = await findPlantById(req.db, Number(req.params.plantId), {
    includeInactive: req.user?.role === 'ADMIN'
  });

  if (!plant) {
    throw new ApiError(404, 'Plant not found.');
  }

  res.json({
    success: true,
    data: plant
  });
});

export const createPlantHandler = asyncHandler(async (req, res) => {
  const payload = validateCreatePlantPayload(req.body, req.file);
  const plant = await createPlant(req.db, payload);

  res.status(201).json({
    success: true,
    message: 'Plant created successfully.',
    data: plant
  });
});

export const updatePlantHandler = asyncHandler(async (req, res) => {
  const plantId = Number(req.params.plantId);
  const existingPlant = await findPlantById(req.db, plantId, { includeInactive: true });

  if (!existingPlant) {
    throw new ApiError(404, 'Plant not found.');
  }

  const payload = validateUpdatePlantPayload(req.body, req.file);
  const plant = await updatePlant(req.db, plantId, payload);

  res.json({
    success: true,
    message: 'Plant updated successfully.',
    data: plant
  });
});

export const deletePlantHandler = asyncHandler(async (req, res) => {
  const plant = await softDeletePlant(req.db, Number(req.params.plantId));

  if (!plant) {
    throw new ApiError(404, 'Plant not found.');
  }

  res.json({
    success: true,
    message: 'Plant archived successfully.',
    data: plant
  });
});

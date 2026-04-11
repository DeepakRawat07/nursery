import ApiError from '../utils/ApiError.js';

const parsePrice = (value, fieldName) => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new ApiError(400, `${fieldName} must be a valid non-negative number.`);
  }

  return Number(parsed.toFixed(2));
};

const parseStock = (value) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new ApiError(400, 'Stock must be a non-negative integer.');
  }

  return parsed;
};

const readString = (value) => {
  const normalized = String(value || '').trim();
  return normalized || undefined;
};

const parseBoolean = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return undefined;
};

const buildImageUrl = (file, body) => {
  if (file) {
    return `/uploads/${file.filename}`;
  }

  return readString(body.imageUrl);
};

const validateBasePlantFields = (payload, file, partial = false) => {
  const name = readString(payload.name);
  const description = readString(payload.description);
  const category = readString(payload.category);
  const imageUrl = buildImageUrl(file, payload);
  const isActive = parseBoolean(payload.isActive);
  const price = payload.price !== undefined ? parsePrice(payload.price, 'Price') : undefined;
  const stock = payload.stock !== undefined ? parseStock(payload.stock) : undefined;

  if (!partial) {
    if (!name || !description || !category || price === undefined || stock === undefined) {
      throw new ApiError(400, 'Name, description, category, price, and stock are required.');
    }
  }

  if (!partial && !imageUrl) {
    throw new ApiError(400, 'An image or image URL is required.');
  }

  return Object.fromEntries(
    Object.entries({
      name,
      description,
      category,
      imageUrl,
      price,
      stock,
      isActive
    }).filter(([, value]) => value !== undefined)
  );
};

export const validateCreatePlantPayload = (payload, file) =>
  validateBasePlantFields(payload, file, false);

export const validateUpdatePlantPayload = (payload, file) => {
  const normalized = validateBasePlantFields(payload, file, true);

  if (Object.keys(normalized).length === 0) {
    throw new ApiError(400, 'At least one plant field must be provided for update.');
  }

  return normalized;
};

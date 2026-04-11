import ApiError from '../utils/ApiError.js';

const parseInteger = (value, fieldName) => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ApiError(400, `${fieldName} must be a positive integer.`);
  }

  return parsed;
};

export const validateCartItemPayload = (payload) => ({
  plantId: parseInteger(payload.plantId, 'plantId'),
  quantity: parseInteger(payload.quantity || 1, 'quantity')
});

export const validateCartQuantityPayload = (payload) => ({
  quantity: parseInteger(payload.quantity, 'quantity')
});

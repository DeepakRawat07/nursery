import ApiError from '../utils/ApiError.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeValue = (value) => String(value || '').trim();

export const validateCheckoutPayload = (payload) => {
  const shippingName = normalizeValue(payload.shippingName);
  const shippingEmail = normalizeValue(payload.shippingEmail).toLowerCase();
  const shippingPhone = normalizeValue(payload.shippingPhone);
  const shippingAddressLine1 = normalizeValue(payload.shippingAddressLine1);
  const shippingAddressLine2 = normalizeValue(payload.shippingAddressLine2) || null;
  const shippingCity = normalizeValue(payload.shippingCity);
  const shippingState = normalizeValue(payload.shippingState);
  const shippingPostalCode = normalizeValue(payload.shippingPostalCode);

  if (
    !shippingName ||
    !shippingEmail ||
    !shippingPhone ||
    !shippingAddressLine1 ||
    !shippingCity ||
    !shippingState ||
    !shippingPostalCode
  ) {
    throw new ApiError(400, 'Complete shipping information is required.');
  }

  if (!emailPattern.test(shippingEmail)) {
    throw new ApiError(400, 'A valid shipping email is required.');
  }

  return {
    shippingName,
    shippingEmail,
    shippingPhone,
    shippingAddressLine1,
    shippingAddressLine2,
    shippingCity,
    shippingState,
    shippingPostalCode
  };
};

export const validateOrderStatusPayload = (payload) => {
  const status = String(payload.status || '').trim().toUpperCase();
  const allowedStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, 'Invalid order status.');
  }

  return { status };
};

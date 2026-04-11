import asyncHandler from '../utils/asyncHandler.js';
import {
  addItemToCart,
  getCartByUserId,
  removeCartItem,
  updateCartItemQuantity
} from '../models/cart.model.js';
import { validateCartItemPayload, validateCartQuantityPayload } from '../validators/cart.validator.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getCartByUserId(req.db, req.user.id);

  res.json({
    success: true,
    data: cart
  });
});

export const addCartItem = asyncHandler(async (req, res) => {
  const payload = validateCartItemPayload(req.body);
  const cart = await addItemToCart(req.db, req.user.id, payload.plantId, payload.quantity);

  res.status(201).json({
    success: true,
    message: 'Plant added to cart.',
    data: cart
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const payload = validateCartQuantityPayload(req.body);
  const cart = await updateCartItemQuantity(
    req.db,
    req.user.id,
    Number(req.params.itemId),
    payload.quantity
  );

  res.json({
    success: true,
    message: 'Cart updated successfully.',
    data: cart
  });
});

export const deleteCartItem = asyncHandler(async (req, res) => {
  const cart = await removeCartItem(req.db, req.user.id, Number(req.params.itemId));

  res.json({
    success: true,
    message: 'Item removed from cart.',
    data: cart
  });
});

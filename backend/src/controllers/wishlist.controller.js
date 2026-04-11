import asyncHandler from '../utils/asyncHandler.js';
import { addWishlistItem, getWishlistByUserId, removeWishlistItem } from '../models/wishlist.model.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await getWishlistByUserId(req.db, req.user.id);

  res.json({
    success: true,
    data: wishlist
  });
});

export const addWishlistPlant = asyncHandler(async (req, res) => {
  const plantId = Number(req.body.plantId);
  const wishlist = await addWishlistItem(req.db, req.user.id, plantId);

  res.status(201).json({
    success: true,
    message: 'Plant added to wishlist.',
    data: wishlist
  });
});

export const deleteWishlistPlant = asyncHandler(async (req, res) => {
  const wishlist = await removeWishlistItem(req.db, req.user.id, Number(req.params.plantId));

  res.json({
    success: true,
    message: 'Plant removed from wishlist.',
    data: wishlist
  });
});

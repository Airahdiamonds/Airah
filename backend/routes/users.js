import express from 'express'
import {
	addToFavorites,
	getUserFavorites,
	mergeGuestFavorites,
	removeFromFavorites,
} from '../drizzle/features/favorites.js'
import {
	addToCart,
	getUserCart,
	mergeGuestCart,
	removeFromCart,
} from '../drizzle/features/cart.js'
import { optionalSession, requireSession } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { resolveIdentity } from '../utils/identity.js'
import {
	addToCartSchema,
	addToFavoritesSchema,
	mergeCartSchema,
	mergeFavoritesSchema,
} from '../schemas.js'

const router = express.Router()

// ── Favorites ─────────────────────────────────────────────────────────────────

router.get(
	'/api/users/getFavorites',
	optionalSession,
	asyncHandler(async (req, res) => {
		const { userId, guestId } = resolveIdentity(req, 'query')
		if (!userId && !guestId) return res.json([])
		const data = await getUserFavorites({ user_id: userId, guest_id: guestId })
		res.json(data)
	})
)

router.post(
	'/api/users/addToFavorites',
	optionalSession,
	validate(addToFavoritesSchema),
	asyncHandler(async (req, res) => {
		const { userId, guestId } = resolveIdentity(req, 'body')
		const { productId, diamondId, ringStyleId } = req.body
		await addToFavorites({
			user_id: userId,
			guest_id: guestId,
			product_id: productId,
			diamond_id: diamondId,
			ring_style_id: ringStyleId,
		})
		res.json({ success: true })
	})
)

router.delete(
	'/api/users/deleteFavorites',
	optionalSession,
	asyncHandler(async (req, res) => {
		const { userId, guestId } = resolveIdentity(req, 'body')
		const { productId, diamondId, ringStyleId } = req.body
		await removeFromFavorites({
			user_id: userId,
			guest_id: guestId,
			product_id: productId,
			diamond_id: diamondId,
			ring_style_id: ringStyleId,
		})
		res.json({ success: true })
	})
)

// Merges guest favorites into the user's favorites on login.
// Mirrors mergeCart: client sends just the guestId; server reads the rows.
router.post(
	'/api/users/mergeFavorites',
	requireSession,
	validate(mergeFavoritesSchema),
	asyncHandler(async (req, res) => {
		const { guestId } = req.body
		if (!guestId) return res.json({ success: true })
		await mergeGuestFavorites({ guest_id: guestId, user_id: req.user.user_id })
		res.json({ success: true })
	})
)

// ── Cart ──────────────────────────────────────────────────────────────────────

router.get(
	'/api/users/getCart',
	optionalSession,
	asyncHandler(async (req, res) => {
		const { userId, guestId } = resolveIdentity(req, 'query')
		const data = await getUserCart({ user_id: userId, guest_id: guestId })
		res.json(data)
	})
)

router.post(
	'/api/users/addToCart',
	optionalSession,
	validate(addToCartSchema),
	asyncHandler(async (req, res) => {
		const { userId, guestId } = resolveIdentity(req, 'body')
		const { productId, diamondId, ringStyleId, ringSize, quantity } = req.body
		await addToCart({
			user_id: userId,
			guest_id: guestId,
			product_id: productId,
			quantity,
			diamond_id: diamondId,
			ring_style_id: ringStyleId,
			ring_size: ringSize,
		})
		res.json({ success: true })
	})
)

router.delete(
	'/api/users/deleteCart',
	optionalSession,
	asyncHandler(async (req, res) => {
		const { userId, guestId } = resolveIdentity(req, 'query')
		const { cartId } = req.query
		await removeFromCart({ user_id: userId, guest_id: guestId, cart_id: cartId })
		res.json({ success: true })
	})
)

// Merges guest cart into user cart on login
router.post(
	'/api/users/mergeCart',
	requireSession,
	validate(mergeCartSchema),
	asyncHandler(async (req, res) => {
		const { guestId } = req.body
		if (!guestId) return res.json({ success: true })
		await mergeGuestCart({ guest_id: guestId, user_id: req.user.user_id })
		res.json({ success: true })
	})
)

export default router

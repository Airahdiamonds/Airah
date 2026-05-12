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
import {
	addToCartSchema,
	addToFavoritesSchema,
	mergeCartSchema,
	mergeFavoritesSchema,
} from '../schemas.js'

const router = express.Router()

// ── Favorites ─────────────────────────────────────────────────────────────────

router.get('/api/users/getFavorites/:user_id', requireSession, async (req, res) => {
	try {
		// Always use the authenticated session's user_id, not the URL param
		const data = await getUserFavorites({ user_id: req.user.user_id })
		res.json(data)
	} catch (err) {
		console.error('getFavorites Error: ', err)
		res.status(500).json({ error: 'Failed to get User Favorites' })
	}
})

router.post('/api/users/addToFavorites', requireSession, validate(addToFavoritesSchema), async (req, res) => {
	try {
		const { product_id, diamond_id, ring_style_id } = req.body
		await addToFavorites({ user_id: req.user.user_id, product_id, diamond_id, ring_style_id })
		res.json({ success: true })
	} catch (err) {
		console.error('addToFavorites Error:', err)
		res.status(500).json({ error: 'Failed to add to Favorites' })
	}
})

router.delete('/api/users/deleteFavorites', requireSession, async (req, res) => {
	try {
		const { product_id, diamond_id, ring_style_id } = req.body
		await removeFromFavorites({ user_id: req.user.user_id, product_id, diamond_id, ring_style_id })
		res.json({ success: true })
	} catch (err) {
		console.error('removeFromFavorites Error:', err)
		res.status(500).json({ error: 'Failed to remove from Favorites' })
	}
})

// Merges guest favorites (sent as an array from the client) into the user's favorites on login
router.post('/api/users/mergeFavorites', requireSession, validate(mergeFavoritesSchema), async (req, res) => {
	try {
		const { items } = req.body
		if (!Array.isArray(items) || items.length === 0) return res.json({ success: true })
		await mergeGuestFavorites({ items, user_id: req.user.user_id })
		res.json({ success: true })
	} catch (err) {
		console.error('mergeFavorites Error:', err)
		res.status(500).json({ error: 'Failed to merge favorites' })
	}
})

// ── Cart ──────────────────────────────────────────────────────────────────────

router.get('/api/users/getCart', optionalSession, async (req, res) => {
	try {
		const user_id = req.user?.user_id ?? null
		const guest_id = user_id ? null : req.query.guest_id
		const data = await getUserCart({ user_id, guest_id })
		res.json(data)
	} catch (err) {
		console.error('getCart Error: ', err)
		res.status(500).json({ error: 'Failed to get User Cart' })
	}
})

router.post('/api/users/addToCart', optionalSession, validate(addToCartSchema), async (req, res) => {
	try {
		const user_id = req.user?.user_id ?? null
		const { guest_id, product_id, diamond_id, ring_style_id, ring_size, quantity } = req.body
		await addToCart({
			user_id,
			guest_id: user_id ? null : guest_id,
			product_id,
			quantity,
			diamond_id,
			ring_style_id,
			ring_size,
		})
		res.json({ success: true })
	} catch (err) {
		console.error('addToCart Error:', err)
		res.status(400).json({ error: err.message || 'Failed to add to Cart' })
	}
})

router.delete('/api/users/deleteCart', optionalSession, async (req, res) => {
	try {
		const user_id = req.user?.user_id ?? null
		const { guestId, cartId } = req.query
		await removeFromCart({ user_id, guest_id: user_id ? null : guestId, cart_id: cartId })
		res.json({ success: true })
	} catch (err) {
		console.error('removeFromCart Error:', err)
		res.status(500).json({ error: 'Failed to remove from Cart' })
	}
})

// Merges guest cart into user cart on login
router.post('/api/users/mergeCart', requireSession, validate(mergeCartSchema), async (req, res) => {
	try {
		const { guestId } = req.body
		if (!guestId) return res.json({ success: true })
		await mergeGuestCart({ guest_id: guestId, user_id: req.user.user_id })
		res.json({ success: true })
	} catch (err) {
		console.error('mergeCart Error:', err)
		res.status(500).json({ error: 'Failed to merge cart' })
	}
})

export default router

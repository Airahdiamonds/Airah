import express from 'express'
import {
	addAddress,
	deleteAddress,
	getUserSavedAddresses,
	updateAddress,
} from '../drizzle/features/addresses.js'
import { requireSession } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { addressSchema } from '../schemas.js'

const router = express.Router()

// All routes in this file require a logged-in user. Address management
// for guests happens transparently at checkout in routes/orders.js
// (the address is persisted as a snapshot against the order_id).

router.get(
	'/api/addresses',
	requireSession,
	asyncHandler(async (req, res) => {
		const rows = await getUserSavedAddresses(req.user.user_id)
		res.json(rows)
	})
)

router.post(
	'/api/addresses',
	requireSession,
	validate(addressSchema),
	asyncHandler(async (req, res) => {
		const result = await addAddress({
			user_id: req.user.user_id,
			guest_id: null,
			order_id: null,
			...req.body,
		})
		res.json(Array.isArray(result) ? result[0] : { success: true })
	})
)

router.put(
	'/api/addresses/:id',
	requireSession,
	validate(addressSchema),
	asyncHandler(async (req, res) => {
		const row = await updateAddress({
			address_id: req.params.id,
			user_id: req.user.user_id,
			data: req.body,
		})
		if (!row) return res.status(404).json({ error: 'Address not found' })
		res.json(row)
	})
)

router.delete(
	'/api/addresses/:id',
	requireSession,
	asyncHandler(async (req, res) => {
		const ok = await deleteAddress({
			address_id: req.params.id,
			user_id: req.user.user_id,
		})
		if (!ok) return res.status(404).json({ error: 'Address not found' })
		res.json({ success: true })
	})
)

export default router

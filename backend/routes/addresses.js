import express from 'express'
import { eq, and, isNull } from 'drizzle-orm'
import { db } from '../drizzle/db.js'
import { addressesTable } from '../drizzle/schema/addresses.js'
import { requireSession } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { addressSchema } from '../schemas.js'

const router = express.Router()

// Saved addresses (order_id IS NULL) belong to a logged-in user.
router.get('/api/addresses', requireSession, async (req, res) => {
	try {
		const rows = await db
			.select()
			.from(addressesTable)
			.where(
				and(
					eq(addressesTable.user_id, req.user.user_id),
					isNull(addressesTable.order_id)
				)
			)
		res.json(rows)
	} catch (err) {
		console.error('listAddresses Error:', err)
		res.status(500).json({ error: 'Failed to list addresses' })
	}
})

router.post('/api/addresses', requireSession, validate(addressSchema), async (req, res) => {
	try {
		const [row] = await db
			.insert(addressesTable)
			.values({
				user_id: req.user.user_id,
				guest_id: null,
				order_id: null,
				full_name: req.body.full_name,
				phone_number: req.body.phone_number,
				address_line1: req.body.address_line1,
				address_line2: req.body.address_line2 ?? '',
				city: req.body.city,
				state: req.body.state,
				country: req.body.country,
				pincode: req.body.pincode,
				is_shipping: req.body.is_shipping ?? true,
				is_billing: req.body.is_billing ?? false,
			})
			.returning()
		res.json(row)
	} catch (err) {
		console.error('createAddress Error:', err)
		res.status(500).json({ error: 'Failed to create address' })
	}
})

router.put('/api/addresses/:id', requireSession, validate(addressSchema), async (req, res) => {
	try {
		const { id } = req.params
		const [row] = await db
			.update(addressesTable)
			.set({
				full_name: req.body.full_name,
				phone_number: req.body.phone_number,
				address_line1: req.body.address_line1,
				address_line2: req.body.address_line2 ?? '',
				city: req.body.city,
				state: req.body.state,
				country: req.body.country,
				pincode: req.body.pincode,
				is_shipping: req.body.is_shipping ?? true,
				is_billing: req.body.is_billing ?? false,
			})
			.where(
				and(
					eq(addressesTable.address_id, Number(id)),
					eq(addressesTable.user_id, req.user.user_id),
					isNull(addressesTable.order_id)
				)
			)
			.returning()
		if (!row) return res.status(404).json({ error: 'Address not found' })
		res.json(row)
	} catch (err) {
		console.error('updateAddress Error:', err)
		res.status(500).json({ error: 'Failed to update address' })
	}
})

router.delete('/api/addresses/:id', requireSession, async (req, res) => {
	try {
		const { id } = req.params
		const result = await db
			.delete(addressesTable)
			.where(
				and(
					eq(addressesTable.address_id, Number(id)),
					eq(addressesTable.user_id, req.user.user_id),
					isNull(addressesTable.order_id)
				)
			)
			.returning({ address_id: addressesTable.address_id })
		if (result.length === 0) return res.status(404).json({ error: 'Address not found' })
		res.json({ success: true })
	} catch (err) {
		console.error('deleteAddress Error:', err)
		res.status(500).json({ error: 'Failed to delete address' })
	}
})

export default router

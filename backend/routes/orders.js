import express from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import {
	cancelOrder,
	createOrderFromCart,
	getOrdersByUser,
	recordPaymentIfNew,
	updateStatus,
} from '../drizzle/features/orders.js'
import { validateCoupon, incrementCouponUsage } from '../drizzle/features/master.js'
import { optionalSession } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { paymentLimiter, writeLimiter } from '../middleware/rateLimit.js'
import {
	couponSchema,
	createOrderSchema,
	verifyPaymentSchema,
} from '../schemas.js'

const router = express.Router()

const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// Resolves the effective identity for a request:
// authenticated users always win over any client-supplied id; guests fall back to the body/query guestId.
function resolveIdentity(req, source = 'body') {
	if (req.user?.user_id) {
		return { userId: req.user.user_id, guestId: null }
	}
	const guestId = req[source]?.guestId ?? null
	return { userId: null, guestId }
}

router.get('/api/orders', optionalSession, async (req, res) => {
	try {
		const { userId, guestId } = resolveIdentity(req, 'query')
		if (!userId && !guestId) return res.json([])
		const data = await getOrdersByUser({ userId, guestId })
		res.json(data)
	} catch (err) {
		console.error('getOrdersByUser Error:', err)
		res.status(500).json({ error: 'Failed to get order list' })
	}
})

router.post('/api/createOrder', paymentLimiter, optionalSession, validate(createOrderSchema), async (req, res) => {
	try {
		const { userId, guestId } = resolveIdentity(req, 'body')
		if (!userId && !guestId) return res.status(400).json({ error: 'Missing identity' })
		const { couponCode, shippingAddress } = req.body
		const { order } = await createOrderFromCart({
			userId,
			guestId,
			couponCode,
			shippingAddress,
		})
		res.json(order)
	} catch (err) {
		console.error('createOrder Error:', err)
		res.status(400).json({ error: err.message || 'Failed to create order' })
	}
})

router.post('/api/cancelOrder', optionalSession, async (req, res) => {
	try {
		const { orderId } = req.body
		await cancelOrder(orderId)
		res.json({ success: true })
	} catch (err) {
		console.error('cancelOrder Error:', err)
		res.status(500).json({ error: 'Failed to cancel order' })
	}
})

router.post('/api/validateCoupon', writeLimiter, validate(couponSchema), async (req, res) => {
	try {
		const { couponCode } = req.body
		const result = await validateCoupon(couponCode)
		res.json(result)
	} catch (err) {
		console.error('validateCoupon Error:', err.message)
		res.status(400).json({ error: err.message })
	}
})

// ── Razorpay ─────────────────────────────────────────────────────────────────

router.post('/api/razorpay/create-order', paymentLimiter, optionalSession, validate(createOrderSchema), async (req, res) => {
	try {
		const { userId, guestId } = resolveIdentity(req, 'body')
		if (!userId && !guestId) return res.status(400).json({ error: 'Missing identity' })
		const { couponCode, shippingAddress } = req.body

		const { order, total } = await createOrderFromCart({
			userId,
			guestId,
			couponCode,
			shippingAddress,
		})

		const razorpayOrder = await razorpay.orders.create({
			amount: Math.round(total * 100),
			currency: 'INR',
			receipt: `receipt_order_${order.order_id}`,
		})

		res.json({ razorpayOrder, dbOrderId: order.order_id, totalPrice: total })
	} catch (err) {
		console.error('razorpay create-order Error:', err)
		res.status(400).json({ error: err.message || 'Failed to create Razorpay order' })
	}
})

router.post('/api/razorpay/verify-payment', paymentLimiter, optionalSession, validate(verifyPaymentSchema), async (req, res) => {
	try {
		const {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
			dbOrderId,
			couponCode,
		} = req.body
		const { userId } = resolveIdentity(req, 'body')

		const body = razorpay_order_id + '|' + razorpay_payment_id
		const expectedSignature = crypto
			.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
			.update(body)
			.digest('hex')

		if (expectedSignature !== razorpay_signature) {
			return res.status(400).json({ success: false, error: 'Invalid signature' })
		}

		// Fetch the verified amount from Razorpay rather than trusting the client.
		const rzpPayment = await razorpay.payments.fetch(razorpay_payment_id)
		const amount = Math.round((rzpPayment?.amount ?? 0) / 100)

		const recorded = await recordPaymentIfNew({
			orderId: dbOrderId,
			userId: userId ?? null,
			amount,
			razorpayPaymentId: razorpay_payment_id,
		})

		if (recorded && couponCode) {
			try {
				await incrementCouponUsage(couponCode)
			} catch (couponErr) {
				console.error('incrementCouponUsage Error (payment still recorded):', couponErr)
			}
		}

		res.json({ success: true, recorded })
	} catch (err) {
		console.error('razorpay verify-payment Error:', err)
		res.status(500).json({ error: 'Failed to verify payment' })
	}
})

export default router

import { z } from 'zod'

// ── auth ─────────────────────────────────────────────────────────────────────

export const signupSchema = z.object({
	name: z.string().trim().min(1).max(100),
	email: z.string().trim().toLowerCase().email().max(254),
	password: z.string().min(8).max(200),
})

export const signinSchema = z.object({
	email: z.string().trim().toLowerCase().email(),
	password: z.string().min(1).max(200),
})

// ── cart / favorites ─────────────────────────────────────────────────────────

const idOrNull = z
	.union([z.coerce.number().int().positive(), z.null()])
	.optional()
	.transform((v) => v ?? null)

const guestIdOrNull = z
	.union([z.string().min(1).max(64), z.null()])
	.optional()
	.transform((v) => v ?? null)

const ringSizeOrNull = z
	.union([z.string().regex(/^\d{1,2}(\.\d)?$/), z.null()])
	.optional()
	.transform((v) => v ?? null)

export const addToCartSchema = z
	.object({
		guest_id: guestIdOrNull,
		product_id: idOrNull,
		diamond_id: idOrNull,
		ring_style_id: idOrNull,
		ring_size: ringSizeOrNull,
		quantity: z.coerce.number().int().min(1).max(99),
	})
	.refine(
		(v) => v.product_id != null || v.diamond_id != null || v.ring_style_id != null,
		{ message: 'Must reference a product, diamond, or ring style' }
	)

export const addToFavoritesSchema = z
	.object({
		product_id: idOrNull,
		diamond_id: idOrNull,
		ring_style_id: idOrNull,
	})
	.refine(
		(v) => v.product_id != null || v.diamond_id != null || v.ring_style_id != null,
		{ message: 'Must reference a product, diamond, or ring style' }
	)

export const mergeCartSchema = z.object({
	guestId: z.string().min(1).max(64),
})

export const mergeFavoritesSchema = z.object({
	items: z
		.array(
			z.object({
				product_id: idOrNull,
				diamond_id: idOrNull,
				ring_style_id: idOrNull,
			})
		)
		.max(200),
})

// ── orders / payments ────────────────────────────────────────────────────────

export const addressSchema = z.object({
	full_name: z.string().trim().min(1).max(120),
	phone_number: z.string().trim().min(5).max(15),
	address_line1: z.string().trim().min(1).max(200),
	address_line2: z.string().trim().max(200).optional().default(''),
	city: z.string().trim().min(1).max(80),
	state: z.string().trim().min(1).max(80),
	country: z.string().trim().min(1).max(80),
	pincode: z.string().trim().min(3).max(10),
	is_billing: z.boolean().optional().default(false),
})

export const createOrderSchema = z.object({
	guestId: guestIdOrNull,
	couponCode: z.string().trim().min(1).max(64).optional().nullable(),
	shippingAddress: addressSchema,
})

export const verifyPaymentSchema = z.object({
	razorpay_order_id: z.string().min(1).max(120),
	razorpay_payment_id: z.string().min(1).max(120),
	razorpay_signature: z.string().min(1).max(256),
	dbOrderId: z.coerce.number().int().positive(),
	guestId: guestIdOrNull,
	couponCode: z.string().trim().min(1).max(64).optional().nullable(),
})

export const couponSchema = z.object({
	couponCode: z.string().trim().min(1).max(64),
})

// ── reviews ──────────────────────────────────────────────────────────────────

export const reviewSchema = z.object({
	product_id: z.coerce.number().int().positive(),
	rating: z.coerce.number().int().min(1).max(5),
	title: z.string().trim().max(200).optional(),
	comment: z.string().trim().max(5000).optional(),
})

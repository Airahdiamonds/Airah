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
		guestId: guestIdOrNull,
		productId: idOrNull,
		diamondId: idOrNull,
		ringStyleId: idOrNull,
		ringSize: ringSizeOrNull,
		quantity: z.coerce.number().int().min(1).max(99),
	})
	.refine(
		(v) => v.productId != null || v.diamondId != null || v.ringStyleId != null,
		{ message: 'Must reference a product, diamond, or ring style' }
	)

export const addToFavoritesSchema = z
	.object({
		guestId: guestIdOrNull,
		productId: idOrNull,
		diamondId: idOrNull,
		ringStyleId: idOrNull,
	})
	.refine(
		(v) => v.productId != null || v.diamondId != null || v.ringStyleId != null,
		{ message: 'Must reference a product, diamond, or ring style' }
	)

export const mergeCartSchema = z.object({
	guestId: z.string().min(1).max(64),
})

export const mergeFavoritesSchema = z.object({
	guestId: z.string().min(1).max(64),
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

// ── search ───────────────────────────────────────────────────────────────────

export const searchQuerySchema = z
	.object({
		query: z.string().trim().min(1).max(200).optional(),
		search: z.string().trim().min(1).max(200).optional(),
	})
	.transform((value) => ({ query: value.query ?? value.search }))
	.refine((value) => Boolean(value.query), { message: 'Search query is required' })

// ── admin auth / management ──────────────────────────────────────────────────

export const adminLoginSchema = z.object({
	email: z.string().trim().toLowerCase().email().max(254),
	password: z.string().min(1).max(200),
})

export const adminCreateSchema = z.object({
	name: z.string().trim().min(1).max(120),
	email: z.string().trim().toLowerCase().email().max(254),
	password: z.string().min(8).max(200),
	role: z.string().trim().min(1).max(40).optional(),
})

export const adminUpdateSchema = adminCreateSchema.partial()

// Admin catalog forms have many shape-specific price columns. Use
// `passthrough()` so we don't have to enumerate every column — we
// validate the shape exists rather than the content of every field.
export const productSchema = z
	.object({
		name: z.string().trim().min(1).max(200),
		SKU: z.string().trim().min(1).max(80).optional(),
		category: z.string().trim().min(1).max(80).optional(),
		status: z.string().trim().max(40).optional(),
	})
	.passthrough()

export const diamondSchema = z
	.object({
		name: z.string().trim().min(1).max(200),
		SKU: z.string().trim().min(1).max(80).optional(),
		size: z.union([z.string(), z.number()]).optional(),
	})
	.passthrough()

export const styleSchema = z
	.object({
		name: z.string().trim().min(1).max(200),
		SKU: z.string().trim().min(1).max(80).optional(),
	})
	.passthrough()

export const couponEntrySchema = z.object({
	code: z.string().trim().min(1).max(64),
	discount_percentage: z.coerce.number().min(0).max(100),
	expiry_date: z.string().min(1),
	max_uses: z.coerce.number().int().min(1),
})

export const masterEntrySchema = z.object({}).passthrough()

export const updateStatusSchema = z.object({
	orderId: z.coerce.number().int().positive(),
	status: z.string().trim().min(1).max(40),
})

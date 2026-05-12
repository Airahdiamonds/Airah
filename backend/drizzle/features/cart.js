import { and, eq, or, isNotNull, sql } from 'drizzle-orm'
import { db } from '../db.js'
import { cartTable } from '../schema/cart.js'
import { diamondsTable } from '../schema/diamonds.js'
import { productsTable } from '../schema/products.js'
import { ringStylesTable } from '../schema/ringStyles.js'

export async function getUserCart({ user_id, guest_id }) {
	const whereClause = user_id
		? eq(cartTable.user_id, user_id)
		: eq(cartTable.guest_id, guest_id)

	const data = await db
		.select({
			cart_id: cartTable.cart_id,
			product_id: cartTable.product_id,
			diamond_id: cartTable.diamond_id,
			ring_style_id: cartTable.ring_style_id,
			ring_size: cartTable.ring_size,
			quantity: cartTable.quantity,
			product_name: productsTable.name,
			product_price: productsTable.total_cost,
			product_image: productsTable.image_URL,
			diamond_name: diamondsTable.name,
			diamond_price: diamondsTable.price,
			diamond_image: diamondsTable.image_URL,
			ring_style_name: ringStylesTable.name,
			ring_style_price: sql`
				${ringStylesTable.head_style_price} +
				${ringStylesTable.shank_style_price} +
				${ringStylesTable.head_metal_price} +
				${ringStylesTable.shank_metal_price}
			`.as('ring_style_price'),
			ring_images: ringStylesTable.image_URL,
		})
		.from(cartTable)
		.leftJoin(productsTable, eq(cartTable.product_id, productsTable.product_id))
		.leftJoin(diamondsTable, eq(cartTable.diamond_id, diamondsTable.diamond_id))
		.leftJoin(
			ringStylesTable,
			eq(cartTable.ring_style_id, ringStylesTable.ring_style_id)
		)
		.where(
			and(
				whereClause,
				or(
					isNotNull(cartTable.product_id),
					isNotNull(cartTable.diamond_id),
					isNotNull(cartTable.ring_style_id)
				)
			)
		)

	return data
}

export async function addToCart({
	user_id,
	guest_id,
	product_id,
	quantity,
	diamond_id,
	ring_style_id,
	ring_size,
}) {
	if (!user_id && !guest_id) throw new Error('Missing identity')
	if (product_id == null && diamond_id == null && ring_style_id == null) {
		throw new Error('Cart item must reference a product, diamond, or ring style')
	}

	const qty = Math.max(1, Math.min(99, Math.floor(Number(quantity) || 1)))

	const ownerCondition = user_id
		? eq(cartTable.user_id, user_id)
		: eq(cartTable.guest_id, guest_id)

	// Dedup key includes ring_size — same item in two sizes are distinct rows.
	const itemConditions = [ownerCondition]
	if (product_id != null) itemConditions.push(eq(cartTable.product_id, product_id))
	if (diamond_id != null) itemConditions.push(eq(cartTable.diamond_id, diamond_id))
	if (ring_style_id != null) itemConditions.push(eq(cartTable.ring_style_id, ring_style_id))
	if (ring_size != null) itemConditions.push(eq(cartTable.ring_size, ring_size))

	const existing = await db
		.select({ cart_id: cartTable.cart_id })
		.from(cartTable)
		.where(and(...itemConditions))
		.limit(1)

	if (existing.length > 0) {
		await db
			.update(cartTable)
			.set({ quantity: sql`${cartTable.quantity} + ${qty}` })
			.where(eq(cartTable.cart_id, existing[0].cart_id))
	} else {
		await db.insert(cartTable).values({
			user_id,
			guest_id,
			product_id,
			diamond_id,
			ring_style_id,
			ring_size: ring_size ?? null,
			quantity: qty,
		})
	}

	return { success: true }
}

export async function removeFromCart({ user_id, guest_id, cart_id }) {
	const conditions = [eq(cartTable.cart_id, Number(cart_id))]

	if (user_id) {
		conditions.push(eq(cartTable.user_id, user_id))
	} else {
		conditions.push(eq(cartTable.guest_id, guest_id))
	}

	await db.delete(cartTable).where(and(...conditions)).returning()

	return { success: true }
}

// Merges guest cart into a user's cart on login.
// Items already in the user's cart have their quantities incremented.
export async function mergeGuestCart({ guest_id, user_id }) {
	const guestItems = await db
		.select()
		.from(cartTable)
		.where(eq(cartTable.guest_id, guest_id))

	for (const item of guestItems) {
		const conditions = [eq(cartTable.user_id, user_id)]
		if (item.product_id != null) conditions.push(eq(cartTable.product_id, item.product_id))
		if (item.diamond_id != null) conditions.push(eq(cartTable.diamond_id, item.diamond_id))
		if (item.ring_style_id != null) conditions.push(eq(cartTable.ring_style_id, item.ring_style_id))
		if (item.ring_size != null) conditions.push(eq(cartTable.ring_size, item.ring_size))

		const existing = await db
			.select({ cart_id: cartTable.cart_id })
			.from(cartTable)
			.where(and(...conditions))
			.limit(1)

		if (existing.length > 0) {
			await db
				.update(cartTable)
				.set({ quantity: sql`${cartTable.quantity} + ${item.quantity}` })
				.where(eq(cartTable.cart_id, existing[0].cart_id))
			await db.delete(cartTable).where(eq(cartTable.cart_id, item.cart_id))
		} else {
			await db
				.update(cartTable)
				.set({ user_id, guest_id: null })
				.where(eq(cartTable.cart_id, item.cart_id))
		}
	}

	return { success: true }
}

import { and, eq, sql } from 'drizzle-orm'
import { db } from '../db.js'
import { cartTable } from '../schema/cart.js'
import { diamondsTable } from '../schema/diamonds.js'
import { productsTable } from '../schema/products.js'
import { ringStylesTable } from '../schema/ringStyles.js'

export async function getUserCart({ clerk_user_id }) {
	const data = await db
		.select({
			cart_id: cartTable.cart_id,
			product_id: cartTable.product_id,
			diamond_id: cartTable.diamond_id,
			ring_style_id: cartTable.ring_style_id,
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
		.where(eq(cartTable.user_id, clerk_user_id))

	if (!data) throw new Error('Failed to get User Cart')

	return data
}

export async function addToCart({
	user_id,
	product_id,
	quantity,
	diamond_id,
	ring_style_id,
}) {
	const result = await db.insert(cartTable).values({
		user_id: user_id,
		product_id: product_id,
		diamond_id: diamond_id,
		ring_style_id: ring_style_id,
		quantity: quantity,
	})

	if (!result) throw new Error('Failed to add to cart')

	return { success: true }
}

export async function removeFromCart({ clerk_user_id, product_id }) {
	await db
		.delete(cartTable)
		.where(
			and(
				eq(cartTable.user_id, clerk_user_id),
				eq(cartTable.cart_id, product_id)
			)
		)

	return { success: true }
}

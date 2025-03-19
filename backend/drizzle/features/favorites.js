import { and, eq, sql } from 'drizzle-orm'
import { db } from '../db.js'
import { favoritesTable } from '../schema/favorites.js'
import { productsTable } from '../schema/products.js'
import { ringStylesTable } from '../schema/ringStyles.js'
import { diamondsTable } from '../schema/diamonds.js'

export async function getUserFavorites({ clerk_user_id }) {
	const data = await db
		.select({
			favorite_id: favoritesTable.favourite_id,
			product_id: favoritesTable.product_id,
			ring_style_id: favoritesTable.ring_style_id,
			diamond_id: favoritesTable.diamond_id,
			product_name: productsTable.name,
			product_price: productsTable.total_cost,
			product_image: productsTable.image_URL,
			ring_style_name: ringStylesTable.name,
			ring_style_price: sql`
                ${ringStylesTable.head_style_price} +
                ${ringStylesTable.shank_style_price} +
                ${ringStylesTable.head_metal_price} +
                ${ringStylesTable.shank_metal_price}
            `.as('ring_style_price'),
			ring_images: ringStylesTable.image_URL,
			diamond_name: diamondsTable.name,
			diamond_price: diamondsTable.price,
			diamond_image: diamondsTable.image_URL,
			product_type: sql`
                CASE 
                    WHEN ${favoritesTable.product_id} IS NOT NULL THEN 1
                    WHEN ${favoritesTable.diamond_id} IS NOT NULL THEN 2
                    WHEN ${favoritesTable.ring_style_id} IS NOT NULL THEN 3
                    ELSE NULL 
                END
            `.as('product_type'),
		})
		.from(favoritesTable)
		.leftJoin(
			productsTable,
			eq(favoritesTable.product_id, productsTable.product_id)
		)
		.leftJoin(
			ringStylesTable,
			eq(favoritesTable.ring_style_id, ringStylesTable.ring_style_id)
		)
		.leftJoin(
			diamondsTable,
			eq(favoritesTable.diamond_id, diamondsTable.diamond_id)
		)
		.where(eq(favoritesTable.user_id, clerk_user_id))

	if (data == null) throw new Error('Failed to get User Favorites')

	return data
}

export async function addToFavorites({
	user_id,
	product_id,
	diamond_id,
	ring_style_id,
}) {
	const result = await db.insert(favoritesTable).values({
		user_id: user_id,
		product_id: product_id,
		diamond_id: diamond_id,
		ring_style_id: ring_style_id,
	})

	if (!result) throw new Error('Failed to add to favorites')

	return { success: true }
}

export async function removeFromFavorites({
	user_id,
	product_id,
	diamond_id,
	ring_style_id,
}) {
	// Start with the required user condition
	let conditions = [eq(favoritesTable.user_id, user_id)]

	// Add conditions only if the respective values are provided
	if (product_id) conditions.push(eq(favoritesTable.product_id, product_id))
	if (diamond_id) conditions.push(eq(favoritesTable.diamond_id, diamond_id))
	if (ring_style_id)
		conditions.push(eq(favoritesTable.ring_style_id, ring_style_id))
	// Perform the delete operation
	await db.delete(favoritesTable).where(and(...conditions))

	return { success: true }
}

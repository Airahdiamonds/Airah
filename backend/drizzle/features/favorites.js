import { and, eq, isNotNull, or, sql } from 'drizzle-orm'
import { db } from '../db.js'
import { favoritesTable } from '../schema/favorites.js'
import { productsTable } from '../schema/products.js'
import { ringStylesTable } from '../schema/ringStyles.js'
import { diamondsTable } from '../schema/diamonds.js'
import { ringStyleTotalPriceSQL } from '../featureHelpers.js'

export async function getUserFavorites({ user_id, guest_id }) {
	const whereClause = user_id
		? eq(favoritesTable.user_id, user_id)
		: eq(favoritesTable.guest_id, guest_id)

	const data = await db
		.select({
			favorite_id: favoritesTable.favorite_id,
			product_id: favoritesTable.product_id,
			ring_style_id: favoritesTable.ring_style_id,
			diamond_id: favoritesTable.diamond_id,
			product_name: productsTable.name,
			product_price: productsTable.total_cost,
			product_image: productsTable.image_URL,
			ring_style_name: ringStylesTable.name,
			ring_style_price: ringStyleTotalPriceSQL(ringStylesTable).as('ring_style_price'),
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
		.where(
			and(
				whereClause,
				or(
					isNotNull(favoritesTable.product_id),
					isNotNull(favoritesTable.diamond_id),
					isNotNull(favoritesTable.ring_style_id)
				)
			)
		)

	return data
}

export async function addToFavorites({
	user_id,
	guest_id,
	product_id,
	diamond_id,
	ring_style_id,
}) {
	if (!user_id && !guest_id) throw new Error('Missing identity')
	if (product_id == null && diamond_id == null && ring_style_id == null) {
		throw new Error('Favorite must reference a product, diamond, or ring style')
	}

	const ownerCondition = user_id
		? eq(favoritesTable.user_id, user_id)
		: eq(favoritesTable.guest_id, guest_id)

	// Prevent duplicates: return success silently if already favorited
	const conditions = [ownerCondition]
	if (product_id != null) conditions.push(eq(favoritesTable.product_id, product_id))
	if (diamond_id != null) conditions.push(eq(favoritesTable.diamond_id, diamond_id))
	if (ring_style_id != null) conditions.push(eq(favoritesTable.ring_style_id, ring_style_id))

	const existing = await db
		.select({ favorite_id: favoritesTable.favorite_id })
		.from(favoritesTable)
		.where(and(...conditions))
		.limit(1)

	if (existing.length > 0) return { success: true }

	await db.insert(favoritesTable).values({
		user_id: user_id ?? null,
		guest_id: guest_id ?? null,
		product_id,
		diamond_id,
		ring_style_id,
	})

	return { success: true }
}

export async function removeFromFavorites({
	user_id,
	guest_id,
	product_id,
	diamond_id,
	ring_style_id,
}) {
	if (!user_id && !guest_id) throw new Error('Missing identity')

	const ownerCondition = user_id
		? eq(favoritesTable.user_id, user_id)
		: eq(favoritesTable.guest_id, guest_id)

	const conditions = [ownerCondition]
	if (product_id) conditions.push(eq(favoritesTable.product_id, product_id))
	if (diamond_id) conditions.push(eq(favoritesTable.diamond_id, diamond_id))
	if (ring_style_id) conditions.push(eq(favoritesTable.ring_style_id, ring_style_id))

	await db.delete(favoritesTable).where(and(...conditions))

	return { success: true }
}

// Merges a guest's favorites into a user's favorites on login.
// Mirrors mergeGuestCart: we read guest rows from the DB rather than
// trusting a client-supplied items array.
export async function mergeGuestFavorites({ guest_id, user_id }) {
	const guestItems = await db
		.select()
		.from(favoritesTable)
		.where(eq(favoritesTable.guest_id, guest_id))

	for (const item of guestItems) {
		const conditions = [eq(favoritesTable.user_id, user_id)]
		if (item.product_id != null) conditions.push(eq(favoritesTable.product_id, item.product_id))
		if (item.diamond_id != null) conditions.push(eq(favoritesTable.diamond_id, item.diamond_id))
		if (item.ring_style_id != null) conditions.push(eq(favoritesTable.ring_style_id, item.ring_style_id))

		const existing = await db
			.select({ favorite_id: favoritesTable.favorite_id })
			.from(favoritesTable)
			.where(and(...conditions))
			.limit(1)

		if (existing.length > 0) {
			// User already has this favorite — drop the guest duplicate.
			await db
				.delete(favoritesTable)
				.where(eq(favoritesTable.favorite_id, item.favorite_id))
		} else {
			await db
				.update(favoritesTable)
				.set({ user_id, guest_id: null })
				.where(eq(favoritesTable.favorite_id, item.favorite_id))
		}
	}

	return { success: true }
}

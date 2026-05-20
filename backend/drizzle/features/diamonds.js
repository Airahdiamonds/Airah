import { and, eq, gte, inArray, lte } from 'drizzle-orm'
import { db } from '../db.js'
import { diamondsTable } from '../schema/diamonds.js'
import { favoritesTable } from '../schema/favorites.js'
import { favoritesJoinForUser } from '../featureHelpers.js'

// `userId` is optional. When provided we LEFT JOIN favorites so each row
// carries a `favorite_id` marker the storefront uses to render the heart
// icon. For guests the join is forced to match no rows.

export async function addDiamond(data) {
	const newProduct = await db.insert(diamondsTable).values(data).returning()
	if (newProduct == null) throw new Error('Failed to insert diamond')
	return { success: true }
}

export async function getAllDiamonds(userId) {
	const products = await db
		.select({
			diamond_id: diamondsTable.diamond_id,
			SKU: diamondsTable.SKU,
			name: diamondsTable.name,
			category: diamondsTable.clarity,
			price: diamondsTable.price,
			favorite_id: favoritesTable.favorite_id,
			image_URL: diamondsTable.image_URL,
		})
		.from(diamondsTable)
		.leftJoin(
			favoritesTable,
			favoritesJoinForUser(diamondsTable.diamond_id, favoritesTable.diamond_id, userId)
		)
		.groupBy(diamondsTable.diamond_id, favoritesTable.favorite_id)

	if (products == null) throw new Error('Failed to get all diamonds')
	return products
}

export async function updateDiamond(product_id, updatedData) {
	if (updatedData.created_at) updatedData.created_at = new Date(updatedData.created_at)
	if (updatedData.updated_at) updatedData.updated_at = new Date(updatedData.updated_at)

	const updatedProduct = await db
		.update(diamondsTable)
		.set(updatedData)
		.where(eq(diamondsTable.diamond_id, product_id))
		.returning()

	if (updatedProduct == null) throw new Error('Failed to update diamond')
	return { success: true }
}

export async function getDiamond(product_id) {
	const product = await db
		.select()
		.from(diamondsTable)
		.where(eq(diamondsTable.diamond_id, product_id))

	if (product == null) throw new Error('Failed to get diamond')
	return product
}

export async function getFilteredDiamonds({
	userId,
	sizes = [],
	clarities = [],
	shapes = [],
	colors = [],
	cuts = [],
	minPrice,
	maxPrice,
}) {
	const filters = []
	if (sizes.length > 0) filters.push(inArray(diamondsTable.size, sizes))
	if (clarities.length > 0) filters.push(inArray(diamondsTable.clarity, clarities))
	if (shapes.length > 0) filters.push(inArray(diamondsTable.shape, shapes))
	if (colors.length > 0) filters.push(inArray(diamondsTable.color, colors))
	if (cuts.length > 0) filters.push(inArray(diamondsTable.cut, cuts))
	if (minPrice !== undefined) filters.push(gte(diamondsTable.price, minPrice))
	if (maxPrice !== undefined) filters.push(lte(diamondsTable.price, maxPrice))

	const baseQuery = db
		.select({
			diamond_id: diamondsTable.diamond_id,
			SKU: diamondsTable.SKU,
			name: diamondsTable.name,
			clarity: diamondsTable.clarity,
			shape: diamondsTable.shape,
			color: diamondsTable.color,
			cut: diamondsTable.cut,
			size: diamondsTable.size,
			price: diamondsTable.price,
			favorite_id: favoritesTable.favorite_id,
			image_URL: diamondsTable.image_URL,
		})
		.from(diamondsTable)
		.leftJoin(
			favoritesTable,
			favoritesJoinForUser(diamondsTable.diamond_id, favoritesTable.diamond_id, userId)
		)

	const filteredQuery = filters.length > 0 ? baseQuery.where(and(...filters)) : baseQuery
	const products = await filteredQuery.groupBy(
		diamondsTable.diamond_id,
		favoritesTable.favorite_id
	)

	if (products == null) throw new Error('Failed to get filtered diamonds')
	return products
}

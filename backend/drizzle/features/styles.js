import { and, eq } from 'drizzle-orm'
import { db } from '../db.js'
import { ringStylesTable } from '../schema/ringStyles.js'
import { favoritesTable } from '../schema/favorites.js'

export async function addStyle(data) {
	const newProduct = await db.insert(ringStylesTable).values(data).returning()
	if (newProduct == null) throw new Error('Failed to insert style')

	return { success: true }
}

export async function getAllStyles(clerk_user_id) {
	const products = await db
		.select({
			ring_style_id: ringStylesTable.ring_style_id,
			SKU: ringStylesTable.SKU,
			name: ringStylesTable.name,
			category: ringStylesTable.head_style,
			head_style_price: ringStylesTable.head_style_price,
			head_metal_price: ringStylesTable.head_metal_price,
			shank_style_price: ringStylesTable.shank_style_price,
			shank_metal_price: ringStylesTable.shank_metal_price,
			favorite_id: clerk_user_id ? favoritesTable.favourite_id : '',
			image_URL: ringStylesTable.image_URL,
		})
		.from(ringStylesTable)
		.leftJoin(
			favoritesTable,
			and(
				eq(ringStylesTable.ring_style_id, favoritesTable.product_id),
				clerk_user_id ? eq(favoritesTable.user_id, clerk_user_id) : undefined
			)
		)
		.groupBy(ringStylesTable.ring_style_id, favoritesTable.favourite_id)

	if (products == null) throw new Error('Failed to get all styles')

	return products
}

export async function updateStyle(product_id, updatedData) {
	if (updatedData.created_at) {
		updatedData.created_at = new Date(updatedData.created_at)
	}
	if (updatedData.updated_at) {
		updatedData.updated_at = new Date(updatedData.updated_at)
	}
	const updatedProduct = await db
		.update(ringStylesTable)
		.set(updatedData)
		.where(eq(ringStylesTable.ring_style_id, product_id))
		.returning()

	if (updatedProduct == null) throw new Error('Failed to update style')

	return { success: true }
}

export async function getStyle(product_id) {
	const product = await db
		.select()
		.from(ringStylesTable)
		.where(eq(ringStylesTable.ring_style_id, product_id))

	if (product == null) throw new Error('Failed to get style')

	return product
}

export async function getCustomStyle({
	head_style,
	head_metal,
	shank_style,
	shank_metal,
}) {
	const product = await db
		.select()
		.from(ringStylesTable)
		.where(
			and(
				eq(ringStylesTable.head_style, head_style),
				eq(ringStylesTable.head_metal, head_metal),
				eq(ringStylesTable.shank_style, shank_style),
				eq(ringStylesTable.shank_metal, shank_metal)
			)
		)

	if (product == null) throw new Error('Failed to get style')

	return product
}

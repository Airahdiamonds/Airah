import { avg, count, eq } from 'drizzle-orm'
import { db } from '../db.js'
import { productsTable } from '../schema/products.js'
import { reviewsTable } from '../schema/reviews.js'
import { favoritesTable } from '../schema/favorites.js'

export async function addProduct(data) {
	const newProduct = await db.insert(productsTable).values(data).returning()
	if (newProduct == null) throw new Error('Failed to insert product')
	return { success: true }
}

export async function getAdminProducts() {
	// Empty array is a valid response, so no null check needed.
	return await db.select().from(productsTable)
}

// Returns the storefront product list for a `subCategory`, each row
// stamped with `average_rating`, `review_count`, and `isFavorited`.
// `userId` is optional — when absent every row is `isFavorited: false`.
export async function getAllProducts(userId, subCategory) {
	const allProducts = await db
		.select({
			product_id: productsTable.product_id,
			SKU: productsTable.SKU,
			name: productsTable.name,
			category: productsTable.category,
			total_cost: productsTable.total_cost,
			average_rating: avg(reviewsTable.rating).as('average_rating'),
			review_count: count(reviewsTable.review_id).as('review_count'),
			image_URL: productsTable.image_URL,
		})
		.from(productsTable)
		.where(eq(productsTable.subCategory, subCategory))
		.leftJoin(reviewsTable, eq(productsTable.product_id, reviewsTable.product_id))
		.groupBy(productsTable.product_id)

	if (!userId) {
		return allProducts.map((product) => ({ ...product, isFavorited: false }))
	}

	const userFavorites = await db
		.select({ product_id: favoritesTable.product_id })
		.from(favoritesTable)
		.where(eq(favoritesTable.user_id, userId))

	const favoritedProductIds = new Set(userFavorites.map((fav) => fav.product_id))

	return allProducts.map((product) => ({
		...product,
		isFavorited: favoritedProductIds.has(product.product_id),
	}))
}

export async function getProduct(product_id) {
	const product = await db
		.select()
		.from(productsTable)
		.where(eq(productsTable.product_id, product_id))

	if (product == null) throw new Error('Failed to get product')
	return product
}

export async function updateProduct(product_id, updatedData) {
	if (updatedData.created_at) updatedData.created_at = new Date(updatedData.created_at)
	if (updatedData.updated_at) updatedData.updated_at = new Date(updatedData.updated_at)

	const updatedProduct = await db
		.update(productsTable)
		.set(updatedData)
		.where(eq(productsTable.product_id, product_id))
		.returning()

	if (updatedProduct == null) throw new Error('Failed to update product')
	return { success: true }
}

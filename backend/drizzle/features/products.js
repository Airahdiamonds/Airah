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

export async function getAllProducts(clerk_user_id) {
	const allProducts = await db
		.select({
			product_id: productsTable.product_id,
			SKU: productsTable.SKU,
			name: productsTable.name,
			category: productsTable.category,
			// carat: productsTable.carat,
			total_cost: productsTable.total_cost,
			average_rating: avg(reviewsTable.rating).as('average_rating'),
			review_count: count(reviewsTable.review_id).as('review_count'),
			image_URL: productsTable.image_URL,
		})
		.from(productsTable)
		.leftJoin(
			reviewsTable,
			eq(productsTable.product_id, reviewsTable.product_id)
		)
		.groupBy(productsTable.product_id)

	// If the user is not signed in, return all products without any favorite marks
	if (!clerk_user_id) {
		return allProducts.map((product) => ({
			...product,
			isFavorited: false, // Default to false for signed-out users
		}))
	}

	// If the user is signed in, fetch their favorite products
	const userFavorites = await db
		.select()
		.from(favoritesTable)
		.where(eq(favoritesTable.user_id, clerk_user_id))

	// Create a set of product IDs that the user has favorited
	const favoritedProductIds = new Set(
		userFavorites.map((fav) => fav.product_id)
	)

	// Map through all products and mark the ones that are favorited
	const productsWithFavorites = allProducts.map((product) => ({
		...product,
		isFavorited: favoritedProductIds.has(product.product_id),
	}))

	return productsWithFavorites
}

// export async function getAllDiamonds() {
// 	const products = await db
// 		.select({
// 			product_id: productsTable.product_id,
// 			name: productsTable.name,
// 			diamond_price: productsTable.diamond_price,
// 		})
// 		.from(productsTable)
// 		.where(eq(productsTable.category, 'diamond'))

// 	if (products == null) throw new Error('Failed to get all diamonds')

// 	return products
// }

// export async function getAllRings() {
// 	const products = await db
// 		.select({
// 			product_id: productsTable.product_id,
// 			name: productsTable.name,
// 			head_style: productsTable.head_style,
// 			head_style_price: productsTable.head_style_price,
// 			head_metal: productsTable.head_metal,
// 			head_metal_price: productsTable.head_metal_price,
// 			shank_style: productsTable.shank_style,
// 			shank_style_price: productsTable.shank_style_price,
// 			shank_metal: productsTable.shank_metal,
// 			shank_metal_price: productsTable.shank_metal_price,
// 		})
// 		.from(productsTable)
// 		.where(eq(productsTable.category, 'ring'))

// 	if (products == null) throw new Error('Failed to get all rings')

// 	return products
// }

export async function getProduct(product_id) {
	const product = await db
		.select()
		.from(productsTable)
		.where(eq(productsTable.product_id, product_id))

	if (product == null) throw new Error('Failed to get product')

	return product
}

export async function updateProduct(product_id, updatedData) {
	if (updatedData.created_at) {
		updatedData.created_at = new Date(updatedData.created_at)
	}
	if (updatedData.updated_at) {
		updatedData.updated_at = new Date(updatedData.updated_at)
	}
	const updatedProduct = await db
		.update(productsTable)
		.set(updatedData)
		.where(eq(productsTable.product_id, product_id))
		.returning()

	if (updatedProduct == null) throw new Error('Failed to update product')

	return { success: true }
}

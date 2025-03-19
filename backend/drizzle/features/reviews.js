import { and, asc, count, desc, eq, gte, lte, sql } from 'drizzle-orm'
import { db } from '../db.js'
import { reviewsTable } from '../schema/reviews.js'
import { userTable } from '../schema/users.js'

export async function addReview(data) {
	const newReview = await db.insert(reviewsTable).values(data).returning()
	if (newReview == null) throw new Error('Failed to add review')

	return { success: true }
}

export async function getProductReviews({
	product_id,
	page = 1,
	limit = 5,
	sortBy = 'created_at',
	sortOrder = 'desc',
	rating,
	hasImage,
	dateRange,
}) {
	const pageNum = Number(page) || 1
	const limitNum = Number(limit) || 5
	const offset = (pageNum - 1) * limitNum
	const orderDirection = sortOrder?.toLowerCase() === 'asc' ? 'asc' : 'desc'
	const hasImageBool = hasImage === 'true'

	// Base query
	let query = db
		.select({
			review_id: reviewsTable.review_id,
			product_id: reviewsTable.product_id,
			diamond_id: reviewsTable.diamond_id,
			ring_style_id: reviewsTable.ring_style_id,
			rating: reviewsTable.rating,
			image_URL: reviewsTable.image_URL,
			comment: reviewsTable.comment,
			created_at: reviewsTable.created_at,
			user: {
				user_id: userTable.user_id,
				name: userTable.name,
				email: userTable.email,
			},
		})
		.from(reviewsTable)
		.leftJoin(userTable, eq(reviewsTable.user_id, userTable.user_id)) // Join with userTable
		.where(eq(reviewsTable.product_id, product_id))

	// Apply filters
	let conditions = [eq(reviewsTable.product_id, product_id)]

	if (rating !== undefined) {
		conditions.push(eq(reviewsTable.rating, Number(rating)))
	}
	if (hasImageBool) {
		conditions.push(
			sql`${reviewsTable.image_URL} IS NOT NULL AND jsonb_array_length(${reviewsTable.image_URL}) > 0`
		)
	}
	if (dateRange?.from && dateRange?.to) {
		conditions.push(
			and(
				gte(reviewsTable.created_at, new Date(dateRange.from)),
				lte(reviewsTable.created_at, new Date(dateRange.to))
			)
		)
	}

	query = query.where(and(...conditions))

	// Sorting logic
	query = query.orderBy(
		orderDirection === 'asc'
			? asc(reviewsTable[sortBy])
			: desc(reviewsTable[sortBy])
	)

	// Pagination logic
	query = query.limit(limitNum).offset(offset)

	// Fetch reviews
	const reviews = await query

	// Get total count
	const totalReviewsResult = await db
		.select({ count: count() })
		.from(reviewsTable)
		.where(eq(reviewsTable.product_id, product_id))

	const totalReviews = totalReviewsResult[0]?.count || 0

	return {
		reviews,
		total: totalReviews,
		page: pageNum,
		limit: limitNum,
		totalPages: Math.max(1, Math.ceil(totalReviews / limitNum)),
		sortBy,
		sortOrder,
		filters: { rating, hasImage: hasImageBool, dateRange },
	}
}

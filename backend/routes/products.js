import express from 'express'
import { getAllProducts, getProduct } from '../drizzle/features/products.js'
import {
	getAllDiamonds,
	getDiamond,
	getFilteredDiamonds,
} from '../drizzle/features/diamonds.js'
import {
	getAllStyles,
	getCustomStyle,
	getStyle,
} from '../drizzle/features/styles.js'
import { searchProducts } from '../drizzle/features/master.js'
import { addReview, getProductReviews } from '../drizzle/features/reviews.js'
import { optionalSession } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import { reviewSchema, searchQuerySchema } from '../schemas.js'

const router = express.Router()

router.get(
	'/api/getProduct/:product_id',
	asyncHandler(async (req, res) => {
		const data = await getProduct(req.params.product_id)
		res.json(data)
	})
)

router.get(
	'/api/getDiamond/:product_id',
	asyncHandler(async (req, res) => {
		const data = await getDiamond(req.params.product_id)
		res.json(data)
	})
)

router.get(
	'/api/getStyle/:product_id',
	asyncHandler(async (req, res) => {
		const data = await getStyle(req.params.product_id)
		res.json(data)
	})
)

router.get(
	'/api/getCustomStyle',
	asyncHandler(async (req, res) => {
		const { head_style, head_metal, shank_style, shank_metal } = req.query
		const data = await getCustomStyle({ head_style, head_metal, shank_style, shank_metal })
		res.json(data)
	})
)

router.get(
	'/api/getAllFilteredDiamonds',
	optionalSession,
	asyncHandler(async (req, res) => {
		const { sizes, clarities, colors, shapes, cuts, minPrice, maxPrice } = req.query
		const data = await getFilteredDiamonds({
			userId: req.user?.user_id ?? null,
			sizes: sizes ? sizes.split(',') : [],
			clarities: clarities ? clarities.split(',') : [],
			shapes: shapes ? shapes.split(',') : [],
			colors: colors ? colors.split(',') : [],
			cuts: cuts ? cuts.split(',') : [],
			minPrice: minPrice ? Number(minPrice) : undefined,
			maxPrice: maxPrice ? Number(maxPrice) : undefined,
		})
		res.json(data)
	})
)

router.get(
	'/api/admin/getAllProducts',
	optionalSession,
	asyncHandler(async (req, res) => {
		const { subCategory } = req.query
		const data = await getAllProducts(req.user?.user_id ?? null, subCategory)
		res.json(data)
	})
)

router.get(
	'/api/admin/getAllDiamonds/:ignoredUserId?',
	optionalSession,
	asyncHandler(async (req, res) => {
		const data = await getAllDiamonds(req.user?.user_id ?? null)
		res.json(data)
	})
)

router.get(
	'/api/admin/getAllStyles/:ignoredUserId?',
	optionalSession,
	asyncHandler(async (req, res) => {
		const data = await getAllStyles(req.user?.user_id ?? null)
		res.json(data)
	})
)

router.get(
	'/api/search',
	validate(searchQuerySchema, 'query'),
	asyncHandler(async (req, res) => {
		const data = await searchProducts(req.query.query)
		res.json(data)
	})
)

router.get(
	'/api/reviews',
	asyncHandler(async (req, res) => {
		const { product_id, page, limit, sortBy, sortOrder, rating, hasImage, fromDate, toDate } = req.query
		if (!product_id) return res.status(400).json({ error: 'product_id is required' })

		const data = await getProductReviews({
			product_id,
			page,
			limit,
			sortBy,
			sortOrder,
			rating,
			hasImage,
			fromDate,
			toDate,
		})
		res.json(data)
	})
)

router.post(
	'/api/submitReview',
	validate(reviewSchema),
	asyncHandler(async (req, res) => {
		await addReview(req.body)
		res.json({ success: true })
	})
)

export default router

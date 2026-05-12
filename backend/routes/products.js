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

const router = express.Router()

router.get('/api/getProduct/:product_id', async (req, res) => {
	try {
		const data = await getProduct(req.params.product_id)
		res.json(data)
	} catch (err) {
		console.error('getProduct Error:', err)
		res.status(500).json({ error: 'Failed to get product' })
	}
})

router.get('/api/getDiamond/:product_id', async (req, res) => {
	try {
		const data = await getDiamond(req.params.product_id)
		res.json(data)
	} catch (err) {
		console.error('getDiamond Error:', err)
		res.status(500).json({ error: 'Failed to get diamond' })
	}
})

router.get('/api/getStyle/:product_id', async (req, res) => {
	try {
		const data = await getStyle(req.params.product_id)
		res.json(data)
	} catch (err) {
		console.error('getStyle Error:', err)
		res.status(500).json({ error: 'Failed to get style' })
	}
})

router.get('/api/getCustomStyle', async (req, res) => {
	try {
		const { head_style, head_metal, shank_style, shank_metal } = req.query
		const data = await getCustomStyle({ head_style, head_metal, shank_style, shank_metal })
		res.json(data)
	} catch (err) {
		console.error('getCustomStyle Error:', err)
		res.status(500).json({ error: 'Failed to get style' })
	}
})

router.get('/api/getAllFilteredDiamonds', async (req, res) => {
	const { clerk_user_id, sizes, clarities, colors, shapes, cuts, minPrice, maxPrice } = req.query
	try {
		const data = await getFilteredDiamonds({
			clerk_user_id,
			sizes: sizes ? sizes.split(',') : [],
			clarities: clarities ? clarities.split(',') : [],
			shapes: shapes ? shapes.split(',') : [],
			colors: colors ? colors.split(',') : [],
			cuts: cuts ? cuts.split(',') : [],
			minPrice: minPrice ? Number(minPrice) : undefined,
			maxPrice: maxPrice ? Number(maxPrice) : undefined,
		})
		res.json(data)
	} catch (err) {
		res.status(500).json({ error: err.message })
	}
})

router.get('/api/admin/getAllProducts', async (req, res) => {
	try {
		let { clerk_user_id, subCategory } = req.query
		if (!clerk_user_id || clerk_user_id === 'null' || clerk_user_id === 'undefined') {
			clerk_user_id = null
		}
		const data = await getAllProducts(clerk_user_id, subCategory)
		res.json(data)
	} catch (err) {
		console.error('getAllProducts Error:', err)
		res.status(500).json({ error: 'Failed to get all products' })
	}
})

router.get('/api/admin/getAllDiamonds/:clerk_user_id?', async (req, res) => {
	try {
		let { clerk_user_id } = req.params
		if (!clerk_user_id || clerk_user_id === 'null' || clerk_user_id === 'undefined') {
			clerk_user_id = null
		}
		const data = await getAllDiamonds(clerk_user_id)
		res.json(data)
	} catch (err) {
		console.error('getAllDiamonds Error:', err)
		res.status(500).json({ error: 'Failed to get all diamonds' })
	}
})

router.get('/api/admin/getAllStyles/:clerk_user_id?', async (req, res) => {
	try {
		let { clerk_user_id } = req.params
		if (!clerk_user_id || clerk_user_id === 'null' || clerk_user_id === 'undefined') {
			clerk_user_id = null
		}
		const data = await getAllStyles(clerk_user_id)
		res.json(data)
	} catch (err) {
		console.error('getAllStyles Error:', err)
		res.status(500).json({ error: 'Failed to get all styles' })
	}
})

router.get('/api/search', async (req, res) => {
	try {
		const { search } = req.query
		if (!search) {
			return res.status(400).json({ error: 'Search query is required' })
		}
		const data = await searchProducts(search)
		res.json(data)
	} catch (err) {
		console.error('searchProducts Error:', err)
		res.status(500).json({ error: 'Failed to get results' })
	}
})

router.get('/api/reviews', async (req, res) => {
	try {
		const { product_id, page, limit, sortBy, sortOrder, rating, hasImage, fromDate, toDate } =
			req.query
		if (!product_id) {
			return res.status(400).json({ error: 'product_id is required' })
		}
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
	} catch (err) {
		console.error('getProductReviews Error:', err)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

router.post('/api/submitReview', async (req, res) => {
	try {
		await addReview(req.body)
		res.json({ success: true })
	} catch (err) {
		console.error('submitReview Error:', err)
		res.status(500).json({ error: 'Failed to submit review' })
	}
})

export default router

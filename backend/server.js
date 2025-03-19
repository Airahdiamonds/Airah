import express from 'express'
import { Webhook } from 'svix'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import ngrok from '@ngrok/ngrok'
import { insertUser, getAllUsers } from './drizzle/features/users.js'
import { clerkClient } from '@clerk/express'
import cors from 'cors'
import {
	addProduct,
	getAllProducts,
	getAllRings,
	getProduct,
	updateProduct,
} from './drizzle/features/products.js'
import {
	addCouponEntry,
	addMasterEntry,
	getCouponList,
	getMasterList,
	searchProducts,
	validateCoupon,
} from './drizzle/features/master.js'
import {
	addDiamond,
	getAllDiamonds,
	getDiamond,
	updateDiamond,
} from './drizzle/features/diamonds.js'
import {
	addStyle,
	getAllStyles,
	getStyle,
	updateStyle,
} from './drizzle/features/styles.js'
import {
	addToCart,
	getUserCart,
	removeFromCart,
} from './drizzle/features/cart.js'
import {
	addToFavorites,
	getUserFavorites,
	removeFromFavorites,
} from './drizzle/features/favorites.js'
import { addReview, getProductReviews } from './drizzle/features/reviews.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 4000
app.use(bodyParser.json())
app.use(cors())

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_KEY

app.post('/webhook', async (req, res) => {
	const svixId = req.headers['svix-id']
	const svixTimestamp = req.headers['svix-timestamp']
	const svixSignature = req.headers['svix-signature']

	if (!svixId || !svixTimestamp || !svixSignature) {
		return res.status(400).send('Missing svix headers')
	}

	const body = JSON.stringify(req.body)
	const webhook = new Webhook(CLERK_WEBHOOK_SECRET)
	let event

	try {
		event = webhook.verify(body, {
			'svix-id': svixId,
			'svix-timestamp': svixTimestamp,
			'svix-signature': svixSignature,
		})
	} catch (error) {
		console.error('Error verifying webhook:', error)
		return res.status(400).send('Webhook verification failed')
	}

	switch (event.type) {
		case 'user.created':
			const email = event.data.email_addresses.find(
				(email) => email.id === event.data.primary_email_address_id
			)?.email_address
			const name = `${event.data.first_name} ${event.data.last_name}`.trim()
			if (email == null) return new Response('No email', { status: 400 })
			if (name === '') return new Response('No name', { status: 400 })
			const user = await insertUser({
				clerk_user_id: event.data.id,
				email,
				name,
				role: 'user',
			})
			await clerkClient.users.updateUserMetadata(user.clerk_user_id, {
				publicMetadata: {
					dbId: user.user_id,
				},
			})
			break
		case 'user.updated':
			console.log('user.updated')
			break
		case 'user.deleted':
			console.log('user.deleted')
			break
		default:
			return res.status(400).send('Unhandled event')
	}

	res.status(200).send('Webhook handled successfully')
})

app.get('/api/users/getFavorites/:clerk_user_id', async (req, res) => {
	try {
		const { clerk_user_id } = req.params
		const data = await getUserFavorites({ clerk_user_id })
		res.json(data)
	} catch (err) {
		console.error('getFavorites User Error: ', err)
		res.status(500).json({ error: 'Failed to get User Favorites' })
	}
})

app.post('/api/users/addToFavorites', async (req, res) => {
	try {
		const { user_id, product_id, diamond_id, ring_style_id } = req.body
		await addToFavorites({ user_id, product_id, diamond_id, ring_style_id })
		res.json({ success: true })
	} catch (err) {
		console.error('addToFavorites Error:', err)
		res.status(500).json({ error: 'Failed to add to Favorites' })
	}
})

app.delete('/api/users/deleteFavorites', async (req, res) => {
	try {
		const { user_id, product_id, diamond_id, ring_style_id } = req.body
		await removeFromFavorites({
			user_id,
			product_id,
			diamond_id,
			ring_style_id,
		})
		res.json({ success: true })
	} catch (err) {
		console.error('removeFromFavorites Error:', err)
		res.status(500).json({ error: 'Failed to remove from Favorites' })
	}
})

app.get('/api/users/getCart/:clerk_user_id', async (req, res) => {
	try {
		const { clerk_user_id } = req.params
		const data = await getUserCart({ clerk_user_id })
		res.json(data)
	} catch (err) {
		console.error('getCart User Error: ', err)
		res.status(500).json({ error: 'Failed to get User Cart' })
	}
})

app.post('/api/users/addToCart', async (req, res) => {
	try {
		const { user_id, product_id, diamond_id, ring_style_id, quantity } =
			req.body
		await addToCart({
			user_id,
			product_id,
			quantity,
			diamond_id,
			ring_style_id,
		})
		res.json({ success: true })
	} catch (err) {
		console.error('addToCart Error:', err)
		res.status(500).json({ error: 'Failed to add to Cart' })
	}
})

app.delete(
	'/api/users/deleteCart/:clerk_user_id/:product_id',
	async (req, res) => {
		try {
			const { clerk_user_id, product_id } = req.params
			await removeFromCart({ clerk_user_id, product_id })
			res.json({ success: true })
		} catch (err) {
			console.error('removeFromCart Error:', err)
			res.status(500).json({ error: 'Failed to remove from Cart' })
		}
	}
)

app.post('/api/admin/addProduct', async (req, res) => {
	try {
		const data = req.body
		await addProduct(data)
		res.json({ success: true })
	} catch (err) {
		console.log('addProduct Error:', err)
		res.status(500).json({ error: 'Failed to add product' })
	}
})

app.get('/api/admin/getAllProducts/:clerk_user_id?', async (req, res) => {
	try {
		let { clerk_user_id } = req.params

		if (
			!clerk_user_id ||
			clerk_user_id === 'null' ||
			clerk_user_id === 'undefined'
		) {
			clerk_user_id = null
		}

		const data = await getAllProducts(clerk_user_id)
		res.json(data)
	} catch (err) {
		console.error('getAllProducts Error:', err)
		res.status(500).json({ error: 'Failed to get all products' })
	}
})

app.put('/api/admin/updateProduct/:product_id', async (req, res) => {
	try {
		const updatedProduct = await updateProduct(req.params.product_id, req.body)
		res.json(updatedProduct)
	} catch (err) {
		console.log('updateProduct Error: ' + err)
		res.status(500).json({ error: 'Failed to update product' })
	}
})

app.get('/api/admin/getAllProductsByCategory/:category', async (req, res) => {
	try {
		const { category } = req.params
		let data

		const categoryHandlers = {
			diamond: getAllDiamonds,
			ring: getAllRings,
		}

		if (categoryHandlers[category]) {
			data = await categoryHandlers[category]()
		} else {
			return res.status(400).json({ error: `Invalid category: ${category}` })
		}

		res.json(data)
	} catch (err) {
		console.error(
			`Error fetching products for category "${req.params.category}":`,
			err
		)
		res.status(500).json({ error: 'Failed to fetch products' })
	}
})

app.get('/api/admin/getAllUsers', async (req, res) => {
	try {
		const data = await getAllUsers()
		res.json(data)
	} catch (err) {
		console.log('getAllUsers Error: ' + err)
		res.status(500).json({ error: 'Failed to get all users' })
	}
})

app.get('/api/getProduct/:product_id', async (req, res) => {
	try {
		const { product_id } = req.params
		const data = await getProduct(product_id)
		res.json(data)
	} catch (err) {
		console.log('getProduct Error: ' + err)
		res.status(500).json({ error: 'Failed to get product' })
	}
})

app.get('/api/getDiamond/:product_id', async (req, res) => {
	try {
		const { product_id } = req.params
		const data = await getDiamond(product_id)
		res.json(data)
	} catch (err) {
		console.log('getDiamond Error: ' + err)
		res.status(500).json({ error: 'Failed to get diamond' })
	}
})

app.get('/api/getStyle/:product_id', async (req, res) => {
	try {
		const { product_id } = req.params
		const data = await getStyle(product_id)
		res.json(data)
	} catch (err) {
		console.log('getStyle Error: ' + err)
		res.status(500).json({ error: 'Failed to get style' })
	}
})

app.get('/api/admin/getMasterList', async (req, res) => {
	try {
		const data = await getMasterList()
		res.json(data)
	} catch (err) {
		console.log('getMasterList Error: ' + err)
		res.status(500).json({ error: 'Failed to get master list' })
	}
})

app.post('/api/admin/addMasterEntry', async (req, res) => {
	try {
		const data = req.body
		await addMasterEntry(data)
		res.json({ success: true })
	} catch (err) {
		console.log('addMasterEntry Error:', err)
		res.status(500).json({ error: 'Failed to add master entry' })
	}
})

app.post('/api/admin/addDiamond', async (req, res) => {
	try {
		const data = req.body
		await addDiamond(data)
		res.json({ success: true })
	} catch (err) {
		console.log('addDiamond Error:', err)
		res.status(500).json({ error: 'Failed to add diamond' })
	}
})

app.get('/api/admin/getAllDiamonds/:clerk_user_id?', async (req, res) => {
	try {
		let { clerk_user_id } = req.params

		if (
			!clerk_user_id ||
			clerk_user_id === 'null' ||
			clerk_user_id === 'undefined'
		) {
			clerk_user_id = null
		}
		const data = await getAllDiamonds(clerk_user_id)
		res.json(data)
	} catch (err) {
		console.log('getAllDiamonds Error: ' + err)
		res.status(500).json({ error: 'Failed to get all diamonds' })
	}
})

app.put('/api/admin/updateDiamond/:product_id', async (req, res) => {
	try {
		const updatedProduct = await updateDiamond(req.params.product_id, req.body)
		res.json(updatedProduct)
	} catch (err) {
		console.log('updateDiamond Error: ' + err)
		res.status(500).json({ error: 'Failed to update diamond' })
	}
})

app.post('/api/admin/addStyle', async (req, res) => {
	try {
		const data = req.body
		await addStyle(data)
		res.json({ success: true })
	} catch (err) {
		console.log('addStyle Error:', err)
		res.status(500).json({ error: 'Failed to add style' })
	}
})

app.get('/api/admin/getAllStyles/:clerk_user_id?', async (req, res) => {
	try {
		let { clerk_user_id } = req.params

		if (
			!clerk_user_id ||
			clerk_user_id === 'null' ||
			clerk_user_id === 'undefined'
		) {
			clerk_user_id = null
		}
		const data = await getAllStyles(clerk_user_id)
		res.json(data)
	} catch (err) {
		console.log('getAllStyles Error: ' + err)
		res.status(500).json({ error: 'Failed to get all styles' })
	}
})

app.put('/api/admin/updateStyle/:product_id', async (req, res) => {
	try {
		const updatedProduct = await updateStyle(req.params.product_id, req.body)
		res.json(updatedProduct)
	} catch (err) {
		console.log('updateStyle Error: ' + err)
		res.status(500).json({ error: 'Failed to update style' })
	}
})

app.get('/api/search', async (req, res) => {
	try {
		const { search } = req.query
		if (!search) {
			return res.status(400).json({ error: 'Search query is required' })
		}
		const data = await searchProducts(search)
		res.json(data)
	} catch (err) {
		console.log('searchProducts Error: ' + err)
		res.status(500).json({ error: 'Failed to get results' })
	}
})

app.get('/api/reviews', async (req, res) => {
	try {
		const {
			product_id,
			page,
			limit,
			sortBy,
			sortOrder,
			rating,
			hasImage,
			fromDate,
			toDate,
		} = req.query
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
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Internal Server Error' })
	}
})

app.post('/api/submitReview', async (req, res) => {
	try {
		const data = req.body
		await addReview(data)
		res.json({ success: true })
	} catch (err) {
		console.error('addToFavorites Error:', err)
		res.status(500).json({ error: 'Failed to add to Favorites' })
	}
})

app.get('/api/admin/getCouponList', async (req, res) => {
	try {
		const data = await getCouponList()
		res.json(data)
	} catch (err) {
		console.log('getCouponList Error: ' + err)
		res.status(500).json({ error: 'Failed to get coupon list' })
	}
})

app.post('/api/admin/addCouponEntry', async (req, res) => {
	try {
		const data = req.body
		await addCouponEntry(data)
		res.json({ success: true })
	} catch (err) {
		console.log('addCouponEntry Error:', err)
		res.status(500).json({ error: 'Failed to add coupon entry' })
	}
})

app.post('/api/validateCoupon', async (req, res) => {
	try {
		const { couponCode } = req.body
		const result = await validateCoupon(couponCode)
		res.json(result)
	} catch (err) {
		console.log('validateCoupon Error:', err.message)
		res.status(400).json({ error: err.message })
	}
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})

ngrok
	.connect({ addr: 4000, authtoken_from_env: true })
	.then((listener) => console.log(`Ingress established at: ${listener.url()}`))

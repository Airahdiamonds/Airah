import express from 'express'
import { Webhook } from 'svix'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import ngrok from '@ngrok/ngrok'
import multer from 'multer'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import {
	insertUser,
	getAllUsers,
	getAdmin,
	getAllAdmin,
	addAdmin,
	updateAdmin,
	deleteAdmin,
	getUser,
} from './drizzle/features/users.js'
import { clerkClient } from '@clerk/express'
import cors from 'cors'
import {
	addProduct,
	getAdminProducts,
	getAllProducts,
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
	getFilteredDiamonds,
	updateDiamond,
} from './drizzle/features/diamonds.js'
import {
	addStyle,
	getAllStyles,
	getCustomStyle,
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
import {
	cancelOrder,
	createOrder,
	getOrdersAdmin,
	getOrdersByUser,
	updateStatus,
} from './drizzle/features/orders.js'
import { sendEmail } from './emailService.js'
import {
	comparePasswords,
	generateSalt,
	hashPassword,
} from './passwordHasher.js'
import { createUserSession } from './session.js'
import cookieParser from 'cookie-parser'
import { redisClient } from './redis.js'
import { handleGoogleLogin } from './drizzle/features/userOAuthAccount.js'

const envFile =
	process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'

dotenv.config({ path: envFile })
const app = express()
app.use(cookieParser())
app.use(
	cors({
		origin:
			process.env.NODE_ENV === 'production'
				? [
						'https://airahdiamonds.com',
						'https://www.airahdiamonds.com',
						'https://admin.airahdiamonds.com',
				  ]
				: ['http://localhost:3006', 'http://localhost:3005'],
		credentials: true,
	})
)
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
const port = process.env.PORT || 4000
app.use(bodyParser.json())

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, 'uploads/'),
	filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
})

const upload = multer({
	storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB per file
		files: 10, // allow up to 10 files
	},
})

// const storage = multer.diskStorage({
// 	destination: './uploads/',
// 	filename: (req, file, cb) => {
// 		cb(null, Date.now() + path.extname(file.originalname)) // Unique filename
// 	},
// })

// const upload = multer({ storage })

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

app.get('/api/admin/getAllProducts', async (req, res) => {
	try {
		let { clerk_user_id, subCategory } = req.query // Extract from query params

		if (
			!clerk_user_id ||
			clerk_user_id === 'null' ||
			clerk_user_id === 'undefined'
		) {
			clerk_user_id = null
		}

		const data = await getAllProducts(clerk_user_id, subCategory) // Pass both parameters
		res.json(data)
	} catch (err) {
		console.error('getAllProducts Error:', err)
		res.status(500).json({ error: 'Failed to get all products' })
	}
})

app.get('/api/admin/getAdminProducts', async (req, res) => {
	try {
		const data = await getAdminProducts()
		res.json(data)
	} catch (err) {
		console.error('getAdminProducts Error:', err)
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

// app.get('/api/admin/getAllProductsByCategory/:category', async (req, res) => {
// 	try {
// 		const { category } = req.params
// 		let data

// 		const categoryHandlers = {
// 			diamond: getAllDiamonds,
// 			ring: getAllRings,
// 		}

// 		if (categoryHandlers[category]) {
// 			data = await categoryHandlers[category]()
// 		} else {
// 			return res.status(400).json({ error: `Invalid category: ${category}` })
// 		}

// 		res.json(data)
// 	} catch (err) {
// 		console.error(
// 			`Error fetching products for category "${req.params.category}":`,
// 			err
// 		)
// 		res.status(500).json({ error: 'Failed to fetch products' })
// 	}
// })

app.get('/api/admin/getAllUsers', async (req, res) => {
	try {
		const data = await getAllUsers()
		res.json(data)
	} catch (err) {
		console.log('getAllUsers Error: ' + err)
		res.status(500).json({ error: 'Failed to get all users' })
	}
})

app.get('/api/admin/getAllAdmin', async (req, res) => {
	try {
		const data = await getAllAdmin()
		res.json(data)
	} catch (err) {
		console.log('getAllAdmin Error: ' + err)
		res.status(500).json({ error: 'Failed to get all admin' })
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

app.get('/api/getCustomStyle', async (req, res) => {
	try {
		const { head_style, head_metal, shank_style, shank_metal } = req.query
		const data = await getCustomStyle({
			head_style,
			head_metal,
			shank_style,
			shank_metal,
		})
		res.json(data)
	} catch (err) {
		console.log('getCustomStyle Error: ' + err)
		res.status(500).json({ error: 'Failed to get style' })
	}
})

app.get('/api/getAllFilteredDiamonds', async (req, res) => {
	const {
		clerk_user_id,
		sizes,
		clarities,
		colors,
		shapes,
		cuts,
		minPrice,
		maxPrice,
	} = req.query
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
	} catch (error) {
		res.status(500).json({ error: error.message })
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

app.get('/api/orders', async (req, res) => {
	try {
		const { userId } = req.query
		const data = await getOrdersByUser(userId)

		// await sendEmail(
		// 	customerEmail,
		// 	'Order Confirmation',
		// 	`Thank you for your order #${orderId}`,
		// 	`<h1>Thank you for your order!</h1><p>Order ID: ${orderId}</p>`
		//   );

		res.json(data)
	} catch (err) {
		console.log('getOrdersByUser Error: ' + err)
		res.status(500).json({ error: 'Failed to get order list' })
	}
})

app.get('/api/admin/orders', async (req, res) => {
	try {
		const data = await getOrdersAdmin()
		res.json(data)
	} catch (err) {
		console.log('getOrdersByUser Error: ' + err)
		res.status(500).json({ error: 'Failed to get order list' })
	}
})

app.post('/api/admin/updateStatus', async (req, res) => {
	try {
		const { orderId, status } = req.body
		await updateStatus(orderId, status)
		res.json({ success: true })
	} catch (err) {
		console.log('cancelOrder Error: ' + err)
		res.status(500).json({ error: 'Failed to cancel order' })
	}
})

app.post('/api/cancelOrder', async (req, res) => {
	try {
		const { orderId } = req.body
		await cancelOrder(orderId)
		res.json({ success: true })
	} catch (err) {
		console.log('cancelOrder Error: ' + err)
		res.status(500).json({ error: 'Failed to cancel order' })
	}
})

app.post('/api/createOrder', async (req, res) => {
	try {
		const { dbId, cartItems, totalPrice } = req.body
		const newOrder = await createOrder({ dbId, cartItems, totalPrice })
		res.json(newOrder)
	} catch (err) {
		console.log('createOrder Error:', err)
		res.status(500).json({ error: 'Failed to create order' })
	}
})

app.post('/api/admin/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const data = await getAdmin(email, password)
		res.json(data)
	} catch (err) {
		console.log('Login Error:', err.message)
		res.status(401).json({ message: err.message || 'Failed to login' })
	}
})

app.post('/api/admin/createAdmin', async (req, res) => {
	try {
		const { email, password, name } = req.body
		const data = await addAdmin({
			name,
			email,
			password,
		})
		res.json(data)
	} catch (err) {
		console.log('createAdmin Error:', err)
		res.status(500).json({ error: 'Failed to create admin' })
	}
})

app.put('/api/admin/updateAdmin/:id', async (req, res) => {
	try {
		const { id } = req.params
		const { email, name, password } = req.body
		const data = await updateAdmin({ id }, { email, name, password })
		res.json(data)
	} catch (err) {
		console.log('updateAdmin Error:', err)
		res.status(500).json({ error: 'Failed to update admin' })
	}
})

app.delete('/api/admin/deleteAdmin/:id', async (req, res) => {
	try {
		const { id } = req.params
		const data = await deleteAdmin({ id })
		res.json(data)
	} catch (err) {
		console.log('deleteAdmin Error:', err)
		res.status(500).json({ error: 'Failed to delete admin' })
	}
})

app.post('/admin/upload', upload.array('images', 10), (req, res) => {
	console.log('Received files:', req.files.length)
	if (!req.files || req.files.length === 0) {
		return res.status(400).json({ error: 'No files uploaded' })
	}

	const fileUrls = req.files.map(
		(file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
	)
	console.log('Returning file URLs:', fileUrls)
	res.json({
		message: 'Files uploaded successfully',
		fileUrls: fileUrls,
	})
})

app.get('/images', (req, res) => {
	const uploadsDir = './uploads'

	fs.readdir(uploadsDir, (err, files) => {
		if (err) {
			return res.status(500).json({ error: 'Unable to fetch images' })
		}

		const fileUrls = files.map(
			(file) => `${req.protocol}://${req.get('host')}/uploads/${file}`
		)

		res.json({ images: fileUrls })
	})
})

app.delete('/admin/delete', async (req, res) => {
	const { url } = req.body

	if (!url) {
		return res
			.status(400)
			.json({ success: false, message: 'Image URL is required' })
	}

	// Extract filename from URL
	const filename = path.basename(url)
	const filePath = path.join(__dirname, 'uploads', filename)

	try {
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath) // Delete the file
			res.json({ success: true, message: 'Image deleted successfully' })
		} else {
			res.status(404).json({ success: false, message: 'File not found' })
		}
	} catch (error) {
		console.error('Error deleting file:', error)
		res.status(500).json({ success: false, message: 'Failed to delete image' })
	}
})

app.post('/api/users/signup', async (req, res) => {
	const { email, name, password } = req.body
	const existingUser = await getUser(email)
	if (existingUser) {
		return res.status(400).json({ error: 'User already exists' })
	}
	const salt = generateSalt()
	const hashedPassword = await hashPassword(password, salt)
	try {
		const user = await insertUser({
			email,
			name,
			password: hashedPassword,
			salt,
		})
		await createUserSession(user, res)
		res.json(user)
	} catch (err) {
		console.error('Signup Error:', err)
		res.status(500).json({ error: 'Failed to create user' })
	}
})

const COOKIE_SESSION_KEY = 'session-id'

app.get('/api/me', async (req, res) => {
	const sessionId = req.cookies[COOKIE_SESSION_KEY]
	if (!sessionId) return res.status(401).json({ error: 'Not authenticated' })

	const session = await redisClient.get(`session:${sessionId}`)
	if (!session) return res.status(401).json({ error: 'Session expired' })

	const { user_id, role } = session
	res.json({ user_id, role })
})

app.post('/api/users/signin', async (req, res) => {
	const { email, password } = req.body
	const user = await getUser(email)
	if (!user) {
		return res.status(400).json({ error: 'Invalid credentials' })
	}
	const isValidPassword = await comparePasswords({
		password,
		salt: user.salt,
		hashedPassword: user.password,
	})
	if (!isValidPassword) {
		return res.status(400).json({ error: 'Invalid credentials' })
	}
	await createUserSession(user, res)
	res.json(user)
})

app.post('/api/users/signout', async (req, res) => {
	const sessionId = req.cookies[COOKIE_SESSION_KEY]
	if (!sessionId) return res.status(401).json({ error: 'Not authenticated' })

	await redisClient.del(`session:${sessionId}`)
	res.clearCookie(COOKIE_SESSION_KEY)
	res.json({ message: 'Logged out successfully' })
})

app.get('/api/auth/google/callback', async (req, res) => {
	const code = req.query.code
	const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			code,
			client_id: process.env.GOOGLE_CLIENT_ID,
			client_secret: process.env.GOOGLE_CLIENT_SECRET,
			redirect_uri: 'http://localhost:4000/api/auth/google/callback',
			grant_type: 'authorization_code',
		}),
	})

	const tokenData = await tokenRes.json()
	// tokenData contains access_token, id_token, refresh_token, etc.
	// const idToken = tokenData.id_token

	// Decode the ID token (JWT) or send it to Google API to fetch user info
	const userInfoRes = await fetch(
		'https://www.googleapis.com/oauth2/v3/userinfo',
		{
			headers: {
				Authorization: `Bearer ${tokenData.access_token}`,
			},
		}
	)
	const userInfo = await userInfoRes.json()
	const oAuthUser = await handleGoogleLogin(userInfo)
	await createUserSession(oAuthUser, res)
	// Authenticate or register user in your system
	// Redirect to frontend with a session or JWT
	res.redirect(`http://localhost:3006`)
})

app.listen(port, '0.0.0.0', () => {
	console.log(`Server running on port ${port}`)
})

process.env.NODE_ENV === 'development' &&
	ngrok
		.connect({ addr: 4000, authtoken_from_env: true })
		.then((listener) =>
			console.log(`Ingress established at: ${listener.url()}`)
		)

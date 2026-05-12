import express from 'express'
import multer from 'multer'
import path, { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import {
	getAllUsers,
	getAdmin,
	getAllAdmin,
	addAdmin,
	updateAdmin,
	deleteAdmin,
} from '../drizzle/features/users.js'
import {
	addProduct,
	getAdminProducts,
	getAllProducts,
	updateProduct,
} from '../drizzle/features/products.js'
import {
	addDiamond,
	getAllDiamonds,
	updateDiamond,
} from '../drizzle/features/diamonds.js'
import { addStyle, getAllStyles, updateStyle } from '../drizzle/features/styles.js'
import {
	addCouponEntry,
	addMasterEntry,
	getCouponList,
	getMasterList,
} from '../drizzle/features/master.js'
import { getOrdersAdmin, updateStatus } from '../drizzle/features/orders.js'
import { createUserSession } from '../session.js'
import { requireAdmin } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads/')),
	filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
})

const upload = multer({
	storage,
	limits: { fileSize: 10 * 1024 * 1024, files: 10 },
})

const router = express.Router()

// Auth
router.post('/api/admin/login', async (req, res) => {
	try {
		const { email, password } = req.body
		const admin = await getAdmin(email, password)
		// Create a session cookie so subsequent admin requests are authenticated
		await createUserSession({ user_id: admin.user_id, role: 'admin' }, res)
		res.json({ user_id: admin.user_id, name: admin.name, email: admin.email })
	} catch (err) {
		console.error('Login Error:', err.message)
		res.status(401).json({ message: err.message || 'Failed to login' })
	}
})

// Admin management
router.get('/api/admin/getAllAdmin', requireAdmin, async (req, res) => {
	try {
		const data = await getAllAdmin()
		res.json(data)
	} catch (err) {
		console.error('getAllAdmin Error:', err)
		res.status(500).json({ error: 'Failed to get all admin' })
	}
})

router.post('/api/admin/createAdmin', requireAdmin, async (req, res) => {
	try {
		const { email, password, name } = req.body
		const data = await addAdmin({ name, email, password })
		res.json(data)
	} catch (err) {
		console.error('createAdmin Error:', err)
		res.status(500).json({ error: 'Failed to create admin' })
	}
})

router.put('/api/admin/updateAdmin/:id', requireAdmin, async (req, res) => {
	try {
		const { id } = req.params
		const { email, name, password } = req.body
		const data = await updateAdmin({ id }, { email, name, password })
		res.json(data)
	} catch (err) {
		console.error('updateAdmin Error:', err)
		res.status(500).json({ error: 'Failed to update admin' })
	}
})

router.delete('/api/admin/deleteAdmin/:id', requireAdmin, async (req, res) => {
	try {
		const { id } = req.params
		const data = await deleteAdmin({ id })
		res.json(data)
	} catch (err) {
		console.error('deleteAdmin Error:', err)
		res.status(500).json({ error: 'Failed to delete admin' })
	}
})

// Users
router.get('/api/admin/getAllUsers', requireAdmin, async (req, res) => {
	try {
		const data = await getAllUsers()
		res.json(data)
	} catch (err) {
		console.error('getAllUsers Error:', err)
		res.status(500).json({ error: 'Failed to get all users' })
	}
})

// Products
router.post('/api/admin/addProduct', requireAdmin, async (req, res) => {
	try {
		await addProduct(req.body)
		res.json({ success: true })
	} catch (err) {
		console.error('addProduct Error:', err)
		res.status(500).json({ error: 'Failed to add product' })
	}
})

router.get('/api/admin/getAdminProducts', requireAdmin, async (req, res) => {
	try {
		const data = await getAdminProducts()
		res.json(data)
	} catch (err) {
		console.error('getAdminProducts Error:', err)
		res.status(500).json({ error: 'Failed to get all products' })
	}
})

router.put('/api/admin/updateProduct/:product_id', requireAdmin, async (req, res) => {
	try {
		const updatedProduct = await updateProduct(req.params.product_id, req.body)
		res.json(updatedProduct)
	} catch (err) {
		console.error('updateProduct Error:', err)
		res.status(500).json({ error: 'Failed to update product' })
	}
})

// Diamonds
router.post('/api/admin/addDiamond', requireAdmin, async (req, res) => {
	try {
		await addDiamond(req.body)
		res.json({ success: true })
	} catch (err) {
		console.error('addDiamond Error:', err)
		res.status(500).json({ error: 'Failed to add diamond' })
	}
})

router.put('/api/admin/updateDiamond/:product_id', requireAdmin, async (req, res) => {
	try {
		const updatedProduct = await updateDiamond(req.params.product_id, req.body)
		res.json(updatedProduct)
	} catch (err) {
		console.error('updateDiamond Error:', err)
		res.status(500).json({ error: 'Failed to update diamond' })
	}
})

// Styles
router.post('/api/admin/addStyle', requireAdmin, async (req, res) => {
	try {
		await addStyle(req.body)
		res.json({ success: true })
	} catch (err) {
		console.error('addStyle Error:', err)
		res.status(500).json({ error: 'Failed to add style' })
	}
})

router.put('/api/admin/updateStyle/:product_id', requireAdmin, async (req, res) => {
	try {
		const updatedProduct = await updateStyle(req.params.product_id, req.body)
		res.json(updatedProduct)
	} catch (err) {
		console.error('updateStyle Error:', err)
		res.status(500).json({ error: 'Failed to update style' })
	}
})

// Master / Coupons
router.get('/api/admin/getMasterList', async (req, res) => {
	// Public — used by the storefront for currency rates.
	try {
		const data = await getMasterList()
		res.json(data)
	} catch (err) {
		console.error('getMasterList Error:', err)
		res.status(500).json({ error: 'Failed to get master list' })
	}
})

router.post('/api/admin/addMasterEntry', requireAdmin, async (req, res) => {
	try {
		await addMasterEntry(req.body)
		res.json({ success: true })
	} catch (err) {
		console.error('addMasterEntry Error:', err)
		res.status(500).json({ error: 'Failed to add master entry' })
	}
})

router.get('/api/admin/getCouponList', requireAdmin, async (req, res) => {
	try {
		const data = await getCouponList()
		res.json(data)
	} catch (err) {
		console.error('getCouponList Error:', err)
		res.status(500).json({ error: 'Failed to get coupon list' })
	}
})

router.post('/api/admin/addCouponEntry', requireAdmin, async (req, res) => {
	try {
		await addCouponEntry(req.body)
		res.json({ success: true })
	} catch (err) {
		console.error('addCouponEntry Error:', err)
		res.status(500).json({ error: 'Failed to add coupon entry' })
	}
})

// Orders
router.get('/api/admin/orders', requireAdmin, async (req, res) => {
	try {
		const data = await getOrdersAdmin()
		res.json(data)
	} catch (err) {
		console.error('getOrdersAdmin Error:', err)
		res.status(500).json({ error: 'Failed to get order list' })
	}
})

router.post('/api/admin/updateStatus', requireAdmin, async (req, res) => {
	try {
		const { orderId, status } = req.body
		await updateStatus(orderId, status)
		res.json({ success: true })
	} catch (err) {
		console.error('updateStatus Error:', err)
		res.status(500).json({ error: 'Failed to update status' })
	}
})

// Image uploads
router.post('/admin/upload', requireAdmin, upload.array('images', 10), (req, res) => {
	if (!req.files || req.files.length === 0) {
		return res.status(400).json({ error: 'No files uploaded' })
	}
	const fileUrls = req.files.map(
		(file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
	)
	res.json({ message: 'Files uploaded successfully', fileUrls })
})

router.get('/images', requireAdmin, (req, res) => {
	const uploadsDir = path.join(__dirname, '../uploads')
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

router.delete('/admin/delete', requireAdmin, (req, res) => {
	const { url } = req.body
	if (!url) {
		return res.status(400).json({ success: false, message: 'Image URL is required' })
	}
	const filename = path.basename(url)
	const filePath = path.join(__dirname, '../uploads', filename)
	try {
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath)
			res.json({ success: true, message: 'Image deleted successfully' })
		} else {
			res.status(404).json({ success: false, message: 'File not found' })
		}
	} catch (error) {
		console.error('Error deleting file:', error)
		res.status(500).json({ success: false, message: 'Failed to delete image' })
	}
})

export default router

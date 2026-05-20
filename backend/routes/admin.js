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
	updateProduct,
} from '../drizzle/features/products.js'
import { addDiamond, updateDiamond } from '../drizzle/features/diamonds.js'
import { addStyle, updateStyle } from '../drizzle/features/styles.js'
import {
	addCouponEntry,
	addMasterEntry,
	getCouponList,
	getMasterList,
} from '../drizzle/features/master.js'
import { getOrdersAdmin, updateStatus } from '../drizzle/features/orders.js'
import { createUserSession } from '../session.js'
import { requireAdmin } from '../middleware/auth.js'
import { authLimiter } from '../middleware/rateLimit.js'
import { validate } from '../middleware/validate.js'
import { asyncHandler } from '../middleware/asyncHandler.js'
import {
	adminCreateSchema,
	adminLoginSchema,
	adminUpdateSchema,
	couponEntrySchema,
	diamondSchema,
	masterEntrySchema,
	productSchema,
	styleSchema,
	updateStatusSchema,
} from '../schemas.js'

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

router.post(
	'/api/admin/login',
	authLimiter,
	validate(adminLoginSchema),
	asyncHandler(async (req, res) => {
		const { email, password } = req.body
		try {
			const admin = await getAdmin(email, password)
			await createUserSession({ user_id: admin.user_id, role: 'admin' }, res)
			res.json({ user_id: admin.user_id, name: admin.name, email: admin.email })
		} catch (err) {
			res.status(401).json({ message: err.message || 'Failed to login' })
		}
	})
)

router.get(
	'/api/admin/getAllAdmin',
	requireAdmin,
	asyncHandler(async (req, res) => {
		const data = await getAllAdmin()
		res.json(data)
	})
)

router.post(
	'/api/admin/createAdmin',
	requireAdmin,
	validate(adminCreateSchema),
	asyncHandler(async (req, res) => {
		const data = await addAdmin(req.body)
		res.json(data)
	})
)

router.put(
	'/api/admin/updateAdmin/:id',
	requireAdmin,
	validate(adminUpdateSchema),
	asyncHandler(async (req, res) => {
		const data = await updateAdmin({ id: req.params.id }, req.body)
		res.json(data)
	})
)

router.delete(
	'/api/admin/deleteAdmin/:id',
	requireAdmin,
	asyncHandler(async (req, res) => {
		const data = await deleteAdmin({ id: req.params.id })
		res.json(data)
	})
)

router.get(
	'/api/admin/getAllUsers',
	requireAdmin,
	asyncHandler(async (req, res) => {
		const data = await getAllUsers()
		res.json(data)
	})
)

router.post(
	'/api/admin/addProduct',
	requireAdmin,
	validate(productSchema),
	asyncHandler(async (req, res) => {
		await addProduct(req.body)
		res.json({ success: true })
	})
)

router.get(
	'/api/admin/getAdminProducts',
	requireAdmin,
	asyncHandler(async (req, res) => {
		const data = await getAdminProducts()
		res.json(data)
	})
)

router.put(
	'/api/admin/updateProduct/:product_id',
	requireAdmin,
	validate(productSchema),
	asyncHandler(async (req, res) => {
		const updatedProduct = await updateProduct(req.params.product_id, req.body)
		res.json(updatedProduct)
	})
)

router.post(
	'/api/admin/addDiamond',
	requireAdmin,
	validate(diamondSchema),
	asyncHandler(async (req, res) => {
		await addDiamond(req.body)
		res.json({ success: true })
	})
)

router.put(
	'/api/admin/updateDiamond/:product_id',
	requireAdmin,
	validate(diamondSchema),
	asyncHandler(async (req, res) => {
		const updatedProduct = await updateDiamond(req.params.product_id, req.body)
		res.json(updatedProduct)
	})
)

router.post(
	'/api/admin/addStyle',
	requireAdmin,
	validate(styleSchema),
	asyncHandler(async (req, res) => {
		await addStyle(req.body)
		res.json({ success: true })
	})
)

router.put(
	'/api/admin/updateStyle/:product_id',
	requireAdmin,
	validate(styleSchema),
	asyncHandler(async (req, res) => {
		const updatedProduct = await updateStyle(req.params.product_id, req.body)
		res.json(updatedProduct)
	})
)

// Public — used by the storefront for currency rates.
router.get(
	'/api/admin/getMasterList',
	asyncHandler(async (req, res) => {
		const data = await getMasterList()
		res.json(data)
	})
)

router.post(
	'/api/admin/addMasterEntry',
	requireAdmin,
	validate(masterEntrySchema),
	asyncHandler(async (req, res) => {
		await addMasterEntry(req.body)
		res.json({ success: true })
	})
)

router.get(
	'/api/admin/getCouponList',
	requireAdmin,
	asyncHandler(async (req, res) => {
		const data = await getCouponList()
		res.json(data)
	})
)

router.post(
	'/api/admin/addCouponEntry',
	requireAdmin,
	validate(couponEntrySchema),
	asyncHandler(async (req, res) => {
		await addCouponEntry(req.body)
		res.json({ success: true })
	})
)

router.get(
	'/api/admin/orders',
	requireAdmin,
	asyncHandler(async (req, res) => {
		const data = await getOrdersAdmin()
		res.json(data)
	})
)

router.post(
	'/api/admin/updateStatus',
	requireAdmin,
	validate(updateStatusSchema),
	asyncHandler(async (req, res) => {
		const { orderId, status } = req.body
		await updateStatus(orderId, status)
		res.json({ success: true })
	})
)

router.post('/api/admin/upload', requireAdmin, upload.array('images', 10), (req, res) => {
	if (!req.files || req.files.length === 0) {
		return res.status(400).json({ error: 'No files uploaded' })
	}
	const fileUrls = req.files.map(
		(file) => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`
	)
	res.json({ message: 'Files uploaded successfully', fileUrls })
})

router.get('/api/images', requireAdmin, (req, res) => {
	const uploadsDir = path.join(__dirname, '../uploads')
	fs.readdir(uploadsDir, (err, files) => {
		if (err) return res.status(500).json({ error: 'Unable to fetch images' })

		const fileUrls = files.map(
			(file) => `${req.protocol}://${req.get('host')}/uploads/${file}`
		)
		res.json({ images: fileUrls })
	})
})

router.delete('/api/admin/delete', requireAdmin, (req, res) => {
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

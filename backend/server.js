import express from 'express'
import dotenv from 'dotenv'
import ngrok from '@ngrok/ngrok'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'
import addressRoutes from './routes/addresses.js'
import { errorHandler } from './middleware/asyncHandler.js'

const envFile =
	process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development'

dotenv.config({ path: envFile })

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = process.env.PORT || 4001

// Behind ngrok / a reverse proxy in prod, so req.ip and rate-limit keys
// resolve to the real client IP rather than the proxy hop.
app.set('trust proxy', 1)

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
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(authRoutes)
app.use(userRoutes)
app.use(productRoutes)
app.use(orderRoutes)
app.use(adminRoutes)
app.use(addressRoutes)
app.use(errorHandler)

app.listen(port, '0.0.0.0', () => {
	console.log(`Server running on port ${port}`)
})

process.env.NODE_ENV === 'development' &&
	ngrok
		.connect({ addr: 4000, authtoken_from_env: true })
		.then((listener) => console.log(`Ingress established at: ${listener.url()}`))

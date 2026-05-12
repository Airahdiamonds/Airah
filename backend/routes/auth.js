import express from 'express'
import { insertUser, getUser } from '../drizzle/features/users.js'
import { handleGoogleLogin } from '../drizzle/features/userOAuthAccount.js'
import { comparePasswords, generateSalt, hashPassword } from '../passwordHasher.js'
import { clearSessionCookie, createUserSession, getSession } from '../session.js'
import { redisClient } from '../redis.js'
import { validate } from '../middleware/validate.js'
import { authLimiter } from '../middleware/rateLimit.js'
import { signinSchema, signupSchema } from '../schemas.js'

const router = express.Router()
const COOKIE_SESSION_KEY = 'session-id'

const signupPaths = ['/api/users/signup', '/api/user/signup', '/users/signup', '/user/signup']

router.post(signupPaths, authLimiter, validate(signupSchema), async (req, res) => {
	const { email, name, password } = req.body
	const existingUser = await getUser(email)
	if (existingUser) {
		return res.status(409).json({ error: 'User already exists' })
	}
	const salt = generateSalt()
	const hashedPassword = await hashPassword(password, salt)
	try {
		const user = await insertUser({ email, name, password: hashedPassword, salt })
		await createUserSession(user, res)
		res.json(user)
	} catch (err) {
		console.error('Signup Error:', err)
		res.status(500).json({ error: 'Failed to create user' })
	}
})

router.post('/api/users/signin', authLimiter, validate(signinSchema), async (req, res) => {
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

router.post('/api/users/signout', async (req, res) => {
	const sessionId = req.cookies[COOKIE_SESSION_KEY]
	if (!sessionId) return res.status(401).json({ error: 'Not authenticated' })

	await redisClient.del(`session:${sessionId}`)
	clearSessionCookie(res)
	res.json({ message: 'Logged out successfully' })
})

router.get('/api/me', async (req, res) => {
	const sessionId = req.cookies[COOKIE_SESSION_KEY]
	if (!sessionId) return res.json(null)

	const session = await getSession(sessionId)
	if (!session) {
		clearSessionCookie(res)
		return res.json(null)
	}

	const { user_id, role } = session
	res.json({ user_id, role })
})

router.get('/api/auth/google/callback', authLimiter, async (req, res) => {
	try {
		const code = req.query.code
		if (!code) {
			return res.status(400).send('Missing authorization code')
		}

		const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				code,
				client_id: process.env.GOOGLE_CLIENT_ID,
				client_secret: process.env.GOOGLE_CLIENT_SECRET,
				redirect_uri: process.env.GOOGLE_REDIRECT_URI,
				grant_type: 'authorization_code',
			}),
		})

		const tokenData = await tokenRes.json()

		if (!tokenData.access_token) {
			console.error('Google token exchange failed:', tokenData)
			return res.status(401).send('Google authentication failed')
		}

		const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
			headers: { Authorization: `Bearer ${tokenData.access_token}` },
		})
		const userInfo = await userInfoRes.json()

		if (!userInfo.sub) {
			console.error('Google userinfo fetch failed:', userInfo)
			return res.status(401).send('Failed to retrieve Google user info')
		}

		const oAuthUser = await handleGoogleLogin(userInfo)
		await createUserSession(oAuthUser, res)
		const fallback = process.env.NODE_ENV === 'production'
			? 'https://airahdiamonds.com'
			: 'http://localhost:3006'
		res.redirect(process.env.FRONTEND_URL || fallback)
	} catch (err) {
		console.error('Google OAuth callback error:', err)
		res.status(500).send('Authentication error')
	}
})

export default router

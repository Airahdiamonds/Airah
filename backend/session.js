import { redisClient } from './redis.js'
import crypto from 'crypto'

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
const COOKIE_SESSION_KEY = 'session-id'

export async function createUserSession(user, res) {
	const sessionId = crypto.randomBytes(512).toString('hex').normalize()
	const { user_id, role } = user
	await redisClient.set(
		`session:${sessionId}`,
		JSON.stringify({ user_id, role }),
		{
			ex: SESSION_EXPIRATION_SECONDS,
		}
	)

	res.cookie(COOKIE_SESSION_KEY, sessionId, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		expires: new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000),
	})
}

export async function removeUserFromSession(cookies) {
	const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
	if (sessionId == null) return null

	await redisClient.del(`session:${sessionId}`)
	cookies.delete(COOKIE_SESSION_KEY)
}

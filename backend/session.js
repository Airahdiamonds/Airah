import { redisClient } from './redis.js'
import crypto from 'crypto'

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7
const COOKIE_SESSION_KEY = 'session-id'

// Shared cookie attributes used by both `setCookie` and `clearCookie`.
// Browsers require the cookie attributes (httpOnly / secure / sameSite)
// to match those used at the time the cookie was set, otherwise the
// `clearCookie` call silently does nothing — keep this in one place.
const BASE_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'lax',
}

export function getSessionCookieOptions() {
	return {
		...BASE_COOKIE_OPTIONS,
		expires: new Date(Date.now() + SESSION_EXPIRATION_SECONDS * 1000),
	}
}

export async function getSession(sessionId) {
	if (!sessionId) return null

	const session = await redisClient.get(`session:${sessionId}`)
	if (!session) return null

	if (typeof session === 'string') {
		try {
			return JSON.parse(session)
		} catch {
			return null
		}
	}

	return session
}

export function clearSessionCookie(res) {
	res.clearCookie(COOKIE_SESSION_KEY, BASE_COOKIE_OPTIONS)
}

export async function createUserSession(user, res) {
	const sessionId = crypto.randomBytes(512).toString('hex').normalize()
	const { user_id, role } = user
	await redisClient.set(
		`session:${sessionId}`,
		{ user_id, role },
		{
			ex: SESSION_EXPIRATION_SECONDS,
		}
	)

	res.cookie(COOKIE_SESSION_KEY, sessionId, getSessionCookieOptions())
}

export async function removeUserFromSession(cookies) {
	const sessionId = cookies.get(COOKIE_SESSION_KEY)?.value
	if (sessionId == null) return null

	await redisClient.del(`session:${sessionId}`)
	cookies.delete(COOKIE_SESSION_KEY)
}

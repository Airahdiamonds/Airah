import { getSession } from '../session.js'

const COOKIE_SESSION_KEY = 'session-id'

export async function requireSession(req, res, next) {
	const sessionId = req.cookies[COOKIE_SESSION_KEY]
	if (!sessionId) return res.status(401).json({ error: 'Not authenticated' })

	const session = await getSession(sessionId)
	if (!session) return res.status(401).json({ error: 'Session expired' })

	req.user = session
	next()
}

// Attaches req.user if a valid session exists; does not reject if there is none.
// Use on routes that support both authenticated users and guests.
export async function optionalSession(req, res, next) {
	const sessionId = req.cookies[COOKIE_SESSION_KEY]
	if (sessionId) {
		const session = await getSession(sessionId)
		if (session) req.user = session
	}
	next()
}

export async function requireAdmin(req, res, next) {
	const sessionId = req.cookies[COOKIE_SESSION_KEY]
	if (!sessionId) return res.status(401).json({ error: 'Not authenticated' })

	const session = await getSession(sessionId)
	if (!session) return res.status(401).json({ error: 'Session expired' })

	if (session.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })

	req.user = session
	next()
}

// Wraps an async route handler so any thrown error is forwarded to Express's
// error handler instead of leaving the request hanging. Removes the repeated
// try/catch boilerplate that every route otherwise needs.
//
// Usage:
//   router.get('/api/foo', asyncHandler(async (req, res) => { ... }))
export const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next)
}

// Default error responder. Mounted at the bottom of server.js so that any
// error forwarded by `asyncHandler` (or thrown by middleware) lands here
// with a consistent JSON shape. Keeps the original status if one was set
// by the route (e.g. via `res.status(400)` before throwing).
export const errorHandler = (err, req, res, _next) => {
	const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
	const message = err?.message || 'Internal server error'
	if (process.env.NODE_ENV !== 'production') {
		console.error(`[${req.method} ${req.originalUrl}]`, err)
	}
	res.status(status).json({ error: message })
}

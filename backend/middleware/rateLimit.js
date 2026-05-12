import rateLimit from 'express-rate-limit'

// Sign-in / sign-up: 10 attempts per 15 minutes per IP.
export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 10,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many authentication attempts, try again later.' },
})

// Payment verify / create-order: 30 attempts per 10 minutes per IP.
export const paymentLimiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	max: 30,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many payment requests, slow down.' },
})

// Generic write-rate limiter for hot endpoints like coupon validation.
export const writeLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 60,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many requests, slow down.' },
})

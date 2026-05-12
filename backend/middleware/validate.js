import { ZodError } from 'zod'

// Runs `schema.parse(value)` against the chosen source. On success, replaces
// `req[source]` with the parsed (and coerced) value so handlers see typed data.
// On a ZodError responds 400 with the first issue.
export function validate(schema, source = 'body') {
	return (req, res, next) => {
		try {
			req[source] = schema.parse(req[source])
			next()
		} catch (err) {
			if (err instanceof ZodError) {
				const first = err.issues?.[0]
				const path = first?.path?.join('.') || source
				return res.status(400).json({
					error: `Invalid ${path}: ${first?.message || 'validation failed'}`,
				})
			}
			next(err)
		}
	}
}

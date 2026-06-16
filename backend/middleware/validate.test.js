import { describe, it, expect, vi } from 'vitest'
import { z } from 'zod'
import { validate } from './validate.js'

// ─────────────────────────────────────────────────────────────────────────────
// KEY CONCEPT: testing middleware without a real Express server.
//
// Express calls every middleware as: handler(req, res, next)
// So we create fake objects that look like what Express would pass:
//   - req  — the incoming request (we give it a .body / .query / .params)
//   - res  — the response (we spy on .status() and .json() to see what's sent)
//   - next — a spy function; Express calls it with no args to proceed,
//             or with an error to go to the error handler
//
// vi.fn().mockReturnThis() makes res.status(400) return `res` itself, so
// res.status(400).json({...}) chains correctly — same as real Express.
// ─────────────────────────────────────────────────────────────────────────────

function makeMocks({ body = {}, query = {}, params = {} } = {}) {
  const req = { body, query, params }
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }
  const next = vi.fn()
  return { req, res, next }
}

// A simple schema used throughout these tests
const nameSchema = z.object({ name: z.string().min(1) })

// ── happy path ────────────────────────────────────────────────────────────────

describe('validate middleware — valid input', () => {
  it('calls next() with no arguments when body is valid', () => {
    const { req, res, next } = makeMocks({ body: { name: 'Prem' } })
    validate(nameSchema)(req, res, next)
    expect(next).toHaveBeenCalledOnce()
    expect(next).toHaveBeenCalledWith(/* nothing — no error */)
  })

  it('replaces req.body with the parsed value (enables coercion)', () => {
    // coerce.number() turns the string "25" into the number 25
    const coerceSchema = z.object({ age: z.coerce.number() })
    const { req, res, next } = makeMocks({ body: { age: '25' } })
    validate(coerceSchema)(req, res, next)
    expect(req.body.age).toBe(25)
  })

  it('validates req.query when source is "query"', () => {
    const idSchema = z.object({ id: z.coerce.number().int().positive() })
    const { req, res, next } = makeMocks({ query: { id: '7' } })
    validate(idSchema, 'query')(req, res, next)
    expect(next).toHaveBeenCalledOnce()
    expect(req.query.id).toBe(7)
  })
})

// ── validation failures ───────────────────────────────────────────────────────

describe('validate middleware — invalid input', () => {
  it('responds with status 400 when body fails validation', () => {
    const { req, res, next } = makeMocks({ body: { name: '' } }) // min(1) fails
    validate(nameSchema)(req, res, next)
    expect(res.status).toHaveBeenCalledWith(400)
  })

  it('responds with a JSON error message', () => {
    const { req, res, next } = makeMocks({ body: {} }) // missing required field
    validate(nameSchema)(req, res, next)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    )
  })

  it('does NOT call next() after a validation failure', () => {
    const { req, res, next } = makeMocks({ body: { name: '' } })
    validate(nameSchema)(req, res, next)
    expect(next).not.toHaveBeenCalled()
  })

  it('includes the field name in the error message', () => {
    const { req, res, next } = makeMocks({ body: { name: '' } })
    validate(nameSchema)(req, res, next)
    const [payload] = res.json.mock.calls[0]
    expect(payload.error).toContain('name')
  })
})

// ── non-Zod errors ────────────────────────────────────────────────────────────

describe('validate middleware — unexpected errors', () => {
  it('forwards non-Zod errors to next(err) instead of responding 400', () => {
    const bustedSchema = {
      parse: () => { throw new TypeError('schema itself is broken') },
    }
    const { req, res, next } = makeMocks({ body: {} })
    validate(bustedSchema)(req, res, next)
    expect(next).toHaveBeenCalledWith(expect.any(TypeError))
    expect(res.status).not.toHaveBeenCalled()
  })
})

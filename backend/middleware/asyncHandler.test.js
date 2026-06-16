import { describe, it, expect, vi } from 'vitest'
import { asyncHandler, errorHandler } from './asyncHandler.js'

// asyncHandler wraps async route functions so errors go to next(err).
// errorHandler is the Express error-handler mounted at the bottom of server.js.

function makeMocks({ statusCode = 200 } = {}) {
  const req = { method: 'GET', originalUrl: '/api/test' }
  const res = {
    statusCode,
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }
  const next = vi.fn()
  return { req, res, next }
}

// asyncHandler's catch(next) fires as a microtask (asynchronous).
// Awaiting a macrotask (setTimeout 0) ensures all pending microtasks drain
// before we check whether next() was called.
const flush = () => new Promise((r) => setTimeout(r, 0))

// ── asyncHandler ──────────────────────────────────────────────────────────────

describe('asyncHandler', () => {
  it('calls the wrapped function with (req, res, next)', async () => {
    const handler = vi.fn().mockResolvedValue(undefined)
    const { req, res, next } = makeMocks()
    asyncHandler(handler)(req, res, next)
    await flush()
    expect(handler).toHaveBeenCalledWith(req, res, next)
  })

  it('does not call next() when the handler resolves normally', async () => {
    const handler = vi.fn().mockResolvedValue(undefined)
    const { req, res, next } = makeMocks()
    asyncHandler(handler)(req, res, next)
    await flush()
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next(err) when the handler returns a rejected promise', async () => {
    const err = new Error('database connection failed')
    const handler = vi.fn().mockRejectedValue(err)
    const { req, res, next } = makeMocks()
    asyncHandler(handler)(req, res, next)
    await flush()
    expect(next).toHaveBeenCalledWith(err)
  })

  it('calls next(err) when an async handler throws (i.e. its promise rejects)', async () => {
    // In practice all handlers passed to asyncHandler are `async` functions.
    // An `async` function that throws never throws synchronously — it always
    // returns a rejected promise, which .catch(next) handles correctly.
    const err = new Error('async throw becomes a rejection')
    const handler = vi.fn().mockImplementation(async () => { throw err })
    const { req, res, next } = makeMocks()
    asyncHandler(handler)(req, res, next)
    await flush()
    expect(next).toHaveBeenCalledWith(err)
  })
})

// ── errorHandler ──────────────────────────────────────────────────────────────

describe('errorHandler', () => {
  it('responds with 500 when statusCode is 200 (meaning no status was set)', () => {
    const { req, res, next } = makeMocks({ statusCode: 200 })
    errorHandler(new Error('boom'), req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'boom' })
  })

  it('preserves a non-200 statusCode already set by the route', () => {
    const { req, res, next } = makeMocks({ statusCode: 404 })
    errorHandler(new Error('not found'), req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'not found' })
  })

  it('uses "Internal server error" when the error has no message', () => {
    const { req, res, next } = makeMocks()
    errorHandler({}, req, res, next)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' })
  })

  it('uses the error message from the thrown error', () => {
    const { req, res, next } = makeMocks()
    errorHandler(new Error('custom message'), req, res, next)
    const [payload] = res.json.mock.calls[0]
    expect(payload.error).toBe('custom message')
  })
})

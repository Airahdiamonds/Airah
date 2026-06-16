import { describe, it, expect } from 'vitest'
import {
  signupSchema,
  signinSchema,
  addToCartSchema,
  addressSchema,
  couponEntrySchema,
  updateStatusSchema,
  reviewSchema,
} from './schemas.js'

// ── signupSchema ──────────────────────────────────────────────────────────────

describe('signupSchema', () => {
  it('accepts a valid signup payload', () => {
    const result = signupSchema.safeParse({
      name: 'Prem',
      email: 'prem@example.com',
      password: 'secret123',
    })
    expect(result.success).toBe(true)
  })

  it('trims whitespace and lowercases the email', () => {
    const result = signupSchema.safeParse({
      name: 'Prem',
      email: '  PREM@EXAMPLE.COM  ',
      password: 'secret123',
    })
    expect(result.success).toBe(true)
    expect(result.data.email).toBe('prem@example.com')
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = signupSchema.safeParse({
      name: 'Prem',
      email: 'prem@example.com',
      password: 'short',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email format', () => {
    const result = signupSchema.safeParse({
      name: 'Prem',
      email: 'not-an-email',
      password: 'secret123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an empty name', () => {
    const result = signupSchema.safeParse({
      name: '',
      email: 'prem@example.com',
      password: 'secret123',
    })
    expect(result.success).toBe(false)
  })

  it('rejects when name is missing entirely', () => {
    const result = signupSchema.safeParse({
      email: 'prem@example.com',
      password: 'secret123',
    })
    expect(result.success).toBe(false)
  })
})

// ── signinSchema ──────────────────────────────────────────────────────────────

describe('signinSchema', () => {
  it('accepts a valid signin payload', () => {
    const result = signinSchema.safeParse({
      email: 'prem@example.com',
      password: 'anypassword',
    })
    expect(result.success).toBe(true)
  })

  it('allows a 1-character password (signin has no min-length rule)', () => {
    const result = signinSchema.safeParse({ email: 'prem@example.com', password: 'x' })
    expect(result.success).toBe(true)
  })

  it('rejects an empty password', () => {
    const result = signinSchema.safeParse({ email: 'prem@example.com', password: '' })
    expect(result.success).toBe(false)
  })
})

// ── addToCartSchema ───────────────────────────────────────────────────────────

describe('addToCartSchema', () => {
  it('accepts a payload with a productId', () => {
    const result = addToCartSchema.safeParse({ productId: 5, quantity: 1 })
    expect(result.success).toBe(true)
  })

  it('accepts a payload with a diamondId', () => {
    const result = addToCartSchema.safeParse({ diamondId: 3, quantity: 2 })
    expect(result.success).toBe(true)
  })

  it('rejects when no product, diamond, or ring style is provided', () => {
    const result = addToCartSchema.safeParse({ quantity: 1 })
    expect(result.success).toBe(false)
  })

  it('rejects a quantity of 0', () => {
    const result = addToCartSchema.safeParse({ productId: 1, quantity: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects a quantity greater than 99', () => {
    const result = addToCartSchema.safeParse({ productId: 1, quantity: 100 })
    expect(result.success).toBe(false)
  })

  it('coerces a string productId to a number', () => {
    const result = addToCartSchema.safeParse({ productId: '5', quantity: 1 })
    expect(result.success).toBe(true)
    expect(result.data.productId).toBe(5)
  })

  it('stores a guestId when provided', () => {
    const result = addToCartSchema.safeParse({
      guestId: 'guest-abc-123',
      productId: 1,
      quantity: 1,
    })
    expect(result.success).toBe(true)
    expect(result.data.guestId).toBe('guest-abc-123')
  })
})

// ── addressSchema ─────────────────────────────────────────────────────────────

describe('addressSchema', () => {
  const validAddress = {
    full_name: 'Prem Vispute',
    phone_number: '9876543210',
    address_line1: '123 MG Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400001',
  }

  it('accepts a fully valid address', () => {
    expect(addressSchema.safeParse(validAddress).success).toBe(true)
  })

  it('defaults is_billing to false when omitted', () => {
    const result = addressSchema.safeParse(validAddress)
    expect(result.data.is_billing).toBe(false)
  })

  it('accepts is_billing: true', () => {
    const result = addressSchema.safeParse({ ...validAddress, is_billing: true })
    expect(result.data.is_billing).toBe(true)
  })

  it('defaults address_line2 to empty string when omitted', () => {
    const result = addressSchema.safeParse(validAddress)
    expect(result.data.address_line2).toBe('')
  })

  it('rejects when city is missing', () => {
    const { city, ...withoutCity } = validAddress
    expect(addressSchema.safeParse(withoutCity).success).toBe(false)
  })

  it('rejects a phone number shorter than 5 characters', () => {
    expect(addressSchema.safeParse({ ...validAddress, phone_number: '123' }).success).toBe(false)
  })
})

// ── couponEntrySchema ─────────────────────────────────────────────────────────

describe('couponEntrySchema', () => {
  const validCoupon = {
    code: 'SAVE10',
    discount_percentage: 10,
    expiry_date: '2026-12-31',
    max_uses: 100,
  }

  it('accepts a valid coupon', () => {
    expect(couponEntrySchema.safeParse(validCoupon).success).toBe(true)
  })

  it('rejects a discount above 100%', () => {
    expect(couponEntrySchema.safeParse({ ...validCoupon, discount_percentage: 101 }).success).toBe(false)
  })

  it('rejects a negative discount', () => {
    expect(couponEntrySchema.safeParse({ ...validCoupon, discount_percentage: -1 }).success).toBe(false)
  })

  it('coerces a string discount_percentage to a number', () => {
    const result = couponEntrySchema.safeParse({ ...validCoupon, discount_percentage: '15' })
    expect(result.success).toBe(true)
    expect(result.data.discount_percentage).toBe(15)
  })

  it('rejects a max_uses of 0', () => {
    expect(couponEntrySchema.safeParse({ ...validCoupon, max_uses: 0 }).success).toBe(false)
  })
})

// ── reviewSchema ──────────────────────────────────────────────────────────────

describe('reviewSchema', () => {
  it('accepts a valid review', () => {
    const result = reviewSchema.safeParse({ product_id: 1, rating: 5 })
    expect(result.success).toBe(true)
  })

  it('rejects a rating of 0 (minimum is 1)', () => {
    expect(reviewSchema.safeParse({ product_id: 1, rating: 0 }).success).toBe(false)
  })

  it('rejects a rating of 6 (maximum is 5)', () => {
    expect(reviewSchema.safeParse({ product_id: 1, rating: 6 }).success).toBe(false)
  })

  it('coerces a string rating to a number', () => {
    const result = reviewSchema.safeParse({ product_id: 1, rating: '4' })
    expect(result.success).toBe(true)
    expect(result.data.rating).toBe(4)
  })
})

// ── updateStatusSchema ────────────────────────────────────────────────────────

describe('updateStatusSchema', () => {
  it('accepts a valid status update', () => {
    const result = updateStatusSchema.safeParse({ orderId: 42, status: 'shipped' })
    expect(result.success).toBe(true)
  })

  it('rejects a non-positive orderId', () => {
    expect(updateStatusSchema.safeParse({ orderId: -1, status: 'shipped' }).success).toBe(false)
  })

  it('rejects an empty status string', () => {
    expect(updateStatusSchema.safeParse({ orderId: 1, status: '' }).success).toBe(false)
  })
})

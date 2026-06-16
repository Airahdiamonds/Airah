import { describe, it, expect } from 'vitest'
import { convertPrice, calculateRingTotal, formatDate, convertFormData } from './helpers'

// ── convertPrice ─────────────────────────────────────────────────────────────
// convertPrice(price, country, USD_rate, GBP_rate, AUD_rate, OMR_rate, AED_rate, EUR_rate)
// All rates are multipliers: INR × rate = foreign currency amount.

describe('convertPrice', () => {
  it('returns the original INR amount when country is INR', () => {
    expect(convertPrice(5000, 'INR')).toBe(5000)
  })

  it('returns the original price for an unknown country (default case)', () => {
    expect(convertPrice(5000, 'UNKNOWN')).toBe(5000)
  })

  it('multiplies by USD_rate when country is USD', () => {
    // 100 INR × 0.012 = 1.2 USD
    expect(convertPrice(100, 'USD', 0.012)).toBeCloseTo(1.2)
  })

  it('multiplies by GBP_rate when country is GBP', () => {
    // rate is the 4th argument: (price, country, USD, GBP, ...)
    expect(convertPrice(100, 'GBP', 0, 0.01)).toBeCloseTo(1)
  })

  it('multiplies by EUR_rate when country is EUR', () => {
    // EUR_rate is the 8th argument: (price, country, USD, GBP, AUD, OMR, AED, EUR)
    expect(convertPrice(200, 'EUR', 0, 0, 0, 0, 0, 0.011)).toBeCloseTo(2.2)
  })

  it('returns 0 when price is 0', () => {
    expect(convertPrice(0, 'USD', 0.012)).toBe(0)
  })
})

// ── calculateRingTotal ────────────────────────────────────────────────────────
// Adds head_style_price + shank_style_price + head_metal_price + shank_metal_price
// and optionally a diamond's price on top.

describe('calculateRingTotal', () => {
  it('adds all four ring price components', () => {
    const ring = {
      head_style_price: 1000,
      shank_style_price: 2000,
      head_metal_price: 500,
      shank_metal_price: 500,
    }
    expect(calculateRingTotal(ring)).toBe(4000)
  })

  it('adds diamond.price when a diamond object is provided', () => {
    const ring = { head_style_price: 1000, shank_style_price: 0, head_metal_price: 0, shank_metal_price: 0 }
    expect(calculateRingTotal(ring, { price: 25000 })).toBe(26000)
  })

  it('falls back to diamond.diamond_price when price is absent', () => {
    const ring = { head_style_price: 0, shank_style_price: 0, head_metal_price: 0, shank_metal_price: 0 }
    expect(calculateRingTotal(ring, { diamond_price: 15000 })).toBe(15000)
  })

  it('treats missing ring properties as 0', () => {
    expect(calculateRingTotal({})).toBe(0)
  })

  it('treats a null ring as 0', () => {
    expect(calculateRingTotal(null)).toBe(0)
  })

  it('returns just the ring total when diamond is null', () => {
    const ring = { head_style_price: 500, shank_style_price: 500, head_metal_price: 250, shank_metal_price: 250 }
    expect(calculateRingTotal(ring, null)).toBe(1500)
  })
})

// ── formatDate ────────────────────────────────────────────────────────────────
// Formats an ISO date string using en-GB locale → "dd/mm/yyyy"

describe('formatDate', () => {
  it('formats a date string as dd/mm/yyyy', () => {
    expect(formatDate('2025-12-25')).toBe('25/12/2025')
  })

  it('returns a non-empty string for any valid date', () => {
    const result = formatDate('2024-01-01')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})

// ── convertFormData ───────────────────────────────────────────────────────────
// Converts fields whose key contains 'price', 'quantity', 'total', or 'cost'
// from strings to numbers; empty strings become null.

describe('convertFormData', () => {
  it('converts a price string to a number', () => {
    const result = convertFormData({ name: 'Gold Ring', price: '5000' })
    expect(result.price).toBe(5000)
  })

  it('converts an empty price string to null', () => {
    const result = convertFormData({ total_cost: '' })
    expect(result.total_cost).toBeNull()
  })

  it('converts a null price field to null', () => {
    const result = convertFormData({ round_quantity: null })
    expect(result.round_quantity).toBeNull()
  })

  it('leaves non-price fields unchanged', () => {
    const result = convertFormData({ name: 'Gold Ring', description: 'A ring' })
    expect(result.name).toBe('Gold Ring')
    expect(result.description).toBe('A ring')
  })

  it('does not mutate the original object', () => {
    const original = { price: '1000' }
    convertFormData(original)
    expect(original.price).toBe('1000')
  })
})

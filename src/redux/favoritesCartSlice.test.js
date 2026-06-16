import { describe, it, expect, vi } from 'vitest'

// Mock the API module so tests don't make real HTTP calls.
// vi.mock() is automatically hoisted to the top by vitest, so the mock
// is in place before the slice is imported below.
vi.mock('../utils/api', () => ({
  fetchFavorites: vi.fn(),
  fetchCartItems: vi.fn(),
  addToFavoritesAPI: vi.fn(),
  removeFromFavoritesAPI: vi.fn(),
  addToCartAPI: vi.fn(),
  removeFromCartAPI: vi.fn(),
  validateCouponAPI: vi.fn(),
}))

import reducer, {
  clearCart,
  clearFavorites,
  clearCoupon,
  setAppliedCoupon,
} from './favoritesCartSlice'

const initialState = {
  favorites: [],
  cartItems: [],
  coupon: null,
  discount: 0,
  loading: false,
  error: null,
}

// ── initial state ─────────────────────────────────────────────────────────────

describe('favoritesCart reducer — initial state', () => {
  it('returns the expected initial state when no action is dispatched', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state).toEqual(initialState)
  })
})

// ── clearCart ─────────────────────────────────────────────────────────────────

describe('clearCart', () => {
  it('empties the cartItems array', () => {
    const stateWithItems = {
      ...initialState,
      cartItems: [{ id: 1, name: 'Solitaire Ring', quantity: 1 }],
    }
    const next = reducer(stateWithItems, clearCart())
    expect(next.cartItems).toEqual([])
  })

  it('does not touch favorites or other state', () => {
    const stateWithBoth = {
      ...initialState,
      cartItems: [{ id: 1 }],
      favorites: [{ id: 2 }],
    }
    const next = reducer(stateWithBoth, clearCart())
    expect(next.favorites).toEqual([{ id: 2 }])
    expect(next.coupon).toBeNull()
  })
})

// ── clearFavorites ────────────────────────────────────────────────────────────

describe('clearFavorites', () => {
  it('empties the favorites array', () => {
    const stateWithFaves = {
      ...initialState,
      favorites: [{ id: 10, name: 'Round Diamond' }],
    }
    const next = reducer(stateWithFaves, clearFavorites())
    expect(next.favorites).toEqual([])
  })

  it('does not touch cartItems or other state', () => {
    const stateWithBoth = {
      ...initialState,
      cartItems: [{ id: 1 }],
      favorites: [{ id: 2 }],
    }
    const next = reducer(stateWithBoth, clearFavorites())
    expect(next.cartItems).toEqual([{ id: 1 }])
  })
})

// ── setAppliedCoupon ──────────────────────────────────────────────────────────

describe('setAppliedCoupon', () => {
  it('stores the coupon code and discount percentage', () => {
    const next = reducer(initialState, setAppliedCoupon({ coupon: 'SAVE10', discount: 10 }))
    expect(next.coupon).toBe('SAVE10')
    expect(next.discount).toBe(10)
  })

  it('overwrites a previously set coupon', () => {
    const stateWithCoupon = { ...initialState, coupon: 'OLD20', discount: 20 }
    const next = reducer(stateWithCoupon, setAppliedCoupon({ coupon: 'NEW5', discount: 5 }))
    expect(next.coupon).toBe('NEW5')
    expect(next.discount).toBe(5)
  })
})

// ── clearCoupon ───────────────────────────────────────────────────────────────

describe('clearCoupon', () => {
  it('resets coupon to null and discount to 0', () => {
    const stateWithCoupon = { ...initialState, coupon: 'SAVE10', discount: 10 }
    const next = reducer(stateWithCoupon, clearCoupon())
    expect(next.coupon).toBeNull()
    expect(next.discount).toBe(0)
  })

  it('is a no-op when no coupon is set', () => {
    const next = reducer(initialState, clearCoupon())
    expect(next.coupon).toBeNull()
    expect(next.discount).toBe(0)
  })
})

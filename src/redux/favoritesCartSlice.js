import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
	fetchFavorites,
	fetchCartItems,
	addToFavoritesAPI,
	removeFromFavoritesAPI,
	addToCartAPI,
	removeFromCartAPI,
	validateCouponAPI,
} from '../utils/api'

// Owns favorites + cart state for both authenticated users (hydrated from
// the backend) and guests (kept in localStorage and merged on login via
// `useFavoritesSync`).

export const fetchUserFavorites = createAsyncThunk(
	'favoritesCart/fetchFavorites',
	async (userId, { rejectWithValue }) => {
		try {
			return await fetchFavorites(userId)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const fetchUserCartItems = createAsyncThunk(
	'favoritesCart/fetchCartItems',
	async ({ userId, guestId }, { rejectWithValue }) => {
		try {
			return await fetchCartItems({ userId, guestId })
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const addToFavorites = createAsyncThunk(
	'favoritesCart/addToFavorites',
	async (
		{ product_id, diamond_id, ring_style_id },
		{ rejectWithValue }
	) => {
		try {
			return await addToFavoritesAPI({
				productId: product_id ?? null,
				diamondId: diamond_id ?? null,
				ringStyleId: ring_style_id ?? null,
			})
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const removeFromFavorites = createAsyncThunk(
	'favoritesCart/removeFromFavorites',
	async (
		{ product_id, diamond_id, ring_style_id },
		{ rejectWithValue }
	) => {
		try {
			await removeFromFavoritesAPI({
				productId: product_id ?? null,
				diamondId: diamond_id ?? null,
				ringStyleId: ring_style_id ?? null,
			})
			return { product_id, diamond_id, ring_style_id }
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const addToCart = createAsyncThunk(
	'favoritesCart/addToCart',
	async (
		{ userId, guestId, productId, diamondId, ringStyleId, ringSize, quantity },
		{ rejectWithValue }
	) => {
		try {
			await addToCartAPI({
				userId,
				guestId,
				productId,
				diamondId,
				ringStyleId,
				ringSize,
				quantity,
			})
			// Re-fetch the authoritative cart so the slice has the joined
			// product/diamond/ring rows (prices, names, images) needed by the UI.
			return await fetchCartItems({ userId, guestId })
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const removeFromCart = createAsyncThunk(
	'favoritesCart/removeFromCart',
	async ({ userId, guestId, productId }, { rejectWithValue }) => {
		try {
			// productId is actually a cart_id — legacy name kept to avoid changing all call sites
			await removeFromCartAPI({ userId, guestId, cartId: productId })
			return await fetchCartItems({ userId, guestId })
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const validateCoupon = createAsyncThunk(
	'favoritesCart/validateCoupon',
	async (couponCode, { rejectWithValue }) => {
		try {
			return await validateCouponAPI(couponCode)
		} catch (error) {
			return rejectWithValue(error.response?.data?.error)
		}
	}
)

const favoritesCartSlice = createSlice({
	name: 'favoritesCart',
	initialState: {
		favorites: JSON.parse(localStorage.getItem('favorites')) || [],
		cartItems: [],
		coupon: null,
		discount: 0,
		loading: false,
		error: null,
	},
	reducers: {
		setAppliedCoupon: (state, action) => {
			state.coupon = action.payload.coupon
			state.discount = action.payload.discount
		},
		clearCoupon: (state) => {
			state.coupon = null
			state.discount = 0
		},
		clearCart: (state) => {
			state.cartItems = []
		},
		addToFavoritesLocal: (state, action) => {
			// Add to local Redux state
			let exists
			if (action.payload.product_id) {
				exists = state.favorites.some(
					(item) => item.product_id === action.payload.product_id
				)
			} else if (action.payload.diamond_id) {
				exists = state.favorites.some(
					(item) => item.diamond_id === action.payload.diamond_id
				)
			} else {
				exists = state.favorites.some(
					(item) => item.ring_style_id === action.payload.ring_style_id
				)
			}

			if (!exists) {
				state.favorites.push(action.payload)
			}

			// Update localStorage
			localStorage.setItem('favorites', JSON.stringify(state.favorites))
		},
		removeFromFavoritesLocal: (state, action) => {
			// Remove from local Redux state
			if (action.payload.product_id) {
				state.favorites = state.favorites.filter(
					(item) => item.product_id !== action.payload.product_id
				)
			} else if (action.payload.diamond_id) {
				state.favorites = state.favorites.filter(
					(item) => item.diamond_id !== action.payload.diamond_id
				)
			} else {
				state.favorites = state.favorites.filter(
					(item) => item.ring_style_id !== action.payload.ring_style_id
				)
			}

			// Update localStorage
			localStorage.setItem('favorites', JSON.stringify(state.favorites))
		},
		clearLocalFavorites: (state) => {
			// Clear local favorites when user logs in
			state.favorites = []
			localStorage.removeItem('favorites')
		},
	},
	extraReducers: (builder) => {
		builder
			// Fetch Favorites
			.addCase(fetchUserFavorites.pending, (state) => {
				state.loading = true
			})
			.addCase(fetchUserFavorites.fulfilled, (state, action) => {
				state.loading = false
				state.favorites = action.payload
			})
			.addCase(fetchUserFavorites.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

			// Fetch Cart Items
			.addCase(fetchUserCartItems.pending, (state) => {
				state.loading = true
			})
			.addCase(fetchUserCartItems.fulfilled, (state, action) => {
				state.loading = false
				state.cartItems = action.payload
			})
			.addCase(fetchUserCartItems.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

			// Add to Favorites
			.addCase(addToFavorites.pending, (state, action) => {
				// Optimistic insert — the API only returns { success: true },
				// so push a lightweight marker right away. fetchUserFavorites
				// will hydrate the full row later.
				const { product_id, diamond_id, ring_style_id } = action.meta.arg || {}
				const exists = state.favorites.some(
					(f) =>
						(product_id != null && f.product_id === product_id) ||
						(diamond_id != null && f.diamond_id === diamond_id) ||
						(ring_style_id != null && f.ring_style_id === ring_style_id)
				)
				if (!exists) {
					state.favorites.push({
						product_id: product_id ?? null,
						diamond_id: diamond_id ?? null,
						ring_style_id: ring_style_id ?? null,
					})
				}
			})
			.addCase(addToFavorites.rejected, (state, action) => {
				// Roll back optimistic insert
				const { product_id, diamond_id, ring_style_id } = action.meta.arg || {}
				state.favorites = state.favorites.filter(
					(f) =>
						!(
							(product_id != null && f.product_id === product_id) ||
							(diamond_id != null && f.diamond_id === diamond_id) ||
							(ring_style_id != null && f.ring_style_id === ring_style_id)
						)
				)
			})

			// Remove from Favorites
			.addCase(removeFromFavorites.pending, (state, action) => {
				// Optimistic remove — match by whichever id was supplied.
				const { product_id, diamond_id, ring_style_id } = action.meta.arg || {}
				state.favorites = state.favorites.filter(
					(f) =>
						!(
							(product_id != null && f.product_id === product_id) ||
							(diamond_id != null && f.diamond_id === diamond_id) ||
							(ring_style_id != null && f.ring_style_id === ring_style_id)
						)
				)
			})
			.addCase(removeFromFavorites.fulfilled, (state, action) => {
				const { product_id, diamond_id, ring_style_id } = action.payload || {}
				state.favorites = state.favorites.filter(
					(f) =>
						!(
							(product_id != null && f.product_id === product_id) ||
							(diamond_id != null && f.diamond_id === diamond_id) ||
							(ring_style_id != null && f.ring_style_id === ring_style_id)
						)
				)
			})

			// Add to Cart — thunk returns the canonical cart list from the server
			.addCase(addToCart.fulfilled, (state, action) => {
				if (Array.isArray(action.payload)) {
					state.cartItems = action.payload
				}
			})

			// Remove from Cart — same: thunk returns the canonical cart list
			.addCase(removeFromCart.fulfilled, (state, action) => {
				if (Array.isArray(action.payload)) {
					state.cartItems = action.payload
				}
			})

			.addCase(validateCoupon.fulfilled, (state, action) => {
				state.discount = action.payload.discount || 0
				state.error = null
			})
			.addCase(validateCoupon.rejected, (state, action) => {
				state.discount = 0
				state.error = action.payload
			})
	},
})

export const {
	setAppliedCoupon,
	clearCoupon,
	addToFavoritesLocal,
	removeFromFavoritesLocal,
	clearLocalFavorites,
	clearCart,
} = favoritesCartSlice.actions
export default favoritesCartSlice.reducer

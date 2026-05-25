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

// Owns favorites + cart state for both authenticated users and guests.
// Both are server-backed via `user_id` (logged-in) or `guest_id` (guest);
// the server is the source of truth and thunks re-fetch the canonical
// list after every mutation so the slice always has the joined product /
// diamond / ring rows (names, prices, images) the UI renders.

export const fetchUserFavorites = createAsyncThunk(
	'favoritesCart/fetchFavorites',
	async ({ userId, guestId }, { rejectWithValue }) => {
		try {
			return await fetchFavorites({ userId, guestId })
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
		{ userId, guestId, product_id, diamond_id, ring_style_id },
		{ rejectWithValue }
	) => {
		try {
			await addToFavoritesAPI({
				guestId: userId ? null : guestId,
				productId: product_id ?? null,
				diamondId: diamond_id ?? null,
				ringStyleId: ring_style_id ?? null,
			})
			// Re-fetch the authoritative list so the slice has joined rows.
			return await fetchFavorites({ userId, guestId })
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const removeFromFavorites = createAsyncThunk(
	'favoritesCart/removeFromFavorites',
	async (
		{ userId, guestId, product_id, diamond_id, ring_style_id },
		{ rejectWithValue }
	) => {
		try {
			await removeFromFavoritesAPI({
				guestId: userId ? null : guestId,
				productId: product_id ?? null,
				diamondId: diamond_id ?? null,
				ringStyleId: ring_style_id ?? null,
			})
			return await fetchFavorites({ userId, guestId })
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
		favorites: [],
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
		clearFavorites: (state) => {
			state.favorites = []
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

			// Add / Remove Favorites — thunks return the canonical favorites list
			.addCase(addToFavorites.fulfilled, (state, action) => {
				if (Array.isArray(action.payload)) {
					state.favorites = action.payload
				}
			})
			.addCase(removeFromFavorites.fulfilled, (state, action) => {
				if (Array.isArray(action.payload)) {
					state.favorites = action.payload
				}
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
	clearCart,
	clearFavorites,
} = favoritesCartSlice.actions
export default favoritesCartSlice.reducer

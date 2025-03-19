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
	async (userId, { rejectWithValue }) => {
		try {
			return await fetchCartItems(userId)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const addToFavorites = createAsyncThunk(
	'favoritesCart/addToFavorites',
	async (
		{ dbId, product_id, diamond_id, ring_style_id },
		{ rejectWithValue }
	) => {
		try {
			return await addToFavoritesAPI(
				dbId,
				product_id,
				diamond_id,
				ring_style_id
			)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const removeFromFavorites = createAsyncThunk(
	'favoritesCart/removeFromFavorites',
	async (
		{ userId, product_id, diamond_id, ring_style_id },
		{ rejectWithValue }
	) => {
		try {
			await removeFromFavoritesAPI(
				userId,
				product_id,
				diamond_id,
				ring_style_id
			)
			return product_id || diamond_id || ring_style_id
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const addToCart = createAsyncThunk(
	'favoritesCart/addToCart',
	async (
		{ userId, productId, diamondId, ringStyleId, quantity },
		{ rejectWithValue }
	) => {
		try {
			return await addToCartAPI(
				userId,
				productId,
				diamondId,
				ringStyleId,
				quantity
			)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const removeFromCart = createAsyncThunk(
	'favoritesCart/removeFromCart',
	async ({ userId, productId }, { rejectWithValue }) => {
		try {
			await removeFromCartAPI(userId, productId)
			return { cart_id: productId }
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
			.addCase(addToFavorites.fulfilled, (state, action) => {
				if (action.payload.success) {
					return
				}
				state.favorites.push(action.payload)
			})

			// Remove from Favorites
			.addCase(removeFromFavorites.fulfilled, (state, action) => {
				state.favorites = state.favorites.filter(
					(item) => item.product_id !== action.payload
				)
			})

			// Add to Cart
			.addCase(addToCart.fulfilled, (state, action) => {
				if (action.payload.success) {
					return
				}
				state.cartItems.push(action.payload)
			})

			// Remove from Cart
			.addCase(removeFromCart.fulfilled, (state, action) => {
				const cartId = action.payload.cart_id
				state.cartItems = state.cartItems.filter(
					(item) => item.cart_id !== cartId
				)
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
} = favoritesCartSlice.actions
export default favoritesCartSlice.reducer

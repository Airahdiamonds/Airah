import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
	getAllDiamonds,
	getAllProducts,
	getAllStyles,
	getAllUsers,
} from '../utils/api'

export const fetchUsers = createAsyncThunk(
	'users/fetchUsers',
	async (_, { rejectWithValue }) => {
		try {
			const response = await getAllUsers()
			return response.data
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const fetchProducts = createAsyncThunk(
	'products/fetchProducts',
	async (dbId, { rejectWithValue }) => {
		try {
			const response = await getAllProducts(dbId)
			return response.data
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const fetchDiamonds = createAsyncThunk(
	'products/fetchDiamonds',
	async (dbId, { rejectWithValue }) => {
		try {
			const response = await getAllDiamonds(dbId)
			return response.data
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const fetchStyles = createAsyncThunk(
	'products/fetchStyles',
	async (dbId, { rejectWithValue }) => {
		try {
			const response = await getAllStyles(dbId)
			return response.data
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

const userProductsSlice = createSlice({
	name: 'userProducts',
	initialState: {
		users: [],
		products: [],
		diamonds: [],
		styles: [],
		loading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Fetch Users
			.addCase(fetchUsers.pending, (state) => {
				state.loading = true
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.loading = false
				state.users = action.payload
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

			// Fetch Products
			.addCase(fetchProducts.pending, (state) => {
				state.loading = true
			})
			.addCase(fetchProducts.fulfilled, (state, action) => {
				state.loading = false
				state.products = action.payload
			})
			.addCase(fetchProducts.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

			// Fetch Diamonds
			.addCase(fetchDiamonds.pending, (state) => {
				state.loading = true
			})
			.addCase(fetchDiamonds.fulfilled, (state, action) => {
				state.loading = false
				state.diamonds = action.payload
			})
			.addCase(fetchDiamonds.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

			// Fetch Styles
			.addCase(fetchStyles.pending, (state) => {
				state.loading = true
			})
			.addCase(fetchStyles.fulfilled, (state, action) => {
				state.loading = false
				state.styles = action.payload
			})
			.addCase(fetchStyles.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
	},
})

export default userProductsSlice.reducer

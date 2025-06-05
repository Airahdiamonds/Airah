import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { cancelUserOrder, createUserOrder, fetchUserOrders } from '../utils/api'

// Fetch orders from backend
export const fetchOrders = createAsyncThunk(
	'orders/fetchOrders',
	async ({ userId, guestId }, { rejectWithValue }) => {
		try {
			return await fetchUserOrders({ userId, guestId })
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

// Cancel an order
export const cancelOrder = createAsyncThunk(
	'orders/cancelOrder',
	async (orderId, { rejectWithValue }) => {
		try {
			return await cancelUserOrder(orderId)
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

export const createOrder = createAsyncThunk(
	'orders/createOrder',
	async ({ userId, guestId, cartItems, totalPrice }, { rejectWithValue }) => {
		try {
			return await createUserOrder({ userId, guestId, cartItems, totalPrice })
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

const ordersSlice = createSlice({
	name: 'orders',
	initialState: {
		orders: [],
		status: 'idle',
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchOrders.pending, (state) => {
				state.status = 'loading'
			})
			.addCase(fetchOrders.fulfilled, (state, action) => {
				state.status = 'succeeded'
				state.orders = action.payload
			})
			.addCase(fetchOrders.rejected, (state, action) => {
				state.status = 'failed'
				state.error = action.error.message
			})
			.addCase(cancelOrder.fulfilled, (state, action) => {
				state.orders = state.orders.map((order) =>
					order.id === action.payload
						? { ...order, status: 'Cancelled' }
						: order
				)
			})
			.addCase(createOrder.fulfilled, (state, action) => {
				state.orders.push(action.payload)
			})
	},
})

export default ordersSlice.reducer

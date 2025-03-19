import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getMasterList } from '../utils/api'

const initialState = {
	country: 'INR',
	currency: '₹',
	GBP_rate: 0,
	INR_rate: 0,
	loading: false,
	error: null,
}

export const fetchCurrencyRates = createAsyncThunk(
	'localization/fetchCurrencyRates',
	async (_, { rejectWithValue }) => {
		try {
			return await getMasterList()
		} catch (error) {
			return rejectWithValue(error.message)
		}
	}
)

const localizationSlice = createSlice({
	name: 'localization',
	initialState,
	reducers: {
		setCountry: (state, action) => {
			const country = action.payload
			state.country = country
			switch (country) {
				case 'USD':
					state.currency = '$'
					break
				case 'GBP':
					state.currency = '£'
					break
				default:
					state.currency = '₹'
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCurrencyRates.pending, (state) => {
				state.loading = true
			})
			.addCase(fetchCurrencyRates.fulfilled, (state, action) => {
				state.loading = false
				const latestRates = action.payload?.slice(-1)[0] || {}
				state.GBP_rate = latestRates.GBP_rate ?? state.GBP_rate
				state.INR_rate = latestRates.INR_rate ?? state.INR_rate
			})
			.addCase(fetchCurrencyRates.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
	},
})

export const { setCountry } = localizationSlice.actions
export default localizationSlice.reducer

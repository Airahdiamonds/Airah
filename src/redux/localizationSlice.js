import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getMasterList } from '../utils/api'

const initialState = {
	country: 'INR',
	currency: '₹',
	GBP_rate: 0,
	USD_rate: 0,
	loading: false,
	error: null,
	currentUser: null,
	guestUser: null,
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
				case 'EUR':
					state.currency = '€'
					break
				case 'OMR':
					state.currency = '﷼'
					break
				case 'AED':
					state.currency = 'د.إ'
					break
				case 'AUD':
					state.currency = 'A$'
					break
				default:
					state.currency = '₹'
			}
		},
		setUser: (state, action) => {
			state.currentUser = action.payload.user_id
		},
		clearUser: (state) => {
			state.currentUser = null
		},
		setGuest: (state, action) => {
			state.guestUser = action.payload
		},
		clearGuest: (state) => {
			state.guestUser = null
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
				state.USD_rate = latestRates.USD_rate ?? state.USD_rate
				state.AED_rate = latestRates.AED_rate ?? state.AED_rate
				state.AUD_rate = latestRates.AUD_rate ?? state.AUD_rate
				state.OMR_rate = latestRates.OMR_rate ?? state.OMR_rate
				state.EUR_rate = latestRates.EUR_rate ?? state.EUR_rate
			})
			.addCase(fetchCurrencyRates.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})
	},
})

export const { setCountry, setUser, clearUser, setGuest, clearGuest } =
	localizationSlice.actions
export default localizationSlice.reducer

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	step: 1,
	showDiamond: false,
	showRing: false,
	productDetails: [
		{
			diamond: {
				product_id: null,
				diamond_price: null,
			},
			ring: {
				product_id: null,
				ring_price: null,
				headStyle: 'Four Prong',
				headMetal: '14K White Gold',
				shankStyle: 'Solitaire',
				shankMetal: '14K White Gold',
			},
			total_cost: null,
			image_URL: [],
		},
	],
}

const ringCustomizationSlice = createSlice({
	name: 'ringCustomization',
	initialState,
	reducers: {
		setStep: (state, action) => {
			state.step = action.payload
		},
		updateDiamondDetails: (state, action) => {
			Object.assign(state.productDetails[0].diamond, action.payload)
		},
		setShowDiamond: (state, action) => {
			state.showDiamond = action.payload
		},
		updateRingDetails: (state, action) => {
			Object.assign(state.productDetails[0].ring, action.payload)
		},
		setShowRing: (state, action) => {
			state.showRing = action.payload
		},
		updateTotalCost: (state, action) => {
			Object.assign(state.productDetails[0], action.payload)
		},
		resetCustomization: () => initialState,
		resetDiamond: (state) => {
			state.productDetails[0].diamond = {
				...initialState.productDetails[0].diamond,
			}
			state.productDetails[0].total_cost = null
		},
		resetRing: (state) => {
			state.productDetails[0].ring = { ...initialState.productDetails[0].ring }
			state.productDetails[0].total_cost = null
		},
		setCustomization: (state, action) => {
			state.productDetails[0] = action.payload
		},
		setImageURLs: (state, action) => {
			if (state.productDetails.length > 0) {
				// Ensure image_URL is an array before updating
				const existingImages = Array.isArray(state.productDetails[0].image_URL)
					? state.productDetails[0].image_URL
					: []

				state.productDetails[0] = {
					...state.productDetails[0],
					image_URL: [...existingImages, action.payload], // Append new image
				}
			}
		},
	},
})

export const {
	setStep,
	updateDiamondDetails,
	setShowDiamond,
	updateRingDetails,
	setShowRing,
	updateTotalCost,
	resetCustomization,
	setCustomization,
	resetDiamond,
	resetRing,
	setImageURLs,
} = ringCustomizationSlice.actions
export default ringCustomizationSlice.reducer

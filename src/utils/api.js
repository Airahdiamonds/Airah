import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = import.meta.env.VITE_API_URL

// API contract for this module:
//   • Every function THROWS on error. Callers must handle rejection
//     (try/catch, thunk rejectWithValue, etc.). The only exception is
//     `fetchCurrentUser`, which returns `null` on 401 because that is
//     the documented "not logged in" signal.
//   • Request/response payloads use camelCase (`userId`, `guestId`,
//     `productId`, …). The Drizzle feature layer and DB columns use
//     snake_case; route handlers translate at the boundary.
//
// User-facing errors are surfaced via react-toastify in the response
// interceptor below, so callers do not need to add their own toasts
// for every failure.
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		const status = error.response?.status
		if (status === 401) {
			// Dispatch is not available here; broadcast via a custom event so
			// Header.jsx (which has the Redux store) can react. No toast —
			// 401 just means "not logged in".
			window.dispatchEvent(new CustomEvent('auth:unauthorized'))
		} else if (!error.config?.skipErrorToast) {
			const message =
				error.response?.data?.error ||
				error.response?.data?.message ||
				error.message ||
				'Something went wrong'
			toast.error(message)
		}
		return Promise.reject(error)
	}
)

export const fetchFavorites = async (userId) => {
	const response = await api.get(`/users/getFavorites/${userId}`)
	return response.data
}

export const fetchCartItems = async ({ userId, guestId }) => {
	const response = await api.get('/users/getCart', {
		params: { userId, guestId },
	})
	return response.data
}

export const addToFavoritesAPI = async ({
	productId,
	diamondId,
	ringStyleId,
}) => {
	const response = await api.post('/users/addToFavorites', {
		productId,
		diamondId,
		ringStyleId,
	})
	return response.data
}

export const removeFromFavoritesAPI = async ({
	productId,
	diamondId,
	ringStyleId,
}) => {
	await api.delete('/users/deleteFavorites', {
		data: {
			productId,
			diamondId,
			ringStyleId,
		},
	})
}

export const mergeFavoritesAPI = async (items) => {
	// Server expects camelCase keys on each item.
	const payload = items.map((it) => ({
		productId: it.product_id ?? it.productId ?? null,
		diamondId: it.diamond_id ?? it.diamondId ?? null,
		ringStyleId: it.ring_style_id ?? it.ringStyleId ?? null,
	}))
	await api.post('/users/mergeFavorites', { items: payload })
}

export const addToCartAPI = async ({
	userId,
	guestId,
	productId,
	diamondId,
	ringStyleId,
	ringSize,
	quantity,
}) => {
	const response = await api.post('/users/addToCart', {
		userId,
		guestId,
		productId,
		diamondId,
		ringStyleId,
		ringSize: ringSize ?? null,
		quantity,
	})
	return response.data
}

export const removeFromCartAPI = async ({ userId, guestId, cartId }) => {
	await api.delete('/users/deleteCart/', {
		params: { userId, guestId, cartId },
	})
}

export const mergeCartAPI = async (guestId) => {
	await api.post('/users/mergeCart', { guestId })
}

export const addProduct = async (data) => {
	return await api.post('/admin/addProduct', data)
}

export const getAllProducts = async (subCategory) => {
	if (!subCategory) {
		return await api.get('/admin/getAdminProducts')
	}
	return await api.get('/admin/getAllProducts', { params: { subCategory } })
}

export const getAllProductsByCategory = async (category) => {
	return await api.get(`/admin/getAllProductsByCategory/${category}`)
}

export const updateProduct = async (productId, data) => {
	return await api.put(`/admin/updateProduct/${productId}`, data)
}

export const getAllUsers = async () => {
	return await api.get('/admin/getAllUsers')
}

export const getProduct = async (productId) => {
	return await api.get(`/getProduct/${productId}`)
}

export const getDiamond = async (productId) => {
	return await api.get(`/getDiamond/${productId}`)
}

export const getStyle = async (productId) => {
	return await api.get(`/getStyle/${productId}`)
}

export const getMasterList = async () => {
	const response = await api.get('/admin/getMasterList')
	return response.data
}

export const addMasterEntry = async (data) => {
	return await api.post('/admin/addMasterEntry', data)
}

export const getAllDiamonds = async () => {
	return await api.get('/admin/getAllDiamonds')
}

export const getAllStyles = async () => {
	return await api.get('/admin/getAllStyles')
}

export const addDiamond = async (data) => {
	return await api.post('/admin/addDiamond', data)
}

export const updateDiamond = async (productId, data) => {
	return await api.put(`/admin/updateDiamond/${productId}`, data)
}

export const addStyle = async (data) => {
	return await api.post('/admin/addStyle', data)
}

export const updateStyle = async (productId, data) => {
	return await api.put(`/admin/updateStyle/${productId}`, data)
}

export const searchResult = async (text) => {
	return await api.get(`/search?search=${text}`)
}

export const fetchReviews = async ({
	product_id,
	page,
	limit,
	sortBy,
	sortOrder,
	rating,
	hasImage,
	fromDate,
	toDate,
}) => {
	const response = await api.get('/reviews', {
		params: {
			product_id,
			page,
			limit,
			sortBy,
			sortOrder,
			rating,
			hasImage,
			fromDate,
			toDate,
		},
	})
	return response.data
}

export const submitReviews = async (newReview) => {
	const response = await api.post('/submitReview', newReview)
	return response.data
}

export const addCouponEntry = async (data) => {
	return await api.post('/admin/addCouponEntry', data)
}

export const getCouponList = async () => {
	const response = await api.get('/admin/getCouponList')
	return response.data
}

export const validateCouponAPI = async (couponCode) => {
	const response = await api.post('/validateCoupon', { couponCode })
	return response.data
}

export const getCustomStyle = async ({
	head_style,
	head_metal,
	shank_style,
	shank_metal,
}) => {
	const response = await api.get('/getCustomStyle', {
		params: { head_style, head_metal, shank_style, shank_metal },
	})
	return response.data
}

export const getAllFilteredDiamonds = async (query) => {
	return await api.get('/getAllFilteredDiamonds', { params: query })
}

export const fetchUserOrders = async ({ userId, guestId }) => {
	const response = await api.get('/orders', {
		params: { userId, guestId },
	})
	return response.data
}

export const cancelUserOrder = async (orderId) => {
	const response = await api.post('/cancelOrder', { orderId })
	return response.data
}

export const createUserOrder = async ({
	userId,
	guestId,
	cartItems,
	totalPrice,
}) => {
	const response = await api.post('/createOrder', {
		userId,
		guestId,
		cartItems,
		totalPrice,
	})
	return response.data
}

export const signUpUser = async (userData) => {
	const response = await api.post('/users/signup', userData)
	return response.data
}

// Returns `null` when no session exists (401). Throws on any other error.
// This is the one exception to the throw-on-error contract above — callers
// rely on `null` to mean "not logged in" during bootstrap.
export const fetchCurrentUser = async () => {
	try {
		const response = await api.get('/me', { skipErrorToast: true })
		return response.data
	} catch (error) {
		if (error.response?.status === 401) return null
		throw error
	}
}

export const signInUser = async (userData) => {
	const response = await api.post('/users/signin', userData)
	return response.data
}

export const signoutUser = async () => {
	const response = await api.post('/users/signout', {})
	return response.data
}

export const createRazorpayOrder = async ({ guestId, couponCode, shippingAddress }) => {
	// Server fetches the cart and computes the total — never trust client prices.
	const response = await api.post('/razorpay/create-order', {
		guestId,
		couponCode,
		shippingAddress,
	})
	return response.data
}

export const fetchSavedAddresses = async () => {
	const response = await api.get('/addresses')
	return response.data
}

export const createSavedAddress = async (address) => {
	const response = await api.post('/addresses', address)
	return response.data
}

export const verifyRazorpayPayment = async ({
	razorpay_order_id,
	razorpay_payment_id,
	razorpay_signature,
	dbOrderId,
	guestId,
	couponCode,
}) => {
	const response = await api.post('/razorpay/verify-payment', {
		razorpay_order_id,
		razorpay_payment_id,
		razorpay_signature,
		dbOrderId,
		guestId,
		couponCode,
	})
	return response.data
}

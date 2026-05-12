import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

// Single axios instance — adds withCredentials to every request so the
// session cookie is sent, and auto-clears the user on 401 responses.
const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
})

api.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			// Dispatch is not available here; broadcast via a custom event so
			// Header.jsx (which has the Redux store) can react.
			window.dispatchEvent(new CustomEvent('auth:unauthorized'))
		}
		return Promise.reject(error)
	}
)

export const fetchFavorites = async (userId) => {
	try {
		const response = await api.get(`/users/getFavorites/${userId}`)
		return response.data
	} catch (error) {
		console.error('Error fetching favorites:', error)
		return []
	}
}

export const fetchCartItems = async ({ userId, guestId }) => {
	try {
		const response = await api.get('/users/getCart', {
			params: { user_id: userId, guest_id: guestId },
		})
		return response.data
	} catch (error) {
		console.error('Error fetching cart items:', error)
		return []
	}
}

export const addToFavoritesAPI = async (
	dbId,
	product_id,
	diamond_id,
	ring_style_id
) => {
	try {
		const response = await api.post('/users/addToFavorites', {
			user_id: dbId,
			product_id,
			diamond_id,
			ring_style_id,
		})
		return response.data
	} catch (error) {
		console.error('Error adding to favorites:', error)
		throw error
	}
}

export const removeFromFavoritesAPI = async (
	user_id,
	product_id,
	diamond_id,
	ring_style_id
) => {
	try {
		await api.delete('/users/deleteFavorites', {
			data: {
				user_id,
				product_id,
				diamond_id,
				ring_style_id,
			},
		})
	} catch (error) {
		console.error('Error removing from favorites:', error)
		throw error
	}
}

export const mergeFavoritesAPI = async (items) => {
	try {
		await api.post('/users/mergeFavorites', { items })
	} catch (error) {
		console.error('Error merging favorites:', error)
		throw error
	}
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
	try {
		const response = await api.post('/users/addToCart', {
			user_id: userId,
			guest_id: guestId,
			product_id: productId,
			diamond_id: diamondId,
			ring_style_id: ringStyleId,
			ring_size: ringSize ?? null,
			quantity,
		})
		return response.data
	} catch (error) {
		console.error('Error adding to cart:', error)
		throw error
	}
}

export const removeFromCartAPI = async ({ userId, guestId, cartId }) => {
	try {
		await api.delete('/users/deleteCart/', {
			params: {
				userId,
				guestId,
				cartId,
			},
		})
	} catch (error) {
		console.error('Error removing from cart:', error)
		throw error
	}
}

export const mergeCartAPI = async (guestId) => {
	try {
		await api.post('/users/mergeCart', { guestId })
	} catch (error) {
		console.error('Error merging cart:', error)
		throw error
	}
}

export const addProduct = async (data) => {
	try {
		const response = await api.post('/admin/addProduct', data)
		return response
	} catch (error) {
		console.log('Error adding the product', error)
		throw error
	}
}

export const getAllProducts = async (userId, subCategory) => {
	try {
		const response = await api.get('/admin/getAllProducts', {
			params: { userId, subCategory },
		})
		return response
	} catch (error) {
		console.log(
			'Error getting all products:',
			error.response ? error.response.data : error.message
		)
		throw error
	}
}

export const getAllProductsByCategory = async (category) => {
	try {
		const response = await api.get(`/admin/getAllProductsByCategory/${category}`)
		return response
	} catch (error) {
		console.log('Error getting all diamonds', error)
		throw error
	}
}

export const updateProduct = async (productId, data) => {
	try {
		const response = await api.put(`/admin/updateProduct/${productId}`, data)
		return response
	} catch (error) {
		console.log('Error updating product', error)
		throw error
	}
}

export const getAllUsers = async () => {
	try {
		const response = await api.get('/admin/getAllUsers')
		return response
	} catch (error) {
		console.log('Error getting all users', error)
		throw error
	}
}

export const getProduct = async (productId) => {
	try {
		const response = await api.get(`/getProduct/${productId}`)
		return response
	} catch (error) {
		console.log('Error getting product details', error)
		throw error
	}
}

export const getDiamond = async (productId) => {
	try {
		const response = await api.get(`/getDiamond/${productId}`)
		return response
	} catch (error) {
		console.log('Error getting diamond details', error)
		throw error
	}
}

export const getStyle = async (productId) => {
	try {
		const response = await api.get(`/getStyle/${productId}`)
		return response
	} catch (error) {
		console.log('Error getting style details', error)
		throw error
	}
}

export const getMasterList = async () => {
	try {
		const response = await api.get('/admin/getMasterList')
		return response.data
	} catch (error) {
		console.log('Error getting master list', error)
		throw error
	}
}

export const addMasterEntry = async (data) => {
	try {
		const response = await api.post('/admin/addMasterEntry', data)
		return response
	} catch (error) {
		console.log('Error adding master entry', error)
		throw error
	}
}

export const getAllDiamonds = async (dbId) => {
	try {
		const response = await api.get(`/admin/getAllDiamonds/${dbId}`)
		return response
	} catch (error) {
		console.log('Error getting all diamonds', error)
		throw error
	}
}

export const getAllStyles = async (dbId) => {
	try {
		const response = await api.get(`/admin/getAllStyles/${dbId}`)
		return response
	} catch (error) {
		console.log('Error getting all styles', error)
		throw error
	}
}

export const addDiamond = async (data) => {
	try {
		const response = await api.post('/admin/addDiamond', data)
		return response
	} catch (error) {
		console.log('Error adding the product', error)
		throw error
	}
}

export const updateDiamond = async (productId, data) => {
	try {
		const response = await api.put(`/admin/updateDiamond/${productId}`, data)
		return response
	} catch (error) {
		console.log('Error updating product', error)
		throw error
	}
}

export const addStyle = async (data) => {
	try {
		const response = await api.post('/admin/addStyle', data)
		return response
	} catch (error) {
		console.log('Error adding the product', error)
		throw error
	}
}

export const updateStyle = async (productId, data) => {
	try {
		const response = await api.put(`/admin/updateStyle/${productId}`, data)
		return response
	} catch (error) {
		console.log('Error updating product', error)
		throw error
	}
}

export const searchResult = async (text) => {
	try {
		const response = await api.get(`/search?search=${text}`)
		return response
	} catch (error) {
		console.log('Error fetching search results', error)
		throw error
	}
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
	try {
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
	} catch (error) {
		console.error('Error fetching reviews:', error)
		return null
	}
}

export const submitReviews = async (newReview) => {
	try {
		const response = await api.post('/submitReview', newReview)
		return response.data
	} catch (error) {
		console.error('Error submitting reviews:', error)
		return null
	}
}

export const addCouponEntry = async (data) => {
	try {
		const response = await api.post('/admin/addCouponEntry', data)
		return response
	} catch (error) {
		console.log('Error adding coupon entry', error)
		throw error
	}
}

export const getCouponList = async () => {
	try {
		const response = await api.get('/admin/getCouponList')
		return response.data
	} catch (error) {
		console.log('Error getting coupon list', error)
		throw error
	}
}

export const validateCouponAPI = async (couponCode) => {
	try {
		const response = await api.post('/validateCoupon', { couponCode })
		return response.data
	} catch (error) {
		throw error
	}
}

export const getCustomStyle = async ({
	head_style,
	head_metal,
	shank_style,
	shank_metal,
}) => {
	try {
		const response = await api.get('/getCustomStyle', {
			params: { head_style, head_metal, shank_style, shank_metal },
		})
		return response.data
	} catch (error) {
		console.error('Error fetching getCustomStyle:', error)
		return null
	}
}

export const getAllFilteredDiamonds = async (query) => {
	try {
		const response = await api.get('/getAllFilteredDiamonds', { params: query })
		return response
	} catch (error) {
		console.error('Error fetching getAllFilteredDiamonds:', error)
		return null
	}
}

export const fetchUserOrders = async ({ userId, guestId }) => {
	try {
		const response = await api.get('/orders', {
			params: { userId, guestId },
		})
		return response.data
	} catch (error) {
		console.error('Error fetching orders:', error)
		return []
	}
}

export const cancelUserOrder = async (orderId) => {
	try {
		const response = await api.post('/cancelOrder', { orderId })
		return response.data
	} catch (error) {
		console.error('Error cancelling orders:', error)
		return null
	}
}

export const createUserOrder = async ({
	userId,
	guestId,
	cartItems,
	totalPrice,
}) => {
	try {
		const response = await api.post('/createOrder', {
			userId,
			guestId,
			cartItems,
			totalPrice,
		})
		return response.data
	} catch (error) {
		console.error('Error creating order: ', error)
		return null
	}
}

export const signUpUser = async (userData) => {
	try {
		const response = await api.post('/users/signup', userData)
		return response.data
	} catch (error) {
		console.error('Error signing up user:', error)
		return null
	}
}

export const fetchCurrentUser = async () => {
	try {
		const response = await api.get('/me')
		return response.data
	} catch (error) {
		return null
	}
}

export const signInUser = async (userData) => {
	try {
		const response = await api.post('/users/signin', userData)
		return response.data
	} catch (error) {
		console.error('Error signing in user:', error)
		return null
	}
}

export const signoutUser = async () => {
	try {
		const response = await api.post('/users/signout', {})
		return response.data
	} catch (error) {
		console.error('Error signing out user:', error)
		return null
	}
}

export const createRazorpayOrder = async ({ guestId, couponCode, shippingAddress }) => {
	try {
		// Server fetches the cart and computes the total — never trust client prices.
		const response = await api.post('/razorpay/create-order', {
			guestId,
			couponCode,
			shippingAddress,
		})
		return response.data
	} catch (error) {
		console.error('Error creating Razorpay order:', error)
		throw error
	}
}

export const fetchSavedAddresses = async () => {
	try {
		const response = await api.get('/addresses')
		return response.data
	} catch (error) {
		return []
	}
}

export const createSavedAddress = async (address) => {
	try {
		const response = await api.post('/addresses', address)
		return response.data
	} catch (error) {
		console.error('Error creating address:', error)
		throw error
	}
}

export const verifyRazorpayPayment = async ({
	razorpay_order_id,
	razorpay_payment_id,
	razorpay_signature,
	dbOrderId,
	guestId,
	couponCode,
}) => {
	try {
		const response = await api.post('/razorpay/verify-payment', {
			razorpay_order_id,
			razorpay_payment_id,
			razorpay_signature,
			dbOrderId,
			guestId,
			couponCode,
		})
		return response.data
	} catch (error) {
		console.error('Error verifying Razorpay payment:', error)
		throw error
	}
}

import axios from 'axios'
const REACT_APP_API_URL = process.env.REACT_APP_API_URL

export const fetchFavorites = async (userId) => {
	try {
		const response = await axios.get(
			`${REACT_APP_API_URL}/users/getFavorites/${userId}`
		)
		return response.data
	} catch (error) {
		console.error('Error fetching favorites:', error)
		return []
	}
}

export const fetchCartItems = async ({ userId, guestId }) => {
	try {
		const response = await axios.get(`${REACT_APP_API_URL}/users/getCart`, {
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
		const response = await axios.post(
			`${REACT_APP_API_URL}/users/addToFavorites`,
			{
				user_id: dbId,
				product_id,
				diamond_id,
				ring_style_id,
			}
		)
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
		await axios.delete(`${REACT_APP_API_URL}/users/deleteFavorites`, {
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

export const addToCartAPI = async (
	userId,
	guestId,
	productId,
	diamondId,
	ringStyleId,
	quantity
) => {
	try {
		console.log(guestId)
		const response = await axios.post(`${REACT_APP_API_URL}/users/addToCart`, {
			user_id: userId,
			guest_id: guestId,
			product_id: productId,
			diamond_id: diamondId,
			ring_style_id: ringStyleId,
			quantity,
		})
		return response.data
	} catch (error) {
		console.error('Error adding to cart:', error)
		throw error
	}
}

export const removeFromCartAPI = async ({ userId, guestId, productId }) => {
	try {
		await axios.delete(`${REACT_APP_API_URL}/users/deleteCart/`, {
			params: {
				userId,
				guestId,
				productId,
			},
		})
	} catch (error) {
		console.error('Error removing from cart:', error)
		throw error
	}
}

export const addProduct = async (data) => {
	try {
		const response = await axios.post(
			`${REACT_APP_API_URL}/admin/addProduct`,
			data
		)
		return response
	} catch (error) {
		console.log('Error adding the product', error)
		throw error
	}
}

export const getAllProducts = async (userId, subCategory) => {
	try {
		const response = await axios.get(
			`${REACT_APP_API_URL}/admin/getAllProducts`,
			{
				params: { userId, subCategory },
			}
		)
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
		const response = await axios.get(
			`${REACT_APP_API_URL}/admin/getAllProductsByCategory/${category}`
		)
		return response
	} catch (error) {
		console.log('Error getting all diamonds', error)
		throw error
	}
}

export const updateProduct = async (productId, data) => {
	try {
		const response = await axios.put(
			`${REACT_APP_API_URL}/admin/updateProduct/${productId}`,
			data
		)
		return response
	} catch (error) {
		console.log('Error updating product', error)
		throw error
	}
}

export const getAllUsers = async () => {
	try {
		const response = await axios.get(`${REACT_APP_API_URL}/admin/getAllUsers`)
		return response
	} catch (error) {
		console.log('Error getting all users', error)
		throw error
	}
}

export const getProduct = async (productId) => {
	try {
		const response = await axios.get(
			`${REACT_APP_API_URL}/getProduct/${productId}`
		)
		return response
	} catch (error) {
		console.log('Error getting product details', error)
		throw error
	}
}

export const getDiamond = async (productId) => {
	try {
		const response = await axios.get(
			`${REACT_APP_API_URL}/getDiamond/${productId}`
		)
		return response
	} catch (error) {
		console.log('Error getting diamond details', error)
		throw error
	}
}

export const getStyle = async (productId) => {
	try {
		const response = await axios.get(
			`${REACT_APP_API_URL}/getStyle/${productId}`
		)
		return response
	} catch (error) {
		console.log('Error getting style details', error)
		throw error
	}
}

export const getMasterList = async () => {
	try {
		const response = await axios.get(`${REACT_APP_API_URL}/admin/getMasterList`)
		return response.data
	} catch (error) {
		console.log('Error getting master list', error)
		throw error
	}
}

export const addMasterEntry = async (data) => {
	try {
		const response = await axios.post(
			`${REACT_APP_API_URL}/admin/addMasterEntry`,
			data
		)
		return response
	} catch (error) {
		console.log('Error adding master entry', error)
		throw error
	}
}

export const getAllDiamonds = async (dbId) => {
	try {
		const response = await axios.get(
			`${REACT_APP_API_URL}/admin/getAllDiamonds/${dbId}`
		)
		return response
	} catch (error) {
		console.log('Error getting all diamonds', error)
		throw error
	}
}

export const getAllStyles = async (dbId) => {
	try {
		const response = await axios.get(
			`${REACT_APP_API_URL}/admin/getAllStyles/${dbId}`
		)
		return response
	} catch (error) {
		console.log('Error getting all styles', error)
		throw error
	}
}

export const addDiamond = async (data) => {
	try {
		const response = await axios.post(
			`${REACT_APP_API_URL}/admin/addDiamond`,
			data
		)
		return response
	} catch (error) {
		console.log('Error adding the product', error)
		throw error
	}
}

export const updateDiamond = async (productId, data) => {
	try {
		const response = await axios.put(
			`${REACT_APP_API_URL}/admin/updateDiamond/${productId}`,
			data
		)
		return response
	} catch (error) {
		console.log('Error updating product', error)
		throw error
	}
}

export const addStyle = async (data) => {
	try {
		const response = await axios.post(
			`${REACT_APP_API_URL}/admin/addStyle`,
			data
		)
		return response
	} catch (error) {
		console.log('Error adding the product', error)
		throw error
	}
}

export const updateStyle = async (productId, data) => {
	try {
		const response = await axios.put(
			`${REACT_APP_API_URL}/admin/updateStyle/${productId}`,
			data
		)
		return response
	} catch (error) {
		console.log('Error updating product', error)
		throw error
	}
}

export const searchResult = async (text) => {
	try {
		const response = await axios.get(
			`${REACT_APP_API_URL}/search?search=${text}`
		)
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
		const response = await axios.get(`${REACT_APP_API_URL}/reviews`, {
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
		const response = await axios.post(
			`${REACT_APP_API_URL}/submitReview`,
			newReview
		)
		return response.data
	} catch (error) {
		console.error('Error submitting reviews:', error)
		return null
	}
}

export const addCouponEntry = async (data) => {
	try {
		const response = await axios.post(
			`${REACT_APP_API_URL}/admin/addCouponEntry`,
			data
		)
		return response
	} catch (error) {
		console.log('Error adding coupon entry', error)
		throw error
	}
}

export const getCouponList = async () => {
	try {
		const response = await axios.get(`${REACT_APP_API_URL}/admin/getCouponList`)
		return response.data
	} catch (error) {
		console.log('Error getting coupon list', error)
		throw error
	}
}

export const validateCouponAPI = async (couponCode) => {
	try {
		const response = await axios.post(`${REACT_APP_API_URL}/validateCoupon`, {
			couponCode,
		})
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
		const response = await axios.get(`${REACT_APP_API_URL}/getCustomStyle`, {
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
		const response = await axios.get(
			`${REACT_APP_API_URL}/getAllFilteredDiamonds`,
			{
				params: query,
			}
		)
		return response
	} catch (error) {
		console.error('Error fetching getAllFilteredDiamonds:', error)
		return null
	}
}

export const fetchUserOrders = async ({ userId, guestId }) => {
	try {
		const response = await axios.get(`${REACT_APP_API_URL}/orders`, {
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
		const response = await axios.post(`${REACT_APP_API_URL}/cancelOrder`, {
			orderId,
		})
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
		const response = await axios.post(`${REACT_APP_API_URL}/createOrder`, {
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
		const response = await axios.post(
			`${REACT_APP_API_URL}/users/signup`,
			userData,
			{
				withCredentials: true,
			}
		)
		return response.data
	} catch (error) {
		console.error('Error signing up user:', error)
		return null
	}
}

export const fetchCurrentUser = async () => {
	try {
		const response = await axios.get(
			`${REACT_APP_API_URL}/me`,
			{ withCredentials: true } // 👈 send session cookie
		)
		return response.data
	} catch (error) {
		return null
	}
}

export const signInUser = async (userData) => {
	try {
		const response = await axios.post(
			`${REACT_APP_API_URL}/users/signin`,
			userData,
			{
				withCredentials: true,
			}
		)
		return response.data
	} catch (error) {
		console.error('Error signing in user:', error)
		return null
	}
}

export const signoutUser = async () => {
	try {
		const response = await axios.post(
			`${REACT_APP_API_URL}/users/signout`,
			{},
			{
				withCredentials: true,
			}
		)
		return response.data
	} catch (error) {
		console.error('Error signing out user:', error)
		return null
	}
}

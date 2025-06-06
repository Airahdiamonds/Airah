import { useEffect, useState } from 'react'
import { FaGem, FaRing } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import {
	clearCoupon,
	fetchUserCartItems,
	removeFromCart,
	setAppliedCoupon,
	validateCoupon,
} from '../redux/favoritesCartSlice'
import { convertPrice } from '../utils/helpers'
import {
	setCustomization,
	setShowDiamond,
	setShowRing,
} from '../redux/ringCustomizationSlice'
import { useNavigate } from 'react-router-dom'
import { getStyle } from '../utils/api'
import { createOrder } from '../redux/ordersSlice'

const Cart = () => {
	const [selectedSize, setSelectedSize] = useState('6')
	const [totalPrice, setTotalPrice] = useState(0)
	const [maintotalPrice, setMainTotalPrice] = useState(0)
	const [promo, setPromo] = useState('')
	const [disabled, setDisabled] = useState(false)

	const {
		currency,
		country,
		USD_rate,
		GBP_rate,
		AUD_rate,
		OMR_rate,
		AED_rate,
		EUR_rate,
		currentUser,
		guestUser,
	} = useSelector((state) => state.localization)
	const { cartItems, loading, error, discount, coupon } = useSelector(
		(state) => state.favoritesCart
	)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		let newTotal = cartItems.reduce((total, item) => {
			const itemTotal =
				(item.product_price ? Number(item.product_price) : 0) +
				(item.diamond_price ? Number(item.diamond_price) : 0) +
				(item.ring_style_price ? Number(item.ring_style_price) : 0)

			return total + itemTotal * item.quantity
		}, 0)
		setTotalPrice(newTotal)
		setMainTotalPrice(newTotal)
		if (cartItems.length > 0 && discount) {
			setTotalPrice((prevTotal) => Math.max(prevTotal - discount, 0))
			setPromo(coupon)
			setDisabled(true)
		}
	}, [cartItems, discount, coupon])

	const handleRemove = (productId) => {
		dispatch(
			removeFromCart({
				userId: currentUser || null,
				guestId: currentUser ? null : guestUser,
				productId: productId,
			})
		)
		dispatch(fetchUserCartItems(currentUser, guestUser))
	}

	const handleView = (item) => {
		if (item.product_id !== null) {
			navigate(`/products/${item.product_id}`)
		} else {
			getStyle(item.ring_style_id).then((res) => {
				dispatch(
					setCustomization({
						diamond: {
							product_id: item.diamond_id,
							diamond_price: item.diamond_price,
						},
						ring: {
							product_id: item.ring_style_id,
							ring_price: item.ring_style_price,
							headStyle: res.data[0].head_style,
							headMetal: res.data[0].head_metal,
							shankStyle: res.data[0].shank_style,
							shankMetal: res.data[0].shank_metal,
						},
						total_cost: +item.diamond_price + +item.ring_style_price,
					})
				)
				dispatch(setShowDiamond(true))
				dispatch(setShowRing(true))
				navigate('/customize', { state: res.data[0] })
			})
		}
	}

	const handlePromo = async () => {
		if (promo.trim() === '') return

		try {
			const result = await dispatch(validateCoupon(promo)).unwrap() // Wait for validation to complete
			dispatch(setAppliedCoupon({ coupon: promo, discount: result.discount }))
			setTotalPrice((prevTotal) => Math.max(prevTotal - result.discount, 0)) // Use the correct discount
			setDisabled(true) // Disable only if coupon is valid
		} catch (error) {
			console.error(error) // Handle error properly
		}
	}

	const handleCheckout = async () => {
		if (cartItems.length === 0) return

		try {
			await dispatch(
				createOrder({
					userId: currentUser || null,
					guestId: currentUser ? null : guestUser,
					cartItems,
					totalPrice,
				})
			).unwrap() // Unwrap ensures proper error handling
			cartItems.forEach((item) => {
				dispatch(
					removeFromCart({
						userId: currentUser || -1, // assuming -1 is your guest fallback in DB
						guestId: currentUser ? null : guestUser,
						productId: item.cart_id,
					})
				)
			})
			navigate('/orders')
		} catch (error) {
			console.error('Order creation failed:', error)
		}
	}

	// if (!isSignedIn) {
	// 	return (
	// 		<div className="h-80 flex flex-col items-center justify-center bg-gray-50">
	// 			<h2 className="text-2xl font-semibold text-gray-700 mb-4">
	// 				Please log in to view your cart
	// 			</h2>
	// 			<SignInButton mode="modal">
	// 				<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition border border-solid border-gray-300">
	// 					Log In
	// 				</button>
	// 			</SignInButton>
	// 		</div>
	// 	)
	// }

	return (
		<div className="p-8 grid grid-cols-[70%_30%] gap-2">
			<div className="bg-white rounded-lg overflow-hidden px-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-8">
					My Cart (
					{cartItems.length === 1
						? `${cartItems.length} Item`
						: `${cartItems.length} Items`}
					)
				</h1>

				{loading ? (
					<p>Loading Cart...</p>
				) : cartItems.length === 0 ? (
					<p className="text-gray-600 p-4">Your Cart is empty.</p>
				) : (
					<div className="grid grid-cols-1 gap-4">
						{cartItems?.map((item) =>
							item.product_id !== null ? (
								<div key={item.product_id} className="p-4 border-b">
									<div className="flex gap-4">
										<div className="w-1/3 relative group cursor-pointer">
											<div className="relative w-full h-50 group">
												<img
													src={item.product_image[0]}
													alt="Product 1"
													className="w-50 h-50 object-cover rounded-md mb-2 group-hover:grayscale-0 transition duration-300"
												/>
											</div>
										</div>
										<div className="w-2/3">
											<div className="grid grid-cols-1 gap-4">
												<div>
													<h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
														<FaRing className="text-grey" />
														{item.product_name}
													</h2>
													<p className="text-xl font-bold text-gray-500">
														{currency}
														{convertPrice(
															Number(item.product_price),
															country,
															USD_rate,
															GBP_rate,
															AUD_rate,
															OMR_rate,
															AED_rate,
															EUR_rate
														).toFixed(2)}
													</p>
													<div className="flex flex-wrap gap-2 mt-2">
														{[
															'4',
															'5',
															'6',
															'7',
															'8',
															'9',
															'10',
															'11',
															'12',
														].map((size) => (
															<button
																key={size}
																onClick={() => setSelectedSize(size)}
																className={` py-4 px-6 text-sm border rounded-md transition ${
																	selectedSize === size
																		? 'bg-black text-white border-black'
																		: 'bg-white text-black border-gray-400 hover:bg-gray-100'
																}`}
															>
																{size}
															</button>
														))}
													</div>
												</div>
											</div>
											<div className="flex justify-start mt-4">
												<button
													onClick={() => handleView(item)}
													className="w-1/3 mx-1 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
												>
													View
												</button>
												<button
													onClick={() => handleRemove(item.cart_id)}
													className="w-1/3 mx-1 py-2 bg-white text-black rounded-md border border-black hover:bg-black hover:text-white transition"
												>
													Remove from Cart
												</button>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div key={item.cart_id} className="p-4 border-b">
									<div className="flex gap-4">
										<div className="w-1/3 relative group cursor-pointer">
											<div className="relative w-full h-50 group">
												<img
													src={item?.ring_images[0]}
													alt="Product"
													className="w-50 h-50 object-cover rounded-md mb-2 group-hover:grayscale-0 transition duration-300"
												/>
											</div>
										</div>
										<div className="w-2/3">
											<div className="grid grid-cols-1 gap-4">
												<div>
													<h2 className="text-lg font-semibold text-gray-800 flex items-center  gap-2">
														<FaGem className="text-grey" />
														{item.diamond_name}
													</h2>
													<p className="text-xl font-bold text-gray-500">
														{currency}
														{convertPrice(
															Number(item.diamond_price),
															country,
															USD_rate,
															GBP_rate,
															AUD_rate,
															OMR_rate,
															AED_rate,
															EUR_rate
														).toFixed(2)}
													</p>
												</div>
												<div>
													<h2 className="text-lg font-semibold text-gray-800 flex items-center  gap-2">
														<FaRing className="text-grey" />
														{item.ring_style_name}
													</h2>
													<p className="text-xl font-bold text-gray-500">
														{currency}
														{convertPrice(
															Number(item.ring_style_price),
															country,
															USD_rate,
															GBP_rate,
															AUD_rate,
															OMR_rate,
															AED_rate,
															EUR_rate
														).toFixed(2)}
													</p>

													<div className="flex flex-wrap gap-2 mt-2">
														{[
															'4',
															'5',
															'6',
															'7',
															'8',
															'9',
															'10',
															'11',
															'12',
														].map((size) => (
															<button
																key={size}
																onClick={() => setSelectedSize(size)}
																className={` py-4 px-6 text-sm border rounded-md transition ${
																	selectedSize === size
																		? 'bg-black text-white border-black'
																		: 'bg-white text-black border-gray-400 hover:bg-gray-100'
																}`}
															>
																{size}
															</button>
														))}
													</div>
												</div>
											</div>
											<div className="flex justify-start mt-4">
												<button
													onClick={() => handleView(item)}
													className="w-1/3 mx-1 py-2 bg-black text-white rounded-md  hover:bg-gray-800 transition"
												>
													View
												</button>
												<button
													onClick={() => handleRemove(item.cart_id)}
													className="w-1/3 mx-1 py-2 bg-white text-black rounded-md border  border-black  hover:bg-black hover:text-white transition"
												>
													Remove from Cart
												</button>
											</div>
										</div>
									</div>
								</div>
							)
						)}
					</div>
				)}
			</div>

			<div className="bg-white shadow-md rounded-lg overflow-hidden border border-solid border-gray-300 px-4 py-4 w-full max-w-md max-h-fit md:sticky top-40">
				<h2 className="text-2xl font-semibold text-gray-900 mb-4">Summary</h2>

				{/* Subtotal */}
				<div className="flex justify-between items-center mb-3">
					<p className="text-lg font-medium text-gray-700">Subtotal</p>
					<p className="text-xl font-semibold text-gray-900">
						{currency}
						{convertPrice(
							Number(maintotalPrice),
							country,
							USD_rate,
							GBP_rate,
							AUD_rate,
							OMR_rate,
							AED_rate,
							EUR_rate
						).toFixed(2)}
					</p>
				</div>

				{/* Shipping */}
				<div className="flex justify-between items-center mb-3">
					<p className="text-lg font-medium text-gray-700">
						US & Int. Shipping
					</p>
					<p className="text-xl font-semibold text-gray-900">Free</p>
				</div>

				{/* Taxes */}
				<div className="flex justify-between items-center mb-3">
					<p className="text-lg font-medium text-gray-700">
						Taxes/Duties Estimate
					</p>
					<p className="text-xl font-semibold text-gray-900">{currency}TBD</p>
				</div>
				{discount !== 0 && (
					<div className="flex justify-between items-center mb-3">
						<p className="text-lg font-medium text-gray-700">Discount</p>
						<p className="text-xl font-semibold text-gray-900">
							-{currency}
							{discount}
						</p>
					</div>
				)}
				{/* Promo Code Input */}
				<div className="mb-3">
					<p className="text-lg font-medium text-gray-700 mb-1">Promo Code</p>
					<div className="flex justify-evenly">
						<div className="relative">
							<input
								type="text"
								value={promo}
								onChange={(e) => setPromo(e.target.value)}
								disabled={disabled}
								placeholder="Enter code"
								className="w-full px-3 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800 pr-10"
							/>
							{promo && (
								<button
									onClick={() => {
										setPromo('')
										setDisabled(false)
										dispatch(clearCoupon())
									}}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
								>
									✕
								</button>
							)}
						</div>
						<button
							onClick={handlePromo}
							disabled={disabled}
							className="px-4 bg-black text-white font-semibold rounded-md transition hover:bg-gray-800 active:scale-95"
						>
							{disabled ? 'Applied !!!' : 'Apply'}
						</button>
					</div>
					{error && <p className="text-red-500 mt-2">{error}</p>}
				</div>

				{/* Total */}
				<div className="flex justify-between items-center border-t pt-3 mb-3">
					<p className="text-lg font-semibold text-gray-900">Total</p>
					<p className="text-xl font-semibold text-gray-900">
						{currency}
						{Number(
							convertPrice(
								Number(totalPrice),
								country,
								USD_rate,
								GBP_rate,
								AUD_rate,
								OMR_rate,
								AED_rate,
								EUR_rate
							)
						).toFixed(2)}
					</p>
				</div>

				{/* Interest-Free Payments */}
				<div className="flex justify-between items-center mb-3">
					<p className="text-lg font-medium text-gray-700">
						3 Interest-Free Payments of
					</p>
					<p className="text-xl font-semibold text-gray-900">
						{currency}
						{Number(
							convertPrice(
								Number(totalPrice) / 3,
								country,
								USD_rate,
								GBP_rate,
								AUD_rate,
								OMR_rate,
								AED_rate,
								EUR_rate
							)
						).toFixed(2)}
					</p>
				</div>

				{/* Shipping Notice */}
				<div className="text-gray-600 text-sm mb-4">
					<p className="font-medium">
						Free Overnight Shipping, Hassle-Free Returns
					</p>
					<p>
						Ships by: For an exact shipping date, please select a ring size
						first.
					</p>
				</div>

				{/* Checkout Button (Black & White with Effects) */}
				<button
					onClick={handleCheckout}
					className="w-full py-3 bg-black text-white font-semibold rounded-md transition hover:bg-gray-800 active:scale-95"
				>
					Checkout
				</button>

				{/* Accepted Payment Methods */}
				<div className="mt-6">
					<p className="text-lg font-semibold text-gray-900 mb-2 ">We Accept</p>
					<div className="flex justify-center space-x-2  ">
						<img
							src="https://ion.r2net.com/images/ShoppingCart/pay_by_visa.svg"
							alt="Visa"
							className="h-12 transition"
						/>
						<img
							src="https://ion.r2net.com/images/ShoppingCart/pay_by_master_card.svg"
							alt="MasterCard"
							className="h-12  transition"
						/>
						<img
							src="https://ion.r2net.com/images/ShoppingCart/pay_by_american_express.svg"
							alt="American Express"
							className="h-12  transition"
						/>
						<img
							src="https://ion.r2net.com/images/ShoppingCart/pay_by_discover.svg"
							alt="Discover"
							className="h-12  transition"
						/>
						<img
							src="https://ion.r2net.com/images/ShoppingCart/pay_by_paypal.svg"
							alt="PayPal"
							className="h-12  transition"
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Cart

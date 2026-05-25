import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	ArrowRight,
	CreditCard,
	Eye,
	Gem,
	LockKeyhole,
	PackageCheck,
	ShoppingBag,
	Sparkles,
	Tag,
	Trash2,
	Truck,
} from 'lucide-react'
import {
	clearCoupon,
	removeFromCart,
	setAppliedCoupon,
	validateCoupon,
} from '../redux/favoritesCartSlice'
import {
	setCustomization,
	setShowDiamond,
	setShowRing,
} from '../redux/ringCustomizationSlice'
import { useNavigate } from 'react-router-dom'
import { createRazorpayOrder, getStyle, verifyRazorpayPayment } from '../utils/api'
import AddressForm, { isAddressComplete } from '../components/AddressForm'
import PriceDisplay from '../components/PriceDisplay'

const paymentMethods = [
	['Visa', 'https://ion.r2net.com/images/ShoppingCart/pay_by_visa.svg'],
	['MasterCard', 'https://ion.r2net.com/images/ShoppingCart/pay_by_master_card.svg'],
	['American Express', 'https://ion.r2net.com/images/ShoppingCart/pay_by_american_express.svg'],
	['Discover', 'https://ion.r2net.com/images/ShoppingCart/pay_by_discover.svg'],
	['PayPal', 'https://ion.r2net.com/images/ShoppingCart/pay_by_paypal.svg'],
]

const getItemUnitPrice = (item) =>
	(Number(item.product_price) || 0) +
	(Number(item.diamond_price) || 0) +
	(Number(item.ring_style_price) || 0)

const getItemImage = (item) =>
	item.product_id !== null
		? item.product_image?.[0]
		: item.ring_images?.[0] || item.diamond_image?.[0]

const getItemTitle = (item) =>
	item.product_id !== null
		? item.product_name
		: `${item.diamond_name || 'Selected diamond'} + ${item.ring_style_name || 'Selected setting'}`

const Cart = () => {
	const [totalPrice, setTotalPrice] = useState(0)
	const [maintotalPrice, setMainTotalPrice] = useState(0)
	const [promo, setPromo] = useState('')
	const [disabled, setDisabled] = useState(false)
	const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
	const [isCheckingOut, setIsCheckingOut] = useState(false)
	const [shippingAddress, setShippingAddress] = useState(null)

	const { currency, currentUser, guestUser } = useSelector(
		(state) => state.localization
	)
	const { cartItems, loading, error, discount, coupon } = useSelector(
		(state) => state.favoritesCart
	)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	useEffect(() => {
		const newTotal = cartItems.reduce((total, item) => {
			return total + getItemUnitPrice(item) * item.quantity
		}, 0)

		setTotalPrice(newTotal)
		setMainTotalPrice(newTotal)
		if (cartItems.length > 0 && discount) {
			setTotalPrice((prevTotal) => Math.max(prevTotal - discount, 0))
			setPromo(coupon)
			setDisabled(true)
		}
	}, [cartItems, discount, coupon])

	const handleRemove = (cartId) => {
		dispatch(
			removeFromCart({
				userId: currentUser || null,
				guestId: currentUser ? null : guestUser,
				productId: cartId,
			})
		)
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
		if (promo.trim() === '' || disabled || isApplyingCoupon) return

		setIsApplyingCoupon(true)
		try {
			const result = await dispatch(validateCoupon(promo)).unwrap()
			const discountAmount = Math.round((maintotalPrice * result.discount) / 100)
			dispatch(setAppliedCoupon({ coupon: promo, discount: discountAmount }))
			setTotalPrice((prevTotal) => Math.max(prevTotal - discountAmount, 0))
			setDisabled(true)
		} catch (error) {
			console.error(error)
		} finally {
			setIsApplyingCoupon(false)
		}
	}

	const handleCheckout = async () => {
		if (cartItems.length === 0 || isCheckingOut) return
		if (!isAddressComplete(shippingAddress)) {
			alert('Please fill in your shipping address before checkout.')
			return
		}

		setIsCheckingOut(true)
		try {
			const { razorpayOrder, dbOrderId } = await createRazorpayOrder({
				guestId: currentUser ? null : guestUser,
				couponCode: coupon || null,
				shippingAddress,
			})

			const options = {
				key: import.meta.env.VITE_RAZORPAY_KEY_ID,
				amount: razorpayOrder.amount,
				currency: razorpayOrder.currency,
				name: 'Airah Diamonds',
				description: 'Order Payment',
				order_id: razorpayOrder.id,
				handler: async (response) => {
					try {
						const result = await verifyRazorpayPayment({
							razorpay_order_id: response.razorpay_order_id,
							razorpay_payment_id: response.razorpay_payment_id,
							razorpay_signature: response.razorpay_signature,
							dbOrderId,
							guestId: currentUser ? null : guestUser,
							couponCode: coupon || null,
						})

						if (result.success) {
							cartItems.forEach((item) => {
								dispatch(
									removeFromCart({
										userId: currentUser || null,
										guestId: currentUser ? null : guestUser,
										productId: item.cart_id,
									})
								)
							})
							dispatch(clearCoupon())
							navigate('/orders')
						} else {
							console.error('Payment verification failed')
							setIsCheckingOut(false)
						}
					} catch (err) {
						console.error('Payment verification error:', err)
						setIsCheckingOut(false)
					}
				},
				modal: {
					ondismiss: () => setIsCheckingOut(false),
				},
				theme: { color: '#211916' },
			}

			const rzp = new window.Razorpay(options)
			rzp.open()
		} catch (error) {
			console.error('Checkout failed:', error)
			setIsCheckingOut(false)
		}
	}

	return (
		<div className="min-h-screen bg-[#f8f6f3] text-[#211916]">
			<section className="border-b border-[#e7ded6] bg-[#fbfaf8]">
				<div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 md:px-8 lg:px-10">
					<p className="text-[11px] uppercase tracking-[0.32em] text-[#9a8779]">
						Shopping Bag
					</p>
					<div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
						<div>
							<h1 className="text-4xl font-light leading-tight text-[#211916] md:text-5xl">
								Your selected pieces
							</h1>
							<p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f625b] md:text-base">
								Review sizing, delivery details, and payment before your order is
								prepared for final inspection.
							</p>
						</div>
						<div className="grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.18em] text-[#7e7068] sm:min-w-[420px]">
							<TrustStat value={cartItems.length} label={cartItems.length === 1 ? 'Item' : 'Items'} />
							<TrustStat value="Free" label="Shipping" />
							<TrustStat value="Secure" label="Checkout" />
						</div>
					</div>
				</div>
			</section>

			<div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 py-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:px-10">
				<main className="min-w-0">
					<div className="border border-[#e7ded6] bg-[#fbfaf8]/80">
						<div className="flex items-center justify-between border-b border-[#e7ded6] px-5 py-4 md:px-6">
							<div>
								<p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8779]">
									Cart Details
								</p>
								<p className="mt-1 text-sm text-[#7e7068]">
									{cartItems.length === 1
										? '1 item in your bag'
										: `${cartItems.length} items in your bag`}
								</p>
							</div>
							<ShoppingBag className="h-5 w-5 text-[#a16207]" strokeWidth={1.4} />
						</div>

						{loading ? (
							<div className="space-y-4 p-5 md:p-6">
								{Array.from({ length: 2 }).map((_, index) => (
									<div key={index} className="animate-pulse border border-[#e7ded6] bg-white p-4">
										<div className="flex gap-4">
											<div className="h-36 w-32 bg-[#ebe5de]" />
											<div className="flex-1 space-y-3 py-2">
												<div className="h-4 w-2/3 bg-[#e2d8cf]" />
												<div className="h-3 w-1/3 bg-[#e2d8cf]" />
												<div className="h-3 w-1/2 bg-[#e2d8cf]" />
											</div>
										</div>
									</div>
								))}
							</div>
						) : cartItems.length === 0 ? (
							<div className="px-5 py-16 text-center md:px-6">
								<div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#d9cfc6] bg-white text-[#a16207]">
									<ShoppingBag className="h-6 w-6" strokeWidth={1.4} />
								</div>
								<h2 className="mt-6 text-2xl font-light text-[#211916]">
									Your cart is empty
								</h2>
								<p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#7e7068]">
									Select a finished piece or begin a custom diamond ring to continue.
								</p>
								<button
									type="button"
									onClick={() => navigate('/customize')}
									className="mt-7 inline-flex h-12 items-center gap-3 bg-[#211916] px-7 text-[11px] uppercase tracking-[0.22em] text-[#fbfaf8] transition hover:bg-[#3b302b]"
								>
									Begin Customizing
									<ArrowRight className="h-4 w-4" strokeWidth={1.5} />
								</button>
							</div>
						) : (
							<div className="divide-y divide-[#e7ded6]">
								{cartItems.map((item) => (
									<CartItem
										key={item.cart_id}
										item={item}
										onView={handleView}
										onRemove={handleRemove}
									/>
								))}
							</div>
						)}
					</div>
				</main>

				<aside className="lg:sticky lg:top-32 lg:self-start">
					<div className="border border-[#e7ded6] bg-[#fbfaf8]/95 p-5 shadow-[0_24px_70px_rgba(43,33,29,0.08)] md:p-6">
						<div className="flex items-start justify-between gap-4 border-b border-[#e7ded6] pb-5">
							<div>
								<p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8779]">
									Order Summary
								</p>
								<h2 className="mt-2 text-2xl font-light text-[#211916]">
									Checkout
								</h2>
							</div>
							<LockKeyhole className="mt-1 h-5 w-5 text-[#a16207]" strokeWidth={1.4} />
						</div>

						<div className="space-y-3 border-b border-[#e7ded6] py-5">
							<SummaryRow label="Subtotal" value={<PriceDisplay value={maintotalPrice} />} />
							<SummaryRow label="US and International Shipping" value="Free" />
							<SummaryRow label="Taxes and Duties" value={`${currency}TBD`} />
							{discount !== 0 && (
								<SummaryRow label="Discount" value={<>-<PriceDisplay value={discount} /></>} />
							)}
						</div>

						<div className="border-b border-[#e7ded6] py-5">
							<label className="block">
								<span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#8a7b72]">
									<Tag className="h-4 w-4" strokeWidth={1.4} />
									Promo Code
								</span>
								<div className="mt-3 flex gap-2">
									<div className="relative flex-1">
										<input
											type="text"
											value={promo}
											onChange={(e) => setPromo(e.target.value)}
											disabled={disabled}
											placeholder="Enter code"
											className="h-11 w-full border border-[#d9cfc6] bg-white/70 px-3 pr-9 text-sm uppercase tracking-[0.08em] text-[#211916] outline-none transition placeholder:text-[#a18f83] focus:border-[#211916] disabled:bg-[#eee9e2]"
										/>
										{promo && (
											<button
												type="button"
												onClick={() => {
													setPromo('')
													setDisabled(false)
													dispatch(clearCoupon())
												}}
												className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7b72] transition hover:text-[#211916]"
												aria-label="Clear promo code"
											>
												×
											</button>
										)}
									</div>
									<button
										type="button"
										onClick={handlePromo}
										disabled={disabled || isApplyingCoupon}
										className="h-11 border border-[#211916] bg-[#211916] px-4 text-[11px] uppercase tracking-[0.18em] text-[#fbfaf8] transition hover:bg-[#3b302b] disabled:cursor-not-allowed disabled:opacity-60"
									>
										{disabled ? 'Applied' : isApplyingCoupon ? 'Applying' : 'Apply'}
									</button>
								</div>
							</label>
							{error && <p className="mt-2 text-sm text-[#9f3f35]">{error}</p>}
						</div>

						<div className="border-b border-[#e7ded6] py-5">
							<SummaryRow
								label="Total"
								value={<PriceDisplay value={totalPrice} />}
								strong
							/>
							<SummaryRow
								label="3 Interest-Free Payments"
								value={<PriceDisplay value={Number(totalPrice) / 3} />}
							/>
							<div className="mt-4 flex gap-3 border border-[#e7ded6] bg-white/60 p-3 text-sm leading-6 text-[#6f625b]">
								<Truck className="mt-0.5 h-4 w-4 shrink-0 text-[#a16207]" strokeWidth={1.4} />
								<p>Free insured shipping. Exact dispatch date is confirmed after final size review.</p>
							</div>
						</div>

						<div className="border-b border-[#e7ded6] py-5">
							<AddressForm value={shippingAddress} onChange={setShippingAddress} />
						</div>

						<button
							type="button"
							onClick={handleCheckout}
							disabled={
								isCheckingOut ||
								cartItems.length === 0 ||
								!isAddressComplete(shippingAddress)
							}
							className="mt-5 flex h-14 w-full items-center justify-center gap-3 bg-[#211916] text-[11px] uppercase tracking-[0.24em] text-[#fbfaf8] transition hover:bg-[#3b302b] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isCheckingOut ? 'Processing' : 'Checkout'}
							<ArrowRight className="h-4 w-4" strokeWidth={1.5} />
						</button>

						<div className="mt-6">
							<div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#8a7b72]">
								<CreditCard className="h-4 w-4" strokeWidth={1.4} />
								We Accept
							</div>
							<div className="mt-3 grid grid-cols-5 gap-2">
								{paymentMethods.map(([label, src]) => (
									<div
										key={label}
										className="flex h-10 items-center justify-center border border-[#e7ded6] bg-white px-2"
									>
										<img src={src} alt={label} className="max-h-5 max-w-full" />
									</div>
								))}
							</div>
						</div>
					</div>
				</aside>
			</div>
		</div>
	)
}

function TrustStat({ value, label }) {
	return (
		<div className="border-l border-[#d9cfc6] px-3">
			<p className="text-base font-medium text-[#211916]">{value}</p>
			<p>{label}</p>
		</div>
	)
}

function SummaryRow({ label, value, strong = false }) {
	return (
		<div className="flex items-baseline justify-between gap-4">
			<p
				className={`text-sm ${
					strong ? 'text-[#211916]' : 'text-[#6f625b]'
				}`}
			>
				{label}
			</p>
			<p
				className={`text-right tabular-nums ${
					strong ? 'text-2xl font-light text-[#211916]' : 'text-sm text-[#211916]'
				}`}
			>
				{value}
			</p>
		</div>
	)
}

function CartItem({ item, onView, onRemove }) {
	const isProduct = item.product_id !== null
	const unitPrice = getItemUnitPrice(item)
	const lineTotal = unitPrice * item.quantity
	const image = getItemImage(item)

	return (
		<article className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[180px_minmax(0,1fr)] md:p-6">
			<button
				type="button"
				onClick={() => onView(item)}
				className="group aspect-[4/3] overflow-hidden bg-[#eee9e2] text-left md:aspect-square"
			>
				{image ? (
					<img
						src={image}
						alt={getItemTitle(item)}
						className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-[#a16207]">
						<Gem className="h-8 w-8" strokeWidth={1.2} />
					</div>
				)}
			</button>

			<div className="min-w-0">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
					<div>
						<div className="mb-3 inline-flex items-center gap-2 border border-[#e7ded6] bg-white/70 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#8a7b72]">
							{isProduct ? (
								<PackageCheck className="h-3.5 w-3.5" strokeWidth={1.4} />
							) : (
								<Sparkles className="h-3.5 w-3.5" strokeWidth={1.4} />
							)}
							{isProduct ? 'Finished Piece' : 'Custom Ring'}
						</div>
						<h2 className="text-2xl font-light leading-snug text-[#211916]">
							{getItemTitle(item)}
						</h2>
						{!isProduct && (
							<div className="mt-3 space-y-1 text-sm leading-6 text-[#6f625b]">
								<p>Diamond: {item.diamond_name}</p>
								<p>Setting: {item.ring_style_name}</p>
							</div>
						)}
					</div>

					<div className="text-left lg:text-right">
						<p className="text-[11px] uppercase tracking-[0.2em] text-[#9a8779]">
							Line Total
						</p>
						<p className="mt-1 text-2xl font-light tabular-nums text-[#211916]">
							<PriceDisplay value={lineTotal} />
						</p>
					</div>
				</div>

				<div className="mt-5 grid grid-cols-2 gap-3 border-y border-[#e7ded6] py-4 text-sm text-[#6f625b] md:grid-cols-4">
					<CartMeta label="Size" value={item.ring_size || 'Review'} />
					<CartMeta label="Quantity" value={item.quantity} />
					<CartMeta label="Unit Price" value={<PriceDisplay value={unitPrice} />} />
					<CartMeta label="Delivery" value="Insured" />
				</div>

				{!isProduct && (
					<div className="mt-4 grid grid-cols-1 gap-3 text-sm text-[#6f625b] sm:grid-cols-2">
						<div className="border border-[#e7ded6] bg-white/60 p-3">
							<p className="text-[10px] uppercase tracking-[0.2em] text-[#9a8779]">
								Diamond
							</p>
							<p className="mt-1 text-[#211916]"><PriceDisplay value={item.diamond_price} /></p>
						</div>
						<div className="border border-[#e7ded6] bg-white/60 p-3">
							<p className="text-[10px] uppercase tracking-[0.2em] text-[#9a8779]">
								Setting
							</p>
							<p className="mt-1 text-[#211916]"><PriceDisplay value={item.ring_style_price} /></p>
						</div>
					</div>
				)}

				<div className="mt-5 flex flex-wrap gap-3">
					<button
						type="button"
						onClick={() => onView(item)}
						className="inline-flex h-11 items-center gap-2 border border-[#211916] bg-[#211916] px-5 text-[11px] uppercase tracking-[0.18em] text-[#fbfaf8] transition hover:bg-[#3b302b]"
					>
						<Eye className="h-4 w-4" strokeWidth={1.5} />
						View
					</button>
					<button
						type="button"
						onClick={() => onRemove(item.cart_id)}
						className="inline-flex h-11 items-center gap-2 border border-[#d9cfc6] bg-white/60 px-5 text-[11px] uppercase tracking-[0.18em] text-[#6f625b] transition hover:border-[#211916] hover:text-[#211916]"
					>
						<Trash2 className="h-4 w-4" strokeWidth={1.5} />
						Remove
					</button>
				</div>
			</div>
		</article>
	)
}

function CartMeta({ label, value }) {
	return (
		<div>
			<p className="text-[10px] uppercase tracking-[0.2em] text-[#9a8779]">
				{label}
			</p>
			<p className="mt-1 text-[#211916]">{value}</p>
		</div>
	)
}

export default Cart
import { useDispatch, useSelector } from 'react-redux'
import {
	resetCustomization,
	updateTotalCost,
} from '../../redux/ringCustomizationSlice'
import { useEffect, useMemo, useState } from 'react'
import { addToCart } from '../../redux/favoritesCartSlice'
import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Truck } from 'lucide-react'
import PriceDisplay from '../PriceDisplay'

const ringSizes = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']

const StepThree = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { productDetails } = useSelector((state) => state.ringCustomization)
	const { currentUser, guestUser } = useSelector((state) => state.localization)
	const [selectedSize, setSelectedSize] = useState(ringSizes[0])
	const product = productDetails[0]
	const diamondPrice = Number(product.diamond?.diamond_price ?? 0)
	const ringPrice = Number(product.ring?.ring_price ?? 0)
	const computedTotal = diamondPrice + ringPrice
	const reviewImages = useMemo(
		() => (Array.isArray(product.image_URL) ? product.image_URL.flat().filter(Boolean) : []),
		[product.image_URL]
	)

	useEffect(() => {
		dispatch(
			updateTotalCost({
				total_cost: computedTotal,
			})
		)
	}, [computedTotal, dispatch])

	const handleClick = async () => {
		await dispatch(
			addToCart({
				userId: currentUser,
				guestId: currentUser ? null : guestUser,
				productId: null,
				diamondId: product.diamond?.product_id,
				ringStyleId: product.ring?.product_id,
				ringSize: selectedSize,
				quantity: 1,
			})
		)
		await dispatch(resetCustomization())
		navigate('/cart')
	}

	const canAddToCart = product.diamond?.product_id && product.ring?.product_id

	return (
		<div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(380px,0.6fr)]">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				{reviewImages.map((image, imageIndex) => (
						<div
							key={`${image}-${imageIndex}`}
							className="aspect-square overflow-hidden rounded-[6px] border border-[#e4ded7] bg-white"
						>
							<img
								src={image}
								alt="Completed ring"
								className="h-full w-full object-cover"
							/>
						</div>
				))}
			</div>

			<aside className="self-start rounded-[6px] border border-[#e4ded7] bg-white p-6 shadow-[0_24px_55px_rgba(33,25,22,0.08)] lg:sticky lg:top-32">
				<p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8779]">
					Final Review
				</p>
				<h2 className="mt-3 text-3xl font-light leading-tight tracking-wide text-[#211916]">
					Engagement ring
				</h2>

				<div className="mt-6 space-y-3 border-y border-[#eee7df] py-5">
					<div className="flex justify-between text-sm">
						<span className="text-[#8a7b72]">Diamond</span>
						<span className="text-[#211916]"><PriceDisplay value={diamondPrice} /></span>
					</div>
					<div className="flex justify-between text-sm">
						<span className="text-[#8a7b72]">Setting</span>
						<span className="text-[#211916]"><PriceDisplay value={ringPrice} /></span>
					</div>
					<div className="flex justify-between pt-3 text-lg font-light text-[#211916]">
						<span>Total</span>
						<PriceDisplay value={computedTotal} />
					</div>
				</div>

				<div className="mt-5 rounded-[4px] bg-[#f8f7f4] p-4">
					<p className="text-[11px] uppercase tracking-[0.18em] text-[#9a8779]">
						Ring size
					</p>
					<div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-7">
						{ringSizes.map((size) => (
							<button
								type="button"
								key={size}
								onClick={() => setSelectedSize(size)}
								className={`h-10 rounded-[4px] border text-sm transition ${
									selectedSize === size
										? 'border-[#211916] bg-[#211916] text-white'
										: 'border-[#e4ded7] bg-white text-[#6f625b] hover:border-[#bda28f] hover:text-[#211916]'
								}`}
							>
								{size}
							</button>
						))}
					</div>
				</div>

				<div className="mt-5 rounded-[4px] border border-[#e4ded7] p-4 text-sm text-[#5f5550]">
					<p className="text-[#211916]">Flexible payment options</p>
					<p className="mt-1">
						3 interest-free payments of{' '}
						<PriceDisplay value={computedTotal / 3} />
					</p>
				</div>

				<button
					type="button"
					onClick={handleClick}
					disabled={!canAddToCart}
					className="mt-5 h-14 w-full rounded-[4px] bg-[#211916] px-6 text-sm uppercase tracking-[0.18em] text-white transition hover:bg-[#3a2d27] disabled:cursor-not-allowed disabled:bg-[#d4ccc4]"
				>
					Add to cart
				</button>

				<div className="mt-5 space-y-3 border-t border-[#eee7df] pt-5 text-sm text-[#5f5550]">
					<div className="flex items-center gap-3">
						<ShieldCheck size={18} className="text-[#9a8779]" />
						<span>Lifetime warranty</span>
					</div>
					<div className="flex items-center gap-3">
						<Truck size={18} className="text-[#9a8779]" />
						<span>Complimentary insured shipping</span>
					</div>
				</div>
			</aside>
		</div>
	)
}

export default StepThree
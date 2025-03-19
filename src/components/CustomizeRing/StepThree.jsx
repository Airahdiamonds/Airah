import { useDispatch, useSelector } from 'react-redux'
import {
	resetCustomization,
	updateTotalCost,
} from '../../redux/ringCustomizationSlice'
import { useEffect, useState } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react'
import { addToCart, fetchUserCartItems } from '../../redux/favoritesCartSlice'
import { useNavigate } from 'react-router-dom'

const StepThree = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { productDetails } = useSelector((state) => state.ringCustomization)
	const { user } = useUser()
	const dbId = user?.publicMetadata?.dbId

	useEffect(() => {
		dispatch(
			updateTotalCost({
				total_cost:
					+productDetails[0].ring?.ring_price +
					+productDetails[0].diamond?.diamond_price,
			})
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	const ringSizes = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
	const [selectedSize, setSelectedSize] = useState(ringSizes[0])

	const handleClick = async () => {
		await dispatch(
			addToCart({
				userId: dbId,
				productId: null,
				diamondId: productDetails[0].diamond?.product_id,
				ringStyleId: productDetails[0].ring?.product_id,
				quantity: 1,
			})
		)
		await dispatch(resetCustomization())
		await dispatch(fetchUserCartItems(dbId))
		navigate('/cart')
	}

	return (
		<div className="flex flex-col md:flex-row items-start gap-8">
			{/* Left Side - Image Grid */}
			<div className="w-full md:w-3/5 grid grid-cols-2 gap-4">
				{productDetails[0].image_URL[0].map((image) => (
					<img
						src={image}
						alt="Ring 1"
						className="w-full h-auto rounded-lg shadow-md"
					/>
				))}
				{productDetails[0].image_URL[1].map((image) => (
					<img
						src={image}
						alt="Ring 1"
						className="w-full h-auto rounded-lg shadow-md"
					/>
				))}
			</div>
			{/* Right Side - Content */}
			<div className="w-full md:w-2/5 border border-[#bf927f] p-8 space-y-4 flex flex-col max-h-fit md:sticky top-40 self-start">
				<h2 className="text-4xl special">Engagement ring</h2>
				<p className="text-sm text-gray-500">(Completed)</p>
				<p className="text-lg">1.16 Total Carat Weight</p>
				<div className="text-2xl font-light text-green-900">
					$
					{productDetails[0].ring?.ring_price +
						productDetails[0].diamond?.diamond_price}
					<p className="text-sm text-gray-500">(Sub Total)</p>
				</div>

				<div className="pt-4 space-y-2">
					<div className="bg-gray-100 p-4">
						<div className="text-base text-gray-700">
							Flexible Payment Options:
						</div>
						<div className="text-base text-gray-700">
							3 Interest-Free Payments of $600
						</div>
						<div className="text-sm text-blue-500 cursor-pointer">
							Learn More
						</div>
					</div>

					<div className="bg-gray-100 p-4">
						<div className="text-base text-gray-700">Ring Size:</div>
						<div className="flex flex-wrap gap-2">
							{ringSizes.map((size, index) => (
								<button
									key={index}
									onClick={() => setSelectedSize(size)}
									className={`px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md ${
										selectedSize === size ? 'bg-gray-300' : ''
									}`}
								>
									{size}
								</button>
							))}
						</div>
					</div>

					<div>
						<SignedIn>
							<button
								onClick={handleClick}
								className="px-6 py-2 text-lg w-full h-16 bg-[#c9a992] text-white rounded-sm shadow-md hover:bg-[#bf927f] active:bg-[#a8826c]"
							>
								Add To Cart
							</button>
						</SignedIn>
						<SignedOut>
							<SignInButton>
								<button className="px-6 py-2 text-lg w-full h-16 bg-[#c9a992] text-white rounded-sm shadow-md hover:bg-[#bf927f] active:bg-[#a8826c]">
									Add To Cart
								</button>
							</SignInButton>
						</SignedOut>
					</div>
				</div>

				<div className="text-sm text-gray-600">
					<p>
						<strong>Ships by:</strong> Friday, February 28
					</p>
				</div>

				<div className="text-sm text-gray-900 space-y-2">
					<div className="flex items-center space-x-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="20"
							height="20"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 2l7 4v6c0 5-4 9-7 10-3-1-7-5-7-10V6l7-4z" />
							<path d="M9 12l2 2 4-4" />
						</svg>
						<span>Risk-Free Retail</span>
					</div>

					<div className="flex items-center space-x-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="30"
							height="20"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M3 16v-8h13v8" />
							<path d="M16 16h2.5l3.5-3.5v-4.5h-6" />
							<circle cx="6.5" cy="16.5" r="2.5" />
							<circle cx="16.5" cy="16.5" r="2.5" />
						</svg>
						<span className="underline">
							Free Overnight Shipping, Hassle-Free Returns
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default StepThree

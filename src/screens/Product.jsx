import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getProduct } from '../utils/api'
import { convertPrice } from '../utils/helpers'
import { useNavigate, useParams } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react'
import { addToCart, fetchUserCartItems } from '../redux/favoritesCartSlice'
import ReviewsList from '../components/ReviewsList'

function Product() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { id } = useParams()
	const { user } = useUser()
	const dbId = user?.publicMetadata?.dbId
	const {
		currency,
		country,
		USD_rate,
		GBP_rate,
		AUD_rate,
		OMR_rate,
		AED_rate,
		EUR_rate,
	} = useSelector((state) => state.localization)
	const [product, setProduct] = useState(null)
	const ringSizes = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']
	const [selectedSize, setSelectedSize] = useState(ringSizes[0])

	useEffect(() => {
		getProduct(id).then((res) => {
			setProduct(res.data[0])
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])
	// const [activeTab, setActiveTab] = useState('earring')

	const handleClick = async () => {
		await dispatch(
			addToCart({
				userId: dbId,
				productId: product.product_id,
				diamondId: null,
				ringStyleId: null,
				quantity: 1,
			})
		)
		await dispatch(fetchUserCartItems(dbId))
		navigate('/cart')
	}

	return (
		<>
			<button
				className="justify-start w-full flex ms-20"
				onClick={() => navigate(`/product/${product?.subCategory}`)}
			>
				{'< '}
				Go back to Products
			</button>

			<div className="flex flex-col md:flex-row items-center gap-8">
				{/* Left Side - Image Grid */}
				<div className="w-full md:w-3/5 grid grid-cols-2 gap-4">
					{product?.image_URL.map((image) => (
						<img
							src={image}
							alt="Ring 1"
							className="w-full h-auto rounded-lg shadow-md"
						/>
					))}
				</div>

				{/* Right Side - Content */}
				<div className="w-full md:w-2/5 p-8 space-y-4 flex flex-col max-h-fit md:sticky top-40 self-start">
					<h2 className="text-4xl special">{product?.name}</h2>
					<div className="text-2xl font-light text-green-900">
						{currency}
						{convertPrice(
							Number(product?.total_cost),
							country,
							USD_rate,
							GBP_rate,
							AUD_rate,
							OMR_rate,
							AED_rate,
							EUR_rate
						).toFixed(2)}
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

			{/* Product Description Section */}
			<div className="mt-8 p-6 bg-white shadow-lg rounded-2xl">
				<h3 className="text-2xl font-semibold mb-4 text-gray-900">
					Product Description
				</h3>
				<div className="">
					<p className="text-gray-700 font-medium">SKU: {product?.SKU}</p>
					<p className="text-gray-600 mt-2">{product?.description}</p>
					<div className="bg-yellow-100 p-3 rounded-lg my-4 border-l-4 border-yellow-500 w-1/2">
						<p className="text-yellow-800 font-medium">
							<strong>DISCLAIMER:</strong> Earring backings are provided as
							shown and cannot be altered.
						</p>
					</div>
					<div className="mt-4">
						<table className="w-1/2 border-collapse text-left">
							<tbody>
								{[
									['Gold Quantity', product?.gold_quantity],
									['Round Quantity', product?.round_quantity],
									['Oval Quantity', product?.oval_quantity],
									['Marquise Quantity', product?.marquise_quantity],
									['Emerald Quantity', product?.emerald_quantity],
									['Princess Quantity', product?.princess_quantity],
									['Pear Quantity', product?.pear_quantity],
									['Heart Quantity', product?.heart_quantity],
									['Other Diamond Quantity', product?.other_diamond_quantity],
									['Gemstone Quantity', product?.gemstone_quantity],
								]
									.reduce((rows, item, index, array) => {
										if (index % 2 === 0) {
											rows.push([item, array[index + 1] || ['-', '-']])
										}
										return rows
									}, [])
									.map(([left, right], index) => (
										<tr
											key={index}
											className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}
										>
											<td className="py-2 px-4 font-semibold text-gray-700">
												{left[0]}
											</td>
											<td className="py-2 px-4 text-gray-700">{left[1]}g</td>
											<td className="py-2 px-4 font-semibold text-gray-700">
												{right[0]}
											</td>
											<td className="py-2 px-4 text-gray-700">{right[1]}g</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Reviews List */}
			{product?.product_id && <ReviewsList product_id={product?.product_id} />}
		</>
	)
}

export default Product

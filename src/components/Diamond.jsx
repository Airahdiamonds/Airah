import { useDispatch, useSelector } from 'react-redux'
import {
	setShowDiamond,
	setStep,
	updateDiamondDetails,
	setImageURLs,
} from '../redux/ringCustomizationSlice'
import { useEffect, useState } from 'react'
import { getDiamond } from '../utils/api'
import { convertPrice } from '../utils/helpers'

function Diamond() {
	const dispatch = useDispatch()
	const { productDetails } = useSelector((state) => state.ringCustomization)
	const { currency, country, INR_rate, GBP_rate } = useSelector(
		(state) => state.localization
	)

	const [product, setProduct] = useState(null)
	const [activeTab, setActiveTab] = useState('earring')

	useEffect(() => {
		getDiamond(productDetails[0].diamond?.product_id).then((res) => {
			setProduct(res.data[0])
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleClick = () => {
		dispatch(
			updateDiamondDetails({
				diamond_price: +product.price,
			})
		)
		dispatch(setImageURLs(product?.image_URL))
		dispatch(setStep(2))
	}

	return (
		<>
			<button
				className="justify-start w-full flex ms-20"
				onClick={() => dispatch(setShowDiamond(false))}
			>
				{'< '}
				Go back to diamonds
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
				<div className="w-full md:w-2/5 border border-[#bf927f] p-8 space-y-4 flex flex-col max-h-fit md:sticky top-40 self-start">
					<h2 className="text-4xl special">{product?.name}</h2>
					<p className="text-lg">{product?.size} Total Carat Weight</p>
					<div className="text-2xl font-light text-green-900">
						{currency}
						{convertPrice(product?.price, country, INR_rate, GBP_rate)}
						<p className="text-sm text-gray-500">(Setting Price)</p>
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

						<button
							onClick={handleClick}
							className="px-6 py-2 text-lg w-full h-16 bg-[#c9a992] text-white rounded-sm shadow-md hover:bg-[#bf927f] active:bg-[#a8826c]"
						>
							Select This Setting
						</button>
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
					<div className="bg-yellow-100 p-3 rounded-lg my-4 border-l-4 border-yellow-500">
						<p className="text-yellow-800 font-medium">
							<strong>DISCLAIMER:</strong> Earring backings are provided as
							shown and cannot be altered.
						</p>
					</div>

					{/* Tabs Navigation */}
					<div className="flex justify-start border-b pb-2 relative">
						<button
							className={`px-6 py-2 text-gray-600 font-semibold transition-all duration-300 rounded-t-lg ${
								activeTab === 'earring'
									? 'text-gray-900 border-b-4 border-gray-900'
									: 'hover:text-gray-900 hover:border-b-4 hover:border-gray-300'
							}`}
							onClick={() => setActiveTab('earring')}
						>
							Earring Information
						</button>

						<button
							className={`px-6 py-2 text-gray-600 font-semibold transition-all duration-300 rounded-t-lg ${
								activeTab === 'setting'
									? 'text-gray-900 border-b-4 border-gray-900'
									: 'hover:text-gray-900 hover:border-b-4 hover:border-gray-300'
							}`}
							onClick={() => setActiveTab('setting')}
						>
							Setting Information
						</button>

						{/* Decorative Highlight Bar */}
					</div>

					{/* Tab Content */}
					<div className="mt-4">
						{activeTab === 'earring' && (
							<table className="w-full border-collapse text-left">
								<tbody>
									{[
										['Metal', '14K White Gold'],
										['Backing', 'Push Back'],
										['Rhodium Finish', 'Yes'],
										['Diamond Shape', 'Round'],
										['Quantity', '2'],
										['Average Total Carat', '0.25'],
										['Average Color', 'H-I'],
										['Average Clarity', 'SI1-SI2'],
										['Setting Type', 'Prong'],
									].map(([label, value], index) => (
										<tr
											key={label}
											className={`${
												index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
											}`}
										>
											<td className="py-2 px-4 font-semibold text-gray-700">
												{label}
											</td>
											<td className="py-2 px-4 text-gray-700">{value}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}

						{activeTab === 'setting' && (
							<table className="w-full border-collapse text-left">
								<tbody>
									{[
										['Metal', '14K White Gold'],
										['Width', '2.00mm'],
										['Rhodium Finish', 'Yes'],
									].map(([label, value], index) => (
										<tr
											key={label}
											className={`${
												index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
											}`}
										>
											<td className="py-2 px-4 font-semibold text-gray-700">
												{label}
											</td>
											<td className="py-2 px-4 text-gray-700">{value}</td>
										</tr>
									))}
								</tbody>
							</table>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default Diamond

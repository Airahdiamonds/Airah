import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { searchResult } from '../utils/api'
import { useDispatch, useSelector } from 'react-redux'
import { convertPrice } from '../utils/helpers'
import {
	setCustomization,
	setShowDiamond,
	setShowRing,
	setStep,
} from '../redux/ringCustomizationSlice'

const SearchGrid = () => {
	const [products, setProducts] = useState([])
	const location = useLocation()
	const dispatch = useDispatch()
	const navigate = useNavigate()
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

	// Fetch search results whenever location.state changes
	useEffect(() => {
		if (location.state) {
			const fetchProducts = async () => {
				try {
					const data = await searchResult(location.state)
					setProducts(data.data)
					console.log(data.data)
				} catch (error) {
					console.error('Error fetching products:', error)
				}
			}

			fetchProducts()
		}
	}, [location.state]) // Dependency array includes location.state

	const handleView = (item) => {
		if (item.type === 3) {
			navigate(`/products/${item.product_id}`)
		} else if (item.type === 1) {
			dispatch(
				setCustomization({
					diamond: {
						product_id: item.diamond_id,
						diamond_price: item.price,
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
				})
			)
			dispatch(setStep(1))
			dispatch(setShowDiamond(true))
			navigate('/customize')
		} else {
			dispatch(
				setCustomization({
					diamond: {
						product_id: null,
						diamond_price: null,
					},
					ring: {
						product_id: item.ring_style_id,
						ring_price:
							Number(item.head_style_price) +
							Number(item.head_metal_price) +
							Number(item.shank_style_price) +
							Number(item.shank_metal_price),
						headStyle: item.head_style,
						headMetal: item.head_metal,
						shankStyle: item.shank_style,
						shankMetal: item.shank_metal,
					},
					total_cost: null,
				})
			)
			dispatch(setStep(2))
			dispatch(setShowRing(true))
			navigate('/customize')
		}
	}

	if (!products || products.length === 0) {
		return (
			<div className="flex justify-center items-center h-48">
				<h1 className="text-2xl font-bold text-gray-800 text-center">
					No Products Found :( <br />
					search for for something else!
				</h1>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-2 gap-8">
			{products?.map((product) => (
				<div
					key={product.favorite_id}
					className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
				>
					<img
						alt="something"
						src={product.image_URL[0]}
						className="w-full h-50 object-cover rounded-lg mb-4"
					/>
					<h2 className="text-lg font-semibold text-gray-800">
						{product.name}
					</h2>
					<p className="text-gray-600 mb-4">{product.description}</p>
					<p className="text-xl font-bold text-grey-500">
						{currency}
						{convertPrice(
							product.type === 1
								? Number(product.price)
								: product.type === 2
								? Number(product?.head_style_price) +
								  Number(product?.head_metal_price) +
								  Number(product?.shank_style_price) +
								  Number(product?.shank_metal_price)
								: Number(product.total_cost),
							country,
							USD_rate,
							GBP_rate,
							AUD_rate,
							OMR_rate,
							AED_rate,
							EUR_rate
						).toFixed(2)}
					</p>
					<div className="flex space-x-4 mt-4">
						<button
							onClick={() => {
								handleView(product)
							}}
							className="px-4 py-2 bg-black text-white rounded-md border border-solid border-grey hover:bg-white hover:text-black transition duration-300 ease-in-out"
						>
							View
						</button>
					</div>
				</div>
			))}
		</div>
	)
}

export default SearchGrid

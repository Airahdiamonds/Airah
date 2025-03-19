import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	setShowDiamond,
	updateDiamondDetails,
} from '../redux/ringCustomizationSlice'
import { convertPrice } from '../utils/helpers'
import {
	addToFavorites,
	addToFavoritesLocal,
	clearLocalFavorites,
	fetchUserFavorites,
	removeFromFavorites,
	removeFromFavoritesLocal,
} from '../redux/favoritesCartSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useUser } from '@clerk/clerk-react'
import { fetchDiamonds } from '../redux/userProductsSlice'
import ImageCarousel from './ImageCarousel'

function DiamondGrid() {
	const dispatch = useDispatch()
	const { diamonds } = useSelector((state) => state.userProducts)
	const { favorites } = useSelector((state) => state.favoritesCart)
	const { currency, country, INR_rate, GBP_rate } = useSelector(
		(state) => state.localization
	)
	const { user } = useUser()
	const dbId = user?.publicMetadata?.dbId
	const [cut, setCut] = useState(50)
	const [color, setColor] = useState(50)
	const [carat, setCarat] = useState(50)
	const [clarity, setClarity] = useState(50)
	const [price, setPrice] = useState(50)
	const labels = ['M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D']

	useEffect(() => {
		if (!dbId) {
			const guestFavorites = JSON.parse(localStorage.getItem('favorites')) || []
			guestFavorites.forEach((fav) => {
				dispatch(addToFavoritesLocal(fav))
			})
		} else if (dbId) {
			const localFavorites = JSON.parse(localStorage.getItem('favorites')) || []
			localFavorites.forEach((fav) => {
				dispatch(
					addToFavorites({
						dbId,
						product_id: fav.product_id,
						diamond_id: fav.diamond_id,
						ring_style_id: fav.ring_style_id,
					})
				)
			})
			dispatch(clearLocalFavorites())
			dispatch(fetchUserFavorites(dbId))
		}
		dispatch(fetchDiamonds(dbId))
	}, [dbId, dispatch])

	const isProductFavorited = (diamond_id) => {
		return favorites.some((fav) => fav.diamond_id === diamond_id)
	}

	const handleClick = (product_id) => {
		dispatch(updateDiamondDetails({ product_id: product_id }))
		dispatch(setShowDiamond(true))
	}

	const handleFavorite = (e, diamond_id) => {
		e.stopPropagation()
		if (dbId) {
			if (isProductFavorited(diamond_id)) {
				dispatch(removeFromFavorites({ userId: dbId, diamond_id })).then(() => {
					dispatch(fetchDiamonds(dbId))
					dispatch(fetchUserFavorites(dbId))
				})
			} else {
				dispatch(addToFavorites({ dbId, diamond_id })).then(() => {
					dispatch(fetchDiamonds(dbId))
					dispatch(fetchUserFavorites(dbId))
				})
			}
		} else {
			if (isProductFavorited(diamond_id)) {
				dispatch(removeFromFavoritesLocal({ diamond_id }))
			} else {
				dispatch(addToFavoritesLocal({ diamond_id }))
			}
		}
	}

	return (
		<div className="min-h-screen bg-white flex flex-col items-center">
			{/* Filters */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full text-center">
				<div className="p-4">
					<h3 className="text-left">Shape</h3>
					<div className="grid grid-cols-10 gap-2 mt-2 relative">
						{[
							'Round',
							'Princess',
							'Oval',
							'Marquise',
							'Cushion',
							'Emerald',
							'Heart',
							'Pear',
							'Asscher',
							'Radiant',
						].map((shape, index) => (
							<div key={shape} className="relative">
								<div className="p-2 border border-black rounded text-black text-sm flex items-center justify-center">
									<i className="fas fa-gem mr-2 text-black"></i>{' '}
									{/* Example icon, you can replace it with your own */}
									{index + 1}
								</div>
								<span className="absolute bottom-0 left-0 w-full text-center text-black text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									{shape}
								</span>
							</div>
						))}
					</div>
				</div>

				<div className="p-4">
					<h3 className="text-left">Cut</h3>
					<div className="mt-2 relative">
						<input
							type="range"
							min="1"
							max="4"
							value={cut}
							onChange={(e) => setCut(e.target.value)}
							className="w-full h-1 bg-black appearance-none cursor-pointer"
							style={{
								background: `linear-gradient(to right, #000000 0%, #000000 ${cut}%, #ffffff ${cut}%, #ffffff 100%)`,
							}}
						/>
						<div className="absolute top-full left-0 w-full flex justify-between px-4 text-black text-xs">
							<span>Good</span>
							<span>Very Good</span>
							<span>Ideal</span>
							<span>True Hearts</span>
						</div>
					</div>
				</div>

				<div className="p-4">
					<h3 className="text-left">Color</h3>
					<div className="relative">
						<input
							type="range"
							min="1"
							max="20"
							value={color}
							onChange={(e) => setColor(e.target.value)}
							className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none"
							style={{
								background: `linear-gradient(to right, #000000 0%, #000000 ${
									color * 5
								}%, #ffffff ${color * 5}%, #ffffff 100%)`,
							}}
						/>
						<div className="flex justify-between mt-2 text-sm text-gray-700">
							{labels.map((label, index) => (
								<span key={index} className="text-center w-full">
									{label}
								</span>
							))}
						</div>
					</div>
				</div>

				<div className="p-4">
					<h3 className="text-left">Carat</h3>
					<input
						type="range"
						min="1"
						max="100"
						value={carat}
						onChange={(e) => setCarat(e.target.value)}
						className="w-full h-1 bg-black appearance-none cursor-pointer"
						style={{
							background: `linear-gradient(to right, #000000 0%, #000000 ${carat}%, #ffffff ${carat}%, #ffffff 100%)`,
						}}
					/>
					<div className="mt-2 text-black text-xs">
						<span>Selected Carat: {(carat / 100).toFixed(2)} carats</span>
					</div>
				</div>

				<div className="p-4">
					<h3 className="text-left">Clarity</h3>
					<div className="mt-2 relative">
						<input
							type="range"
							min="1"
							max="9"
							value={clarity}
							onChange={(e) => setClarity(e.target.value)}
							className="w-full h-1 bg-black appearance-none cursor-pointer"
							style={{
								background: `linear-gradient(to right, #000000 0%, #000000 ${clarity}%, #ffffff ${clarity}%, #ffffff 100%)`,
							}}
						/>
						<div className="absolute top-full left-0 w-full flex justify-between px-4 text-black text-xs">
							<span>I1</span>
							<span>SI2</span>
							<span>SI1</span>
							<span>VS2</span>
							<span>VS1</span>
							<span>VVS2</span>
							<span>VVS1</span>
							<span>IF</span>
							<span>FL</span>
						</div>
					</div>
				</div>

				<div className="p-4">
					<h3 className="text-left">Price</h3>
					<input
						type="range"
						min="1"
						max="100"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
						className="w-full h-1 bg-black appearance-none cursor-pointer"
						style={{
							background: `linear-gradient(to right, #000000 0%, #000000 ${price}%, #ffffff ${price}%, #ffffff 100%)`,
						}}
					/>
					<div className="mt-2 text-black text-xs">
						<span>Selected Price: ${price * 10}</span>
					</div>
				</div>
			</div>

			<main className="flex-1 w-full p-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
					{diamonds.map((product) => (
						<button
							onClick={() => handleClick(product.diamond_id)}
							key={product.diamond_id}
							className="bg-white shadow-lg text-center transition-transform transform hover:scale-105 hover:shadow-xl border border-[#be9080]"
						>
							<div
								className="absolute bottom-20 right-4 text-2xl cursor-pointer text-[#be9080]"
								onClick={(e) => handleFavorite(e, product.diamond_id)}
							>
								{isProductFavorited(product.diamond_id) ? (
									<FaHeart className="text-red-500" />
								) : (
									<FaRegHeart />
								)}
							</div>
							<ImageCarousel
								images={product.image_URL}
								className="w-full h-72 object-cover border-b border-[#be9080] transition duration-500 ease-in-out"
							/>
							<div className="p-4">
								<h2 className="text-xl font-light mb-2 text-[#be9080]">
									{product.name}
								</h2>
								<p className="text-[#be9080] text-lg mb-4 font-light">
									{currency}
									{convertPrice(product.price, country, INR_rate, GBP_rate)}
								</p>
							</div>
						</button>
					))}
				</div>
			</main>
		</div>
	)
}

export default DiamondGrid

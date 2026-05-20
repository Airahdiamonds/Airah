import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	setShowDiamond,
	updateDiamondDetails,
} from '../redux/ringCustomizationSlice'
import {
	addToFavorites,
	addToFavoritesLocal,
	removeFromFavorites,
	removeFromFavoritesLocal,
} from '../redux/favoritesCartSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { fetchDiamonds } from '../redux/userProductsSlice'
import ImageCarousel from './ImageCarousel'
import Filters from './Filters'
import PriceDisplay from './PriceDisplay'
import useFavoritesSync from '../hooks/useFavoritesSync'

function DiamondGrid() {
	const dispatch = useDispatch()
	const { diamonds } = useSelector((state) => state.userProducts)
	const { favorites } = useSelector((state) => state.favoritesCart)
	const { currentUser } = useFavoritesSync()
	const [filters, setFilters] = useState({
		diamondSize: [],
		diamondClarity: [],
		diamondShape: [],
		diamondColor: [],
		diamondCut: [],
	})
	const requestFilters = useMemo(() => filters, [filters])

	useEffect(() => {
		dispatch(fetchDiamonds({ filters: requestFilters }))
	}, [dispatch, requestFilters])

	const filteredDiamonds = diamonds?.filter((product) => {
		return (
			(filters.diamondSize.length === 0 ||
				filters.diamondSize.includes(product.size)) &&
			(filters.diamondClarity.length === 0 ||
				filters.diamondClarity.includes(product.clarity)) &&
			(filters.diamondShape.length === 0 ||
				filters.diamondShape.includes(product.shape)) &&
			(filters.diamondColor.length === 0 ||
				filters.diamondColor.includes(product.color)) &&
			(filters.diamondCut.length === 0 ||
				filters.diamondCut.includes(product.cut))
		)
	})

	const isProductFavorited = (diamond_id) => {
		return favorites.some((fav) => fav.diamond_id === diamond_id)
	}

	const handleClick = (product_id) => {
		dispatch(updateDiamondDetails({ product_id: product_id }))
		dispatch(setShowDiamond(true))
	}

	const handleFavorite = (e, diamond_id) => {
		e.stopPropagation()
		if (currentUser) {
			if (isProductFavorited(diamond_id)) {
				dispatch(removeFromFavorites({ userId: currentUser, diamond_id })).then(
					() => {
						dispatch(fetchDiamonds({ filters: requestFilters }))
					}
				)
			} else {
				dispatch(addToFavorites({ currentUser, diamond_id })).then(() => {
					dispatch(fetchDiamonds({ filters: requestFilters }))
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
		<div className="w-full">
			{/* Filters at the top */}
			<div className="w-full ">
				<Filters filters={filters} setFilters={setFilters} />
			</div>

			{/* Diamond Grid below */}
			<main className="w-full p-2 lg:p-4">
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
					{filteredDiamonds?.map((product) => (
						<button
							onClick={() => handleClick(product.diamond_id)}
							key={product.diamond_id}
							className="relative bg-white shadow-md text-left transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200  rounded-lg"
						>
							<ImageCarousel
								images={product.image_URL}
								className="w-full h-70 sm:h-70 object-cover border-b border-gray-200 transition duration-500 ease-in-out mb-4"
							/>

							<div className="flex items-center justify-between  px-4">
								<h2 className="text-xl font-light mb-2 text-gray-600">
									{product.name}
								</h2>
								<div
									className="text-xl rounded-full p-1.5 border-2 border-red-300 bg-red-100 cursor-pointer text-red-500"
									onClick={(e) => handleFavorite(e, product.diamond_id)}
								>
									{isProductFavorited(product.diamond_id) ? (
										<FaHeart className="text-red-500" />
									) : (
										<FaRegHeart />
									)}
								</div>
							</div>

							<div className=" px-4 py-2">
								<p className="text-gray-600  text-lg font-light">
									<PriceDisplay value={product.price} />
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

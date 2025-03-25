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
import Filters from './Filters'

function DiamondGrid() {
	const dispatch = useDispatch()
	const { diamonds } = useSelector((state) => state.userProducts)
	const { favorites } = useSelector((state) => state.favoritesCart)
	const { currency, country, INR_rate, GBP_rate } = useSelector(
		(state) => state.localization
	)
	const { user } = useUser()
	const dbId = user?.publicMetadata?.dbId
	const [filters, setFilters] = useState({
		diamondSize: [],
		diamondClarity: [],
		diamondShape: [],
		diamondColor: [],
		diamondCut: [],
	})

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
		dispatch(fetchDiamonds({ dbId, filters }))
	}, [dbId, dispatch, filters])

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
		<div className="flex">
			{/* Filters */}
			<div className="w-[20%] hidden lg:block p-4">
				<Filters filters={filters} setFilters={setFilters} />
			</div>
			<main className="flex-1 w-full p-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
					{filteredDiamonds?.map((product) => (
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

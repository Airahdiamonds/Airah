import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setShowRing, updateRingDetails } from '../redux/ringCustomizationSlice'
import { convertPrice } from '../utils/helpers'
import { useUser } from '@clerk/clerk-react'
import { fetchStyles } from '../redux/userProductsSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import {
	addToFavorites,
	addToFavoritesLocal,
	clearLocalFavorites,
	fetchUserFavorites,
	removeFromFavorites,
	removeFromFavoritesLocal,
} from '../redux/favoritesCartSlice'
import ImageCarousel from './ImageCarousel'

function RingGrid() {
	const dispatch = useDispatch()
	const { styles } = useSelector((state) => state.userProducts)
	const { favorites } = useSelector((state) => state.favoritesCart)
	const { currency, country, INR_rate, GBP_rate } = useSelector(
		(state) => state.localization
	)
	const { user } = useUser()
	const dbId = user?.publicMetadata?.dbId

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
		dispatch(fetchStyles(dbId))
	}, [dbId, dispatch])

	const isProductFavorited = (ring_style_id) => {
		return favorites.some((fav) => fav.ring_style_id === ring_style_id)
	}

	const handleClick = (product_id) => {
		dispatch(updateRingDetails({ product_id: product_id }))
		dispatch(setShowRing(true))
	}

	const handleFavorite = (e, ring_style_id) => {
		e.stopPropagation()
		if (dbId) {
			if (isProductFavorited(ring_style_id)) {
				dispatch(removeFromFavorites({ userId: dbId, ring_style_id })).then(
					() => {
						dispatch(fetchStyles(dbId))
						dispatch(fetchUserFavorites(dbId))
					}
				)
			} else {
				dispatch(addToFavorites({ dbId, ring_style_id })).then(() => {
					dispatch(fetchStyles(dbId))
					dispatch(fetchUserFavorites(dbId))
				})
			}
		} else {
			if (isProductFavorited(ring_style_id)) {
				dispatch(removeFromFavoritesLocal({ ring_style_id }))
			} else {
				dispatch(addToFavoritesLocal({ ring_style_id }))
			}
		}
	}

	return (
		<>
			<div className="min-h-screen bg-white flex flex-col items-center">
				<main className="flex-1 w-full p-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
						{styles.map((product, index) => (
							<button
								onClick={() => handleClick(product.ring_style_id)}
								key={product.ring_style_id}
								className="bg-white shadow-lg text-center transition-transform transform hover:scale-105 hover:shadow-xl border border-[#be9080]"
							>
								<div
									className="absolute bottom-20 right-4 text-2xl cursor-pointer text-[#be9080]"
									onClick={(e) => handleFavorite(e, product.ring_style_id)}
								>
									{isProductFavorited(product.ring_style_id) ? (
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
										{convertPrice(
											Number(product.head_style_price) +
												Number(product.head_metal_price) +
												Number(product.shank_style_price) +
												Number(product.shank_metal_price),
											country,
											INR_rate,
											GBP_rate
										)}
									</p>
								</div>
							</button>
						))}
					</div>
				</main>
			</div>
		</>
	)
}

export default RingGrid

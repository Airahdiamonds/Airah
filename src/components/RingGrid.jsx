import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setShowRing, updateRingDetails } from '../redux/ringCustomizationSlice'
import { calculateRingTotal } from '../utils/helpers'
import { fetchStyles } from '../redux/userProductsSlice'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import {
	addToFavorites,
	removeFromFavorites,
} from '../redux/favoritesCartSlice'
import ImageCarousel from './ImageCarousel'
import PriceDisplay from './PriceDisplay'
import useFavoritesSync from '../hooks/useFavoritesSync'

function RingGrid() {
	const dispatch = useDispatch()
	const { styles } = useSelector((state) => state.userProducts)
	const { favorites } = useSelector((state) => state.favoritesCart)
	const { currentUser, guestUser } = useFavoritesSync()

	useEffect(() => {
		dispatch(fetchStyles())
	}, [dispatch])

	const isProductFavorited = (ring_style_id) => {
		return favorites.some((fav) => fav.ring_style_id === ring_style_id)
	}

	const handleClick = (product_id) => {
		dispatch(updateRingDetails({ product_id: product_id }))
		dispatch(setShowRing(true))
	}

	const handleFavorite = (e, ring_style_id) => {
		e.stopPropagation()
		const identity = { userId: currentUser, guestId: guestUser }
		const thunk = isProductFavorited(ring_style_id)
			? removeFromFavorites({ ...identity, ring_style_id })
			: addToFavorites({ ...identity, ring_style_id })
		dispatch(thunk).then(() => {
			dispatch(fetchStyles())
		})
	}

	return (
		<div className="w-full">
			<main className="w-full">
				<div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#e4ded7] pb-4 sm:flex-row sm:items-end">
					<div>
						<p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8779]">
							Settings
						</p>
						<h2 className="mt-1 text-2xl font-light tracking-wide text-[#211916]">
							Choose your setting
						</h2>
					</div>
					<p className="text-xs uppercase tracking-[0.18em] text-[#8a7b72]">
						{styles.length} styles
					</p>
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
						{styles.map((product) => (
							<button
								type="button"
								onClick={() => handleClick(product.ring_style_id)}
								key={product.ring_style_id}
								className="group relative overflow-hidden rounded-[6px] border border-[#e4ded7] bg-white text-left transition duration-300 hover:-translate-y-1 hover:border-[#bda28f] hover:shadow-[0_24px_55px_rgba(33,25,22,0.10)]"
							>
								<div
									className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#e4ded7] bg-white/90 text-sm text-[#9a8779] backdrop-blur transition hover:border-[#bda28f] hover:text-[#211916]"
									onClick={(e) => handleFavorite(e, product.ring_style_id)}
								>
									{isProductFavorited(product.ring_style_id) ? (
										<FaHeart className="text-[#8f4d45]" />
									) : (
										<FaRegHeart />
									)}
								</div>
								<div className="aspect-square bg-[#f8f7f4]">
									<ImageCarousel
										images={product.image_URL}
										className="h-full w-full object-cover transition duration-500 ease-in-out group-hover:scale-[1.03]"
									/>
								</div>
								<div className="p-4">
									<h2 className="min-h-12 text-base font-light leading-snug text-[#211916]">
										{product.name}
									</h2>
									<div className="my-4 grid grid-cols-2 gap-2 border-y border-[#eee7df] py-3 text-center text-[10px] uppercase tracking-[0.14em] text-[#8a7b72]">
										<span>{product.head_style}</span>
										<span>{product.shank_style}</span>
									</div>
									<p className="text-lg font-light text-[#211916]">
										<PriceDisplay value={calculateRingTotal(product)} />
									</p>
								</div>
							</button>
						))}
					</div>
			</main>
		</div>
	)
}

export default RingGrid

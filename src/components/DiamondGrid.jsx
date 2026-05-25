import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	setShowDiamond,
	updateDiamondDetails,
} from '../redux/ringCustomizationSlice'
import {
	addToFavorites,
	removeFromFavorites,
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
	const { currentUser, guestUser } = useFavoritesSync()
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
		const identity = { userId: currentUser, guestId: guestUser }
		const thunk = isProductFavorited(diamond_id)
			? removeFromFavorites({ ...identity, diamond_id })
			: addToFavorites({ ...identity, diamond_id })
		dispatch(thunk).then(() => {
			dispatch(fetchDiamonds({ filters: requestFilters }))
		})
	}

	return (
		<div className="w-full space-y-8">
			<div className="w-full">
				<Filters filters={filters} setFilters={setFilters} />
			</div>

			<main className="w-full">
				<div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#e4ded7] pb-4 sm:flex-row sm:items-end">
					<div>
						<p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8779]">
							Natural Diamonds
						</p>
						<h2 className="mt-1 text-2xl font-light tracking-wide text-[#211916]">
							Select your center stone
						</h2>
					</div>
					<p className="text-xs uppercase tracking-[0.18em] text-[#8a7b72]">
						{filteredDiamonds?.length ?? 0} stones
					</p>
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
					{filteredDiamonds?.map((product) => (
						<button
							type="button"
							onClick={() => handleClick(product.diamond_id)}
							key={product.diamond_id}
							className="group relative overflow-hidden rounded-[6px] border border-[#e4ded7] bg-white text-left transition duration-300 hover:-translate-y-1 hover:border-[#bda28f] hover:shadow-[0_24px_55px_rgba(33,25,22,0.10)]"
						>
							<div className="aspect-square bg-[#f8f7f4]">
								<ImageCarousel
									images={product.image_URL}
									className="h-full w-full object-cover transition duration-500 ease-in-out group-hover:scale-[1.03]"
								/>
							</div>

							<div className="flex items-start justify-between gap-3 px-4 pt-4">
								<h2 className="min-h-12 text-base font-light leading-snug text-[#211916]">
									{product.name}
								</h2>
								<div
									className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e4ded7] bg-white text-sm text-[#9a8779] transition hover:border-[#bda28f] hover:text-[#211916]"
									onClick={(e) => handleFavorite(e, product.diamond_id)}
								>
									{isProductFavorited(product.diamond_id) ? (
										<FaHeart className="text-[#8f4d45]" />
									) : (
										<FaRegHeart />
									)}
								</div>
							</div>

							<div className="px-4 pb-4 pt-2">
								<div className="mb-4 grid grid-cols-3 gap-2 border-y border-[#eee7df] py-3 text-center text-[10px] uppercase tracking-[0.14em] text-[#8a7b72]">
									<span>{product.shape}</span>
									<span>{product.size}ct</span>
									<span>{product.color}</span>
								</div>
								<p className="text-lg font-light text-[#211916]">
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

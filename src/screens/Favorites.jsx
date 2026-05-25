import { useDispatch, useSelector } from 'react-redux'
import { removeFromFavorites } from '../redux/favoritesCartSlice'
import { useNavigate } from 'react-router-dom'
import {
	setCustomization,
	setShowDiamond,
	setShowRing,
	setStep,
} from '../redux/ringCustomizationSlice'
import { getStyle } from '../utils/api'
import PriceDisplay from '../components/PriceDisplay'
import useFavoritesSync from '../hooks/useFavoritesSync'
import {
	ArrowRight,
	Eye,
	Gem,
	Heart,
	PackageCheck,
	Sparkles,
	Trash2,
} from 'lucide-react'

const getFavoriteType = (item) =>
	item.product_type ?? (item.product_id != null ? 1 : item.diamond_id != null ? 2 : 3)

const getFavoriteImage = (item) => {
	const type = getFavoriteType(item)
	if (type === 1) return item.product_image?.[0]
	if (type === 2) return item.diamond_image?.[0]
	return item.ring_images?.[0]
}

const getFavoriteName = (item) =>
	item.product_name || item.diamond_name || item.ring_style_name || 'Saved piece'

const getFavoritePrice = (item) =>
	Number(item.product_price) || Number(item.diamond_price) || Number(item.ring_style_price) || 0

const getFavoriteLabel = (item) => {
	const type = getFavoriteType(item)
	if (type === 1) return 'Finished Piece'
	if (type === 2) return 'Loose Diamond'
	return 'Ring Setting'
}

const Favorites = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { favorites, loading } = useSelector((state) => state.favoritesCart)
	const { currentUser, guestUser } = useFavoritesSync()

	const handleRemove = (item) => {
		const type = getFavoriteType(item)
		const idMap = {
			1: { product_id: item.product_id },
			2: { diamond_id: item.diamond_id },
			3: { ring_style_id: item.ring_style_id },
		}

		const idObj = idMap[type]
		if (!idObj) return
		dispatch(
			removeFromFavorites({
				userId: currentUser,
				guestId: guestUser,
				...idObj,
			})
		)
	}

	const handleView = (item) => {
		const type = getFavoriteType(item)

		if (type === 1) {
			navigate(`/products/${item.product_id}`)
		} else if (type === 2) {
			dispatch(
				setCustomization({
					diamond: {
						product_id: item.diamond_id,
						diamond_price: item.diamond_price,
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
			getStyle(item.ring_style_id).then((res) => {
				dispatch(
					setCustomization({
						diamond: {
							product_id: null,
							diamond_price: null,
						},
						ring: {
							product_id: item.ring_style_id,
							ring_price: item.ring_style_price,
							headStyle: res.data[0].head_style,
							headMetal: res.data[0].head_metal,
							shankStyle: res.data[0].shank_style,
							shankMetal: res.data[0].shank_metal,
						},
						total_cost: null,
					})
				)
				dispatch(setStep(2))
				dispatch(setShowRing(true))
				navigate('/customize', { state: res.data[0] })
			})
		}
	}

	return (
		<div className="min-h-screen bg-[#f8f6f3] text-[#211916]">
			<section className="border-b border-[#e7ded6] bg-[#fbfaf8]">
				<div className="mx-auto flex max-w-[1440px] flex-col gap-5 px-5 py-8 md:px-8 lg:px-10">
					<p className="text-[11px] uppercase tracking-[0.32em] text-[#9a8779]">
						Saved Selection
					</p>
					<div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
						<div>
							<h1 className="text-4xl font-light leading-tight text-[#211916] md:text-5xl">
								Your favorites
							</h1>
							<p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f625b] md:text-base">
								A private edit of finished jewellery, diamonds, and settings you can
								return to when building your final piece.
							</p>
						</div>
						<div className="grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.18em] text-[#7e7068] sm:min-w-[420px]">
							<FavoriteStat value={favorites.length} label={favorites.length === 1 ? 'Saved' : 'Saved'} />
							<FavoriteStat value="Private" label="Wishlist" />
							<FavoriteStat value="Custom" label="Ready" />
						</div>
					</div>
				</div>
			</section>

			<main className="mx-auto max-w-[1440px] px-5 py-8 md:px-8 lg:px-10">
				{loading ? (
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{Array.from({ length: 8 }).map((_, index) => (
							<div
								key={index}
								className="animate-pulse border border-[#e7ded6] bg-[#fbfaf8]"
							>
								<div className="aspect-[4/5] bg-[#ebe5de]" />
								<div className="space-y-3 p-5">
									<div className="h-3 w-1/3 bg-[#e2d8cf]" />
									<div className="h-4 w-2/3 bg-[#e2d8cf]" />
									<div className="h-3 w-1/2 bg-[#e2d8cf]" />
								</div>
							</div>
						))}
					</div>
				) : favorites.length === 0 ? (
					<div className="border border-[#e7ded6] bg-[#fbfaf8]/80 px-5 py-20 text-center">
						<div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#d9cfc6] bg-white text-[#a16207]">
							<Heart className="h-6 w-6" strokeWidth={1.4} />
						</div>
						<h2 className="mt-6 text-2xl font-light text-[#211916]">
							No favorites saved yet
						</h2>
						<p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#7e7068]">
							Save pieces from the collection or choose diamonds and settings in the
							customizer to compare them here.
						</p>
						<button
							type="button"
							onClick={() => navigate('/customize')}
							className="mt-7 inline-flex h-12 items-center gap-3 bg-[#211916] px-7 text-[11px] uppercase tracking-[0.22em] text-[#fbfaf8] transition hover:bg-[#3b302b]"
						>
							Begin Customizing
							<ArrowRight className="h-4 w-4" strokeWidth={1.5} />
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{favorites.map((item) => (
							<FavoriteCard
								key={item.favorite_id}
								item={item}
								onView={handleView}
								onRemove={handleRemove}
							/>
						))}
					</div>
				)}
			</main>
		</div>
	)
}

function FavoriteStat({ value, label }) {
	return (
		<div className="border-l border-[#d9cfc6] px-3">
			<p className="text-base font-medium text-[#211916]">{value}</p>
			<p>{label}</p>
		</div>
	)
}

function FavoriteCard({ item, onView, onRemove }) {
	const type = getFavoriteType(item)
	const image = getFavoriteImage(item)
	const label = getFavoriteLabel(item)

	return (
		<article className="group overflow-hidden border border-[#e7ded6] bg-[#fbfaf8] transition duration-300 hover:-translate-y-1 hover:border-[#cdb9aa] hover:shadow-[0_24px_55px_rgba(43,33,29,0.10)]">
			<button
				type="button"
				onClick={() => onView(item)}
				className="relative block aspect-[4/5] w-full overflow-hidden bg-[#eee9e2] text-left"
			>
				{image ? (
					<img
						src={image}
						alt={getFavoriteName(item)}
						className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center text-[#a16207]">
						<Gem className="h-9 w-9" strokeWidth={1.2} />
					</div>
				)}
				<div className="absolute left-4 top-4 inline-flex items-center gap-2 border border-white/70 bg-white/85 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#6f625b] backdrop-blur">
					{type === 1 ? (
						<PackageCheck className="h-3.5 w-3.5" strokeWidth={1.4} />
					) : type === 2 ? (
						<Gem className="h-3.5 w-3.5" strokeWidth={1.4} />
					) : (
						<Sparkles className="h-3.5 w-3.5" strokeWidth={1.4} />
					)}
					{label}
				</div>
			</button>

			<div className="space-y-5 p-5">
				<div>
					<p className="text-[11px] uppercase tracking-[0.22em] text-[#a18f83]">
						Saved Selection
					</p>
					<h2 className="mt-2 line-clamp-2 min-h-[3.25rem] text-xl font-light leading-snug text-[#211916]">
						{getFavoriteName(item)}
					</h2>
					{item.description && (
						<p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6f625b]">
							{item.description}
						</p>
					)}
				</div>

				<div className="flex items-end justify-between gap-4 border-t border-[#e7ded6] pt-4">
					<div>
						<p className="text-[10px] uppercase tracking-[0.2em] text-[#9a8779]">
							Price
						</p>
						<p className="mt-1 text-xl font-light tabular-nums text-[#211916]">
							<PriceDisplay value={getFavoritePrice(item)} />
						</p>
					</div>
					<Heart className="h-5 w-5 fill-[#b4544f] text-[#b4544f]" strokeWidth={1.4} />
				</div>

				<div className="grid grid-cols-2 gap-3">
					<button
						type="button"
						onClick={() => onView(item)}
						className="inline-flex h-11 items-center justify-center gap-2 bg-[#211916] text-[11px] uppercase tracking-[0.18em] text-[#fbfaf8] transition hover:bg-[#3b302b]"
					>
						<Eye className="h-4 w-4" strokeWidth={1.5} />
						View
					</button>
					<button
						type="button"
						onClick={() => onRemove(item)}
						className="inline-flex h-11 items-center justify-center gap-2 border border-[#d9cfc6] bg-white/60 text-[11px] uppercase tracking-[0.18em] text-[#6f625b] transition hover:border-[#211916] hover:text-[#211916]"
					>
						<Trash2 className="h-4 w-4" strokeWidth={1.5} />
						Remove
					</button>
				</div>
			</div>
		</article>
	)
}

export default Favorites
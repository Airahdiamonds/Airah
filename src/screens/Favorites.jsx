import { useEffect, useState } from 'react'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { useDispatch, useSelector } from 'react-redux'
import {
	addToFavorites,
	clearLocalFavorites,
	fetchUserFavorites,
	removeFromFavorites,
} from '../redux/favoritesCartSlice'
import { convertPrice } from '../utils/helpers'
import { useNavigate } from 'react-router-dom'
import {
	setCustomization,
	setShowDiamond,
	setShowRing,
	setStep,
} from '../redux/ringCustomizationSlice'
import { getStyle } from '../utils/api'

const Favorites = () => {
	const { user, isSignedIn } = useUser()
	const dbId = user?.publicMetadata?.dbId
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { favorites, loading } = useSelector((state) => state.favoritesCart)
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

	const [favoritesSynced, setFavoritesSynced] = useState(false)

	useEffect(() => {
		const syncFavoritesAndFetch = async () => {
			if (!dbId) return

			const localFavorites = JSON.parse(localStorage.getItem('favorites')) || []

			// Sync local favorites to the backend
			if (localFavorites.length > 0) {
				await Promise.all(
					localFavorites.map((fav) =>
						dispatch(
							addToFavorites({
								dbId,
								product_id: fav.product_id,
								diamond_id: fav.diamond_id,
								ring_style_id: fav.ring_style_id,
							})
						)
					)
				)
				setTimeout(() => {
					dispatch(fetchUserFavorites(dbId))
				}, 500)

				dispatch(clearLocalFavorites()) // Clear local after syncing
			}

			// Now fetch the user's favorites

			// Mark as synced so UI can continue
			setFavoritesSynced(true)
		}

		if (dbId && isSignedIn) {
			syncFavoritesAndFetch()
		}
	}, [dbId, isSignedIn, dispatch])

	const handleRemove = (product_id, diamond_id, ring_style_id, type) => {
		const idMap = {
			1: { product_id },
			2: { diamond_id },
			3: { ring_style_id },
		}

		const idObj = idMap[type]
		if (idObj) {
			dispatch(removeFromFavorites({ userId: dbId, ...idObj }))
			dispatch(fetchUserFavorites(dbId))
		}
	}

	const handleView = (item) => {
		if (item.product_type === 1) {
			navigate(`/products/${item.product_id}`)
		} else if (item.product_type === 2) {
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

	if (!isSignedIn) {
		return (
			<div className="h-80 flex flex-col items-center justify-center bg-gray-50">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">
					Please log in to view your Favorites
				</h2>
				<SignInButton mode="modal">
					<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
						Log In
					</button>
				</SignInButton>
			</div>
		)
	}

	if (!favoritesSynced) {
		return (
			<div className="h-80 flex flex-col items-center justify-center bg-gray-50">
				<p className="text-lg text-gray-600">Syncing favorites...</p>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 p-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-8">Your Favorites</h1>

			{loading ? (
				<p>Loading favorites...</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-2 gap-8">
					{favorites.map((item) => (
						<div
							key={item.favorite_id}
							className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
						>
							<img
								alt="something"
								src={
									item?.product_type === 1
										? item.product_image[0]
										: item.product_type === 2
										? item.diamond_image[0]
										: item.ring_images[0]
								}
								className="w-full h-50 object-cover rounded-lg mb-4"
							/>
							<h2 className="text-lg font-semibold text-gray-800">
								{item.product_name || item.diamond_name || item.ring_style_name}
							</h2>
							<p className="text-gray-600 mb-4">{item.description}</p>
							<p className="text-xl font-bold text-grey-500">
								{currency}
								{convertPrice(
									Number(item.product_price) ||
										Number(item.diamond_price) ||
										Number(item.ring_style_price),
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
										handleView(item)
									}}
									className="px-4 py-2 bg-black text-white rounded-md border border-solid border-grey hover:bg-white hover:text-black transition duration-300 ease-in-out"
								>
									View
								</button>
								<button
									onClick={() =>
										handleRemove(
											item.product_id,
											item.diamond_id,
											item.ring_style_id,
											item.product_type
										)
									}
									className="px-4 py-2 bg-white text-black rounded-md hover:bg-black border border-solid border-grey hover:text-white transition duration-300 ease-in-out"
								>
									Remove from Favorites
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default Favorites

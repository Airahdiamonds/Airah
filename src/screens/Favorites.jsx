import { useDispatch, useSelector } from 'react-redux'
import {
	removeFromFavorites,
	removeFromFavoritesLocal,
} from '../redux/favoritesCartSlice'
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

const Favorites = () => {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { favorites, loading } = useSelector((state) => state.favoritesCart)
	const { currentUser } = useFavoritesSync()

	const handleRemove = (product_id, diamond_id, ring_style_id, type) => {
		const idMap = {
			1: { product_id },
			2: { diamond_id },
			3: { ring_style_id },
		}

		const idObj = idMap[type]
		if (idObj && currentUser) {
			dispatch(removeFromFavorites({ userId: currentUser, ...idObj }))
		} else if (idObj) {
			dispatch(removeFromFavoritesLocal(idObj))
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
								<PriceDisplay
									value={
										Number(item.product_price) ||
										Number(item.diamond_price) ||
										Number(item.ring_style_price)
									}
								/>
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

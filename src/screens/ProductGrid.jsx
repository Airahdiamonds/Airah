import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProducts } from '../redux/userProductsSlice'
import { convertPrice } from '../utils/helpers'
import { StarRating } from '../components/StarRating'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { useUser } from '@clerk/clerk-react'
import {
	addToFavorites,
	addToFavoritesLocal,
	clearLocalFavorites,
	fetchUserFavorites,
	removeFromFavorites,
	removeFromFavoritesLocal,
} from '../redux/favoritesCartSlice'
import ImageCarousel from '../components/ImageCarousel'
import Filters from '../components/Filters'

const filterOptions = [
	{ label: 'Diamond Type', options: ['All', 'Natural', 'Lab Grown'] },
	{ label: 'Budget', options: ['All Budgets'] },
	{ label: 'Style', options: ['All Ring Styles'] },
	{ label: 'Shape', options: ['All Diamond Shapes'] },
	{ label: 'Metal', options: ['All Metal Types'] },
	{ label: 'Total Carat', options: ['View All'] },
]

export default function ProductGrid() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { products } = useSelector((state) => state.userProducts)
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
	const { user } = useUser()
	const { subCategory } = useParams()
	const dbId = user?.publicMetadata?.dbId
	const { favorites } = useSelector((state) => state.favoritesCart)
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
		dispatch(fetchProducts({ dbId, subCategory }))
	}, [dbId, dispatch, subCategory])

	const isProductFavorited = (product_id) => {
		return favorites.some((fav) => fav.product_id === product_id)
	}

	const handleClick = (product_id) => {
		navigate('/products/' + product_id)
	}

	const handleFavorite = (e, product_id) => {
		e.stopPropagation()
		if (dbId) {
			if (isProductFavorited(product_id)) {
				dispatch(removeFromFavorites({ userId: dbId, product_id })).then(() => {
					dispatch(fetchProducts(dbId))
					dispatch(fetchUserFavorites(dbId))
				})
			} else {
				dispatch(addToFavorites({ dbId, product_id })).then(() => {
					dispatch(fetchProducts(dbId))
					dispatch(fetchUserFavorites(dbId))
				})
			}
		} else {
			if (isProductFavorited(product_id)) {
				dispatch(removeFromFavoritesLocal({ product_id }))
			} else {
				dispatch(addToFavoritesLocal({ product_id }))
			}
		}
	}

	return (
		<div className="min-h-screen bg-white flex flex-col items-center">
			<h1 className="text-3xl font-bold text-black mt-5">
				READY TO SHIP DIAMOND ENGAGEMENT RINGS
			</h1>
			<p className="text-lg text-black mb-6">
				Browse our collection of ready to ship diamond engagement rings.
			</p>

			<div className="flex flex-wrap justify-center gap-4 mb-6">
				{filterOptions.map((option, index) => (
					<select
						key={index}
						className="p-2 border rounded-lg bg-white text-[#be9080] border-[#be9080]"
					>
						<option>{option.label}</option>
						{option.options.map((opt, idx) => (
							<option key={idx}>{opt}</option>
						))}
					</select>
				))}
			</div>
			<div className="w-full flex">
				<div className="w-[22%] hidden lg:block p-4">
					<Filters filters={filters} setFilters={setFilters} />
				</div>

				<main className="flex-1 w-full p-8">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
						{products.map((product) => (
							<button
							onClick={() => handleClick(product.product_id)}
							key={product.product_id}
							className="relative bg-white shadow-md text-left transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200  rounded-lg"
							>
								<ImageCarousel
							  images={product.image_URL}
							  className="w-full h-72 object-cover  mb-2 transition duration-500 ease-in-out"
							/>
							
							
							<div className="flex items-center justify-between  px-4">
							<h2 className="text-xl font-light  text-gray-600">
								{product.name}
							  </h2>
							  <div
							className="text-xl rounded-full p-1.5 border-2 border-red-300 bg-red-100 cursor-pointer text-red-500"
							onClick={(e) => handleFavorite(e, product.product_id)}
							>
							  {isProductFavorited(product.product_id) ? (
								<FaHeart className="text-red-500" />
							  ) : (
								<FaRegHeart />
							  )}
							</div>
							</div>

							<div className=" px-4 py-2">

							  <p className="text-gray-600  text-lg font-light">
								{currency}
								{convertPrice(
								  Number(product.total_cost),
								  country,
								  USD_rate,
								  GBP_rate,
								  AUD_rate,
								  OMR_rate,
								  AED_rate,
								  EUR_rate
								).toFixed(2)}
							  </p>
							  <p className="text-gray-600  text-sm font-light">
								  <StarRating rating={product.average_rating || 0} /> (
								  {product.review_count})
							  </p>
							</div>
						  </button>
						))}
					</div>
				</main>
			</div>

			<footer className="w-full bg-white text-[#be9080] text-center py-6 mt-8">
				<p className="text-black">
					Diamond Engagement Rings - Viewable In 360° HD
				</p>
				<p className="text-black">
					Looking for engagement ring inspiration? Let our customers’ custom
					creations spur your imagination. Browse a huge selection of diamond
					engagement rings for women in every shape, style, and metal
					imaginable. And to top it all off, set the ring of your dreams with a
					sparkling natural or lab grown diamond.
				</p>
				<p className="text-black">Start designing your own engagement ring.</p>
			</footer>
		</div>
	)
}

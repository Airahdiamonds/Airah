import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProducts } from '../redux/userProductsSlice'
import { StarRating } from '../components/StarRating'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import {
	addToFavorites,
	addToFavoritesLocal,
	removeFromFavorites,
	removeFromFavoritesLocal,
} from '../redux/favoritesCartSlice'
import ImageCarousel from '../components/ImageCarousel'
import Filters from '../components/Filters'
import PriceDisplay from '../components/PriceDisplay'
import useFavoritesSync from '../hooks/useFavoritesSync'

export default function ProductGrid() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { products } = useSelector((state) => state.userProducts)
	const { loading, error } = useSelector((state) => state.userProducts)
	const { currentUser } = useFavoritesSync()
	const { subCategory } = useParams()
	const { favorites } = useSelector((state) => state.favoritesCart)
	const [filters, setFilters] = useState({
		diamondSize: [],
		diamondClarity: [],
		diamondShape: [],
		diamondColor: [],
		diamondCut: [],
	})

	useEffect(() => {
		dispatch(fetchProducts({ subCategory }))
	}, [dispatch, subCategory])

	const isProductFavorited = (product_id) => {
		return favorites.some((fav) => fav.product_id === product_id)
	}

	const handleClick = (product_id) => {
		navigate('/products/' + product_id)
	}

	const handleFavorite = (e, product_id) => {
		e.stopPropagation()
		if (currentUser) {
			if (isProductFavorited(product_id)) {
				dispatch(removeFromFavorites({ userId: currentUser, product_id }))
			} else {
				dispatch(addToFavorites({ dbId: currentUser, product_id }))
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
			<h1 className="text-3xl font-bold text-black mt-5 text-center">
				READY TO SHIP DIAMOND ENGAGEMENT RINGS
			</h1>
			<p className="text-lg text-black mb-6 text-center px-4">
				Browse our collection of ready to ship diamond engagement rings.
			</p>

			{/* NEW FLEX LAYOUT */}
			<div className="flex w-full px-4 md:px-8 gap-6">
				{/* Filters Section - 20% */}
				<div className="w-[25%] hidden md:block">
					<Filters filters={filters} setFilters={setFilters} variant="card" />
				</div>

				{/* Product Grid Section - 80% */}
				<main className="w-[75%]">
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{loading && products.length === 0
							? Array.from({ length: 8 }).map((_, i) => (
									<div
										key={`skeleton-${i}`}
										className="bg-white shadow-md border border-gray-200 rounded-lg animate-pulse"
									>
										<div className="w-full h-72 bg-gray-200 rounded-t-lg" />
										<div className="px-4 py-3 space-y-2">
											<div className="h-4 bg-gray-200 rounded w-2/3" />
											<div className="h-4 bg-gray-200 rounded w-1/3" />
										</div>
									</div>
							  ))
							: products.map((product) => (
							<button
								onClick={() => handleClick(product.product_id)}
								key={product.product_id}
								className="relative bg-white shadow-md text-left transition-transform transform hover:scale-105 hover:shadow-2xl border border-gray-200 rounded-lg"
							>
								<ImageCarousel
									images={product.image_URL}
									className="w-full h-72 object-cover mb-2"
								/>
								<div className="flex items-center justify-between px-4">
									<h2 className="text-xl font-light text-gray-600">
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
								<div className="px-4 py-2">
									<p className="text-gray-600 text-lg font-light">
										<PriceDisplay value={product.total_cost} />
									</p>
									<p className="text-gray-600 text-sm font-light">
										<StarRating rating={product.average_rating || 0} /> (
										{product.review_count})
									</p>
								</div>
							</button>
						))}
					</div>
					{!loading && !error && products.length === 0 && (
						<p className="text-center text-gray-500 mt-8">
							No products found.
						</p>
					)}
					{error && (
						<p className="text-center text-red-500 mt-8">
							Failed to load products. Please try again.
						</p>
					)}
				</main>
			</div>

			<footer className="w-full bg-white text-[#be9080] text-center py-6 mt-8 px-4">
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

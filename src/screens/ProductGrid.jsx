import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProducts } from '../redux/userProductsSlice'
import { StarRating } from '../components/StarRating'
import { Heart, SlidersHorizontal, X } from 'lucide-react'
import {
	addToFavorites,
	removeFromFavorites,
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
	const { currentUser, guestUser } = useFavoritesSync()
	const { subCategory } = useParams()
	const { favorites } = useSelector((state) => state.favoritesCart)
	const [showMobileFilters, setShowMobileFilters] = useState(false)
	const [sortOrder, setSortOrder] = useState('featured')
	const [filters, setFilters] = useState({
		price: '',
		inStock: false,
		minRating: null,
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
		const identity = { userId: currentUser, guestId: guestUser }
		if (isProductFavorited(product_id)) {
			dispatch(removeFromFavorites({ ...identity, product_id }))
		} else {
			dispatch(addToFavorites({ ...identity, product_id }))
		}
	}

	const collectionLabel = subCategory
		? decodeURIComponent(subCategory).replace(/-/g, ' ')
		: 'Ready to ship'

	const visibleProducts = useMemo(() => {
		const filteredProducts = products.filter((product) => {
			const price = Number(product.total_cost ?? 0)
			const rating = Number(product.average_rating ?? 0)
			const stockQty = Number(product.stock_qty ?? 0)

			return (
				(!filters.price || price <= Number(filters.price)) &&
				(!filters.inStock || stockQty > 0) &&
				(!filters.minRating || rating >= Number(filters.minRating))
			)
		})

		return [...filteredProducts].sort((firstProduct, secondProduct) => {
			const firstPrice = Number(firstProduct.total_cost ?? 0)
			const secondPrice = Number(secondProduct.total_cost ?? 0)
			const firstRating = Number(firstProduct.average_rating ?? 0)
			const secondRating = Number(secondProduct.average_rating ?? 0)

			if (sortOrder === 'price-asc') return firstPrice - secondPrice
			if (sortOrder === 'price-desc') return secondPrice - firstPrice
			if (sortOrder === 'rating') return secondRating - firstRating
			return 0
		})
	}, [filters, products, sortOrder])

	const activeFilterCount =
		(filters.price ? 1 : 0) +
		(filters.inStock ? 1 : 0) +
		(filters.minRating ? 1 : 0)

	return (
		<div className="min-h-screen bg-[#f8f6f3] text-[#2b211d]">
			<section className="border-b border-[#e7ded6] bg-[#fbfaf8]">
				<div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-5 py-7 md:px-8 lg:px-10">
					<p className="text-xs uppercase tracking-[0.32em] text-[#9a8779]">
						{collectionLabel}
					</p>
					<div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
						<div className="max-w-3xl">
							<h1 className="text-3xl font-light uppercase tracking-[0.1em] text-[#211916] md:text-4xl xl:text-5xl">
								Ready To Ship Diamond Engagement Rings
							</h1>
							<p className="mt-3 max-w-2xl text-sm leading-7 text-[#6f625b] md:text-base">
								A focused edit of finished diamond rings, selected for refined
								proportions, quiet brilliance, and immediate delivery.
							</p>
						</div>
						<div className="grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.18em] text-[#7e7068] sm:min-w-[360px]">
							<div className="border-l border-[#d9cfc6] px-3">
								<p className="text-base font-medium text-[#2b211d]">
									{products.length}
								</p>
								<p>Designs</p>
							</div>
							<div className="border-l border-[#d9cfc6] px-3">
								<p className="text-base font-medium text-[#2b211d]">360</p>
								<p>HD View</p>
							</div>
							<div className="border-l border-[#d9cfc6] px-3">
								<p className="text-base font-medium text-[#2b211d]">Lifetime</p>
								<p>Warranty</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="mx-auto flex w-full max-w-[1440px] gap-8 px-5 py-7 md:px-8 lg:px-10">
				<aside className="hidden w-[290px] shrink-0 lg:block">
					<div className="sticky top-32">
						<Filters
							filters={filters}
							setFilters={setFilters}
							variant="rail"
							mode="product"
						/>
					</div>
				</aside>

				<main className="min-w-0 flex-1">
					<div className="mb-5 flex flex-col gap-4 border-b border-[#e7ded6] pb-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-sm text-[#6f625b]">
								Showing {visibleProducts.length} of {products.length} pieces
							</p>
							{activeFilterCount > 0 && (
								<p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#9a8779]">
									{activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}
								</p>
							)}
						</div>
						<div className="flex items-center gap-3">
							<button
								type="button"
								onClick={() => setShowMobileFilters(true)}
								className="inline-flex h-11 items-center gap-2 rounded-[4px] border border-[#d9cfc6] bg-white px-4 text-xs uppercase tracking-[0.18em] text-[#2b211d] transition hover:border-[#bda28f] lg:hidden"
							>
								<SlidersHorizontal className="h-4 w-4" />
								Filters
							</button>
							<label className="flex h-11 items-center gap-3 rounded-[4px] border border-[#d9cfc6] bg-white px-4 text-xs uppercase tracking-[0.18em] text-[#7e7068]">
								Sort
								<select
									value={sortOrder}
									onChange={(event) => setSortOrder(event.target.value)}
									className="bg-transparent text-[#2b211d] outline-none"
								>
									<option value="featured">Featured</option>
									<option value="price-asc">Price: Low to High</option>
									<option value="price-desc">Price: High to Low</option>
									<option value="rating">Top Rated</option>
								</select>
							</label>
						</div>
					</div>

					<div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
						{loading && products.length === 0
							? Array.from({ length: 8 }).map((_, i) => (
									<div
										key={`skeleton-${i}`}
										className="animate-pulse overflow-hidden rounded-[6px] border border-[#e7ded6] bg-white"
									>
										<div className="aspect-[5/4] bg-[#ebe5de]" />
										<div className="space-y-3 px-4 py-5">
											<div className="h-3 w-2/3 rounded bg-[#e2d8cf]" />
											<div className="h-3 w-1/3 rounded bg-[#e2d8cf]" />
										</div>
									</div>
							  ))
							: visibleProducts.map((product) => {
									const favorited = isProductFavorited(product.product_id)

									return (
										<article
											key={product.product_id}
											className="group relative overflow-hidden rounded-[6px] border border-[#e7ded6] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#cdb9aa] hover:shadow-[0_24px_55px_rgba(43,33,29,0.10)]"
										>
											<button
												type="button"
												onClick={(event) => handleFavorite(event, product.product_id)}
												className={`absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 shadow-[0_10px_25px_rgba(43,33,29,0.08)] backdrop-blur transition ${
													favorited
														? 'border-[#c27b75] text-[#b4544f]'
														: 'border-[#e7ded6] text-[#7e7068] hover:border-[#c27b75] hover:text-[#b4544f]'
												}`}
												aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
											>
												<Heart
													className="h-4 w-4"
													fill={favorited ? 'currentColor' : 'none'}
												/>
											</button>

											<button
												type="button"
												onClick={() => handleClick(product.product_id)}
												className="block h-full w-full text-left"
											>
												<div className="aspect-[5/4] overflow-hidden bg-[#f3efea]">
													<ImageCarousel
														images={product.image_URL}
														className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
													/>
												</div>
												<div className="space-y-4 px-4 py-5">
													<div className="space-y-2">
														<p className="text-[11px] uppercase tracking-[0.22em] text-[#a18f83]">
															Ready To Ship
														</p>
														<h2 className="line-clamp-2 min-h-[3.25rem] text-lg font-light leading-snug text-[#2b211d]">
															{product.name}
														</h2>
													</div>
													<div className="flex items-end justify-between gap-3 border-t border-[#eee7df] pt-4">
														<div>
															<p className="text-lg font-medium text-[#211916]">
																<PriceDisplay value={product.total_cost} />
															</p>
															<div className="mt-2 flex items-center gap-2 text-xs text-[#7e7068]">
																<span className="text-[#b49a54]">
																	<StarRating rating={product.average_rating || 0} />
																</span>
																<span>({product.review_count || 0})</span>
															</div>
														</div>
														<span className="text-[11px] uppercase tracking-[0.18em] text-[#9a8779] transition group-hover:text-[#2b211d]">
															View
														</span>
													</div>
												</div>
											</button>
										</article>
									)
							  })}
					</div>
					{!loading && !error && visibleProducts.length === 0 && (
						<div className="mt-12 border border-[#e7ded6] bg-white px-6 py-12 text-center">
							<p className="text-lg font-light text-[#2b211d]">No pieces match these filters.</p>
							<p className="mt-2 text-sm text-[#7e7068]">Clear the current edit to see the full collection.</p>
						</div>
					)}
					{error && (
						<p className="mt-8 border border-[#d8aaa0] bg-[#fff8f6] px-4 py-3 text-center text-sm text-[#9f3f35]">
							Failed to load products. Please try again.
						</p>
					)}
				</main>
			</div>

			{showMobileFilters && (
				<div className="fixed inset-0 z-50 bg-[#211916]/40 backdrop-blur-sm lg:hidden">
					<div className="ml-auto flex h-full w-full max-w-sm flex-col bg-[#fbfaf8] p-5 shadow-2xl">
						<div className="mb-5 flex items-center justify-between">
							<p className="text-sm uppercase tracking-[0.22em] text-[#2b211d]">
								Filters
							</p>
							<button
								type="button"
								onClick={() => setShowMobileFilters(false)}
								className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d9cfc6] text-[#2b211d]"
								aria-label="Close filters"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<div className="min-h-0 flex-1 overflow-y-auto">
							<Filters
								filters={filters}
								setFilters={setFilters}
								variant="rail"
								mode="product"
							/>
						</div>
						<button
							type="button"
							onClick={() => setShowMobileFilters(false)}
							className="mt-5 h-12 rounded-[4px] bg-[#2b211d] text-xs uppercase tracking-[0.22em] text-white"
						>
							View Results
						</button>
					</div>
				</div>
			)}

			<footer className="border-t border-[#e7ded6] bg-[#fbfaf8]">
				<div className="mx-auto grid max-w-[1440px] gap-6 px-5 py-10 text-[#6f625b] md:grid-cols-[0.8fr_1.2fr] md:px-8 lg:px-10">
					<p className="text-xl font-light uppercase tracking-[0.14em] text-[#2b211d]">
						Diamond Engagement Rings In 360° HD
					</p>
					<p className="max-w-3xl text-sm leading-7">
						Browse finished diamond engagement rings with balanced proportions,
						considered settings, and natural everyday polish. Choose a ready piece
						or continue into the customizer to build the ring around your own stone.
					</p>
				</div>
			</footer>
		</div>
	)
}

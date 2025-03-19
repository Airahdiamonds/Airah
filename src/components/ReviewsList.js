import React, { useEffect, useState } from 'react'
import { fetchReviews, submitReviews } from '../utils/api'
import { StarRating } from './StarRating'
import ImageURLInput from './ImageURLInput'
import { useUser } from '@clerk/clerk-react'

const ReviewsList = ({ product_id }) => {
	const { user } = useUser()
	const dbId = user?.publicMetadata?.dbId
	const [reviews, setReviews] = useState([])
	const [page, setPage] = useState(1)
	const [limit] = useState(5)
	const [totalPages, setTotalPages] = useState(1)
	const [sortBy, setSortBy] = useState('created_at')
	const [sortOrder, setSortOrder] = useState('desc')
	const [rating, setRating] = useState(null)
	const [hasImage, setHasImage] = useState(false)
	const [newRating, setNewRating] = useState(5)
	const [newComment, setNewComment] = useState('')
	const [newImageUrls, setNewImageUrls] = useState([])
	const [showForm, setShowForm] = useState(false)
	const [refreshKey, setRefreshKey] = useState(0)

	useEffect(() => {
		const getReviews = async () => {
			const data = await fetchReviews({
				product_id,
				page,
				limit,
				sortBy,
				sortOrder,
				rating,
				hasImage,
				fromDate: null,
				toDate: null,
			})
			if (data) {
				setReviews(data.reviews || [])
				setTotalPages(data.totalPages)
			}
		}
		getReviews()
	}, [product_id, page, limit, sortBy, sortOrder, rating, hasImage, refreshKey])

	const handleAddReview = async (e) => {
		e.preventDefault()

		const newReview = {
			product_id,
			user_id: dbId,
			rating: newRating,
			comment: newComment,
			image_URL: newImageUrls.filter((url) => url.trim() !== ''),
		}

		const response = await submitReviews(newReview)
		if (response.success) {
			setReviews([response.review, ...reviews]) // Add new review to the list
			setNewRating(5)
			setNewComment('')
			setNewImageUrls([])
			setShowForm(false) // Close form on successful submission
			setRefreshKey((prev) => prev + 1)
		} else {
			alert('Failed to add review')
		}
	}

	return (
		<div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md">
			<h2 className="text-2xl font-semibold mb-4 text-gray-800">
				Customer Reviews
			</h2>

			{/* Add Review Button */}
			<button
				onClick={() => setShowForm(!showForm)}
				className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-4"
			>
				{showForm ? 'Cancel' : 'Add a Review'}
			</button>

			{/* Review Form (Hidden/Shown based on state) */}
			{showForm && (
				<form
					onSubmit={handleAddReview}
					className="mb-6 p-4 border rounded-lg bg-gray-50"
				>
					<h3 className="text-lg font-semibold mb-2">Write a Review</h3>
					<div className="mb-3">
						<label className="block text-sm font-medium text-gray-600">
							Rating:
						</label>
						<select
							value={newRating}
							onChange={(e) => setNewRating(Number(e.target.value))}
							className="border border-gray-300 rounded-lg px-3 py-1 w-full"
						>
							<option value="5">5 Stars</option>
							<option value="4">4 Stars</option>
							<option value="3">3 Stars</option>
							<option value="2">2 Stars</option>
							<option value="1">1 Star</option>
						</select>
					</div>
					<div className="mb-3">
						<label className="block text-sm font-medium text-gray-600">
							Comment:
						</label>
						<textarea
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							className="border border-gray-300 rounded-lg px-3 py-2 w-full"
							required
						></textarea>
					</div>
					<div className="mb-3">
						<ImageURLInput
							imageURLs={newImageUrls}
							setImageURLs={setNewImageUrls}
						/>
					</div>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
					>
						Submit Review
					</button>
				</form>
			)}

			{/* Filters */}
			<div className="flex flex-wrap gap-4 mb-6">
				<div className="flex items-center gap-2">
					<label className="text-sm text-gray-600">Sort By:</label>
					<select
						className="border border-gray-300 rounded-lg px-3 py-1 focus:ring focus:ring-blue-300"
						value={sortBy}
						onChange={(e) => setSortBy(e.target.value)}
					>
						<option value="created_at">Newest</option>
						<option value="rating">Rating</option>
					</select>
					<select
						className="border border-gray-300 rounded-lg px-3 py-1 focus:ring focus:ring-blue-300"
						value={sortOrder}
						onChange={(e) => setSortOrder(e.target.value)}
					>
						<option value="desc">Descending</option>
						<option value="asc">Ascending</option>
					</select>
				</div>

				<div className="flex items-center gap-2">
					<label className="text-sm text-gray-600">Filter by Rating:</label>
					<select
						className="border border-gray-300 rounded-lg px-3 py-1 focus:ring focus:ring-blue-300"
						value={rating || ''}
						onChange={(e) => setRating(e.target.value || null)}
					>
						<option value="">All</option>
						<option value="5">5 Stars</option>
						<option value="4">4 Stars</option>
						<option value="3">3 Stars</option>
						<option value="2">2 Stars</option>
						<option value="1">1 Star</option>
					</select>
				</div>

				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
						checked={hasImage}
						onChange={() => setHasImage(!hasImage)}
					/>
					<label className="text-sm text-gray-600">
						Only show reviews with images
					</label>
				</div>
			</div>

			{/* Reviews List */}
			<ul className="space-y-6 w-full">
				{reviews.map((review) => (
					<li
						key={review?.review_id}
						className="border rounded-xl p-5 bg-white shadow-md w-full"
					>
						<div className="flex justify-between items-center mb-2">
							<h3 className="text-gray-900 font-semibold text-lg">
								{review?.user?.name}
							</h3>
							<span className="text-gray-500 text-sm">
								{new Date(review?.created_at).toLocaleDateString()}
							</span>
						</div>
						<StarRating rating={review?.rating || 0} />
						<p className="text-gray-600 mt-2">{review?.comment}</p>

						{/* Render images if available */}
						{review?.image_URL.length > 0 && (
							<div className="mt-4 flex gap-3">
								{review?.image_URL.map((img, index) => (
									<img
										key={index}
										src={img}
										alt="Review"
										className="w-24 h-24 object-cover rounded-lg shadow"
									/>
								))}
							</div>
						)}
					</li>
				))}
			</ul>

			{/* Pagination Controls */}
			<div className="flex justify-between items-center mt-6">
				<button
					disabled={page === 1}
					onClick={() => setPage(page - 1)}
					className={`px-4 py-2 rounded-lg ${
						page === 1
							? 'bg-gray-300 cursor-not-allowed'
							: 'bg-blue-500 text-white hover:bg-blue-600'
					}`}
				>
					Previous
				</button>
				<span className="text-gray-600">
					Page {page} of {totalPages}
				</span>
				<button
					disabled={page === totalPages}
					onClick={() => setPage(page + 1)}
					className={`px-4 py-2 rounded-lg ${
						page === totalPages
							? 'bg-gray-300 cursor-not-allowed'
							: 'bg-blue-500 text-white hover:bg-blue-600'
					}`}
				>
					Next
				</button>
			</div>
		</div>
	)
}

export default ReviewsList

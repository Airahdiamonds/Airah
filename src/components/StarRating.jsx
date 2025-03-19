import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

export const StarRating = ({ rating }) => {
	// Convert rating to an array of stars
	const stars = Array.from({ length: 5 }, (_, index) => {
		const starValue = index + 1
		if (rating >= starValue) {
			return <FaStar key={index} className="text-yellow-400" /> // Full star
		} else if (rating >= starValue - 0.5) {
			return <FaStarHalfAlt key={index} className="text-yellow-400" /> // Half star
		} else {
			return <FaRegStar key={index} className="text-gray-400" /> // Empty star
		}
	})

	return <div className="flex">{stars}</div>
}

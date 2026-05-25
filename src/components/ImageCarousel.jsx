import { useState, useEffect } from 'react'
import fallbackProductImage from '../assets/ring4.jpg'

const ImageCarousel = ({ images, className }) => {
	const [imageIndex, setImageIndex] = useState(0)
	const [intervalId, setIntervalId] = useState(null)
	const availableImages = Array.isArray(images)
		? images.filter(Boolean)
		: images
			? [images]
			: []
	const carouselImages = availableImages.length > 0 ? availableImages : [fallbackProductImage]

	const startImageCycle = () => {
		if (carouselImages.length <= 1) return
		const interval = setInterval(() => {
			setImageIndex((prev) => (prev + 1) % carouselImages.length)
		}, 500)

		setIntervalId(interval)
	}

	const stopImageCycle = () => {
		clearInterval(intervalId)
		setImageIndex(0)
	}

	useEffect(() => {
		return () => clearInterval(intervalId) // Cleanup on unmount
	}, [intervalId])

	return (
		<img
			src={carouselImages[imageIndex] || fallbackProductImage}
			alt="Product"
			className={className}
			onMouseEnter={startImageCycle}
			onMouseLeave={stopImageCycle}
		/>
	)
}

export default ImageCarousel

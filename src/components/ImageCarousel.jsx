import { useState, useEffect } from 'react'

const ImageCarousel = ({ images, className }) => {
	const [imageIndex, setImageIndex] = useState(0)
	const [intervalId, setIntervalId] = useState(null)

	const startImageCycle = () => {
		if (!images || images.length === 0) return
		const interval = setInterval(() => {
			setImageIndex((prev) => (prev + 1) % images.length)
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
			src={images?.[imageIndex] || ''}
			alt="Product"
			className={className}
			onMouseEnter={startImageCycle}
			onMouseLeave={stopImageCycle}
		/>
	)
}

export default ImageCarousel

import { useState } from 'react'

const ProductImages = ({ product }) => {
	const [selectedImage, setSelectedImage] = useState(null)

	return (
		<>
			<div className="w-full md:w-3/5 grid grid-cols-2 gap-4">
				{product?.image_URL.map((image, index) => (
					<img
						key={index}
						src={image}
						alt={`Product ${index + 1}`}
						className="w-full h-auto rounded-lg shadow-md cursor-pointer transition-transform hover:scale-105"
						onClick={() => setSelectedImage(image)} // Open modal on click
					/>
				))}
			</div>

			{/* Zoomed Image Modal */}
			{selectedImage && (
				<div
					className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
					onClick={() => setSelectedImage(null)} // Close modal on background click
				>
					<div className="relative p-4">
						<img
							src={selectedImage}
							alt="Zoomed Product"
							className="max-w-full max-h-[90vh] rounded-lg shadow-lg"
						/>
						<button
							className="absolute top-2 right-2 bg-gray-800 text-white p-2 rounded-full"
							onClick={() => setSelectedImage(null)} // Close button
						>
							✕
						</button>
					</div>
				</div>
			)}
		</>
	)
}

export default ProductImages

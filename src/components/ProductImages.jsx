import { useEffect, useState } from 'react'
import { X, ZoomIn } from 'lucide-react'

const ProductImages = ({ product }) => {
	const images = product?.image_URL ?? []
	const [activeIndex, setActiveIndex] = useState(0)
	const [zoomed, setZoomed] = useState(false)

	useEffect(() => {
		setActiveIndex(0)
	}, [product?.product_id])

	const activeImage = images[activeIndex]

	return (
		<>
			<div className="w-full min-w-0">
				<div className="relative overflow-hidden border border-[#e7ded6] bg-[#eee9e2] shadow-[0_28px_80px_rgba(43,33,29,0.08)]">
					<button
						type="button"
						onClick={() => activeImage && setZoomed(true)}
						className="group block w-full cursor-zoom-in"
						aria-label="Zoom image"
					>
						<div className="aspect-[4/5] w-full md:aspect-[5/4] xl:aspect-[6/5]">
							{activeImage ? (
								<img
									src={activeImage}
									alt={product?.name ?? 'Product image'}
									className="h-full w-full object-contain p-5 transition-transform duration-700 ease-out group-hover:scale-[1.025] md:p-8"
								/>
							) : (
								<div className="h-full w-full animate-pulse bg-[#e8e0d8]" />
							)}
						</div>
					</button>

					{images.length > 0 && (
						<div className="pointer-events-none absolute left-4 top-4 border border-white/70 bg-white/80 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-[#6f625b] backdrop-blur md:left-6 md:top-6">
							{String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
						</div>
					)}

					<div className="pointer-events-none absolute bottom-4 right-4 hidden h-10 w-10 items-center justify-center border border-white/60 bg-[#211916]/85 text-[#fbfaf8] backdrop-blur sm:flex md:bottom-6 md:right-6">
						<ZoomIn className="h-4 w-4" strokeWidth={1.4} />
					</div>
				</div>

				{images.length > 1 && (
					<div className="mt-4 flex gap-3 overflow-x-auto pb-1">
						{images.map((image, index) => {
							const isActive = index === activeIndex
							return (
								<button
									key={index}
									type="button"
									onClick={() => setActiveIndex(index)}
									aria-label={`Show image ${index + 1}`}
									className={`relative h-24 w-20 shrink-0 overflow-hidden border bg-[#eee9e2] transition duration-200 md:h-28 md:w-24 ${
										isActive
											? 'border-[#211916]'
											: 'border-[#e7ded6] opacity-70 hover:border-[#bda28f] hover:opacity-100'
									}`}
								>
									<img
										src={image}
										alt=""
										className="h-full w-full object-cover"
									/>
								</button>
							)
						})}
					</div>
				)}
			</div>

			{zoomed && activeImage && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center bg-[#211916]/85 p-6 backdrop-blur-sm"
					onClick={() => setZoomed(false)}
					role="dialog"
					aria-modal="true"
				>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							setZoomed(false)
						}}
						className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center border border-white/20 text-[#fbfaf8] transition-colors hover:bg-white/10"
						aria-label="Close"
					>
						<X size={20} />
					</button>
					<img
						src={activeImage}
						alt={product?.name ?? 'Product image'}
						className="max-h-[90vh] max-w-full object-contain"
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			)}
		</>
	)
}

export default ProductImages

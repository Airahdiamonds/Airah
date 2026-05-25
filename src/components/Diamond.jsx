import { useDispatch, useSelector } from 'react-redux'
import {
	setShowDiamond,
	setStep,
	updateDiamondDetails,
	setImageURLs,
} from '../redux/ringCustomizationSlice'
import { useEffect, useState } from 'react'
import { ChevronLeft, ShieldCheck, Truck } from 'lucide-react'
import { getDiamond } from '../utils/api'
import PriceDisplay from './PriceDisplay'

function Diamond() {
	const dispatch = useDispatch()
	const { productDetails } = useSelector((state) => state.ringCustomization)
	const [product, setProduct] = useState(null)
	const [activeTab, setActiveTab] = useState('diamond')

	useEffect(() => {
		getDiamond(productDetails[0].diamond?.product_id).then((res) => {
			setProduct(res.data[0])
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleClick = () => {
		dispatch(
			updateDiamondDetails({
				diamond_price: +product.price,
			})
		)
		dispatch(setImageURLs(product?.image_URL))
		dispatch(setStep(2))
	}

	const detailRows = [
		['Shape', product?.shape],
		['Carat', product?.size ? `${product.size}ct` : null],
		['Color', product?.color],
		['Clarity', product?.clarity],
		['Cut', product?.cut],
		['SKU', product?.SKU],
	]

	return (
		<div className="space-y-8">
			<button
				type="button"
				className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#8a7b72] transition hover:text-[#211916]"
				onClick={() => dispatch(setShowDiamond(false))}
			>
				<ChevronLeft size={16} />
				Back to diamonds
			</button>

			<div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.55fr)]">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{product?.image_URL?.map((image, index) => (
						<div
							key={`${image}-${index}`}
							className="aspect-square overflow-hidden rounded-[6px] border border-[#e4ded7] bg-white"
						>
							<img
								src={image}
								alt={product?.name ?? 'Diamond'}
								className="h-full w-full object-cover"
							/>
						</div>
					))}
				</div>

				<aside className="self-start rounded-[6px] border border-[#e4ded7] bg-white p-6 shadow-[0_24px_55px_rgba(33,25,22,0.08)] lg:sticky lg:top-32">
					<p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8779]">
						Selected Diamond
					</p>
					<h2 className="mt-3 text-3xl font-light leading-tight tracking-wide text-[#211916]">
						{product?.name}
					</h2>
					<p className="mt-3 text-sm text-[#6f625b]">
						{product?.size} carat center stone
					</p>

					<div className="mt-6 border-y border-[#eee7df] py-5">
						<p className="text-[11px] uppercase tracking-[0.18em] text-[#9a8779]">
							Diamond price
						</p>
						<div className="mt-2 text-2xl font-light text-[#211916]">
							<PriceDisplay value={product?.price} />
						</div>
					</div>

					<div className="mt-5 grid grid-cols-2 gap-3 text-sm">
						{detailRows
							.filter(([, value]) => value)
							.map(([label, value]) => (
								<div key={label} className="rounded-[4px] bg-[#f8f7f4] px-3 py-3">
									<p className="text-[10px] uppercase tracking-[0.18em] text-[#9a8779]">
										{label}
									</p>
									<p className="mt-1 text-[#211916]">{value}</p>
								</div>
							))}
					</div>

					<button
						type="button"
						onClick={handleClick}
						className="mt-6 h-14 w-full rounded-[4px] bg-[#211916] px-6 text-sm uppercase tracking-[0.18em] text-white transition hover:bg-[#3a2d27]"
					>
						Select this diamond
					</button>

					<div className="mt-5 space-y-3 border-t border-[#eee7df] pt-5 text-sm text-[#5f5550]">
						<div className="flex items-center gap-3">
							<ShieldCheck size={18} className="text-[#9a8779]" />
							<span>Certified quality review</span>
						</div>
						<div className="flex items-center gap-3">
							<Truck size={18} className="text-[#9a8779]" />
							<span>Complimentary insured shipping</span>
						</div>
					</div>
				</aside>
			</div>

			<section className="rounded-[6px] border border-[#e4ded7] bg-white p-6">
				<div className="flex flex-wrap gap-2 border-b border-[#eee7df] pb-4">
					{[
						['diamond', 'Diamond details'],
						['notes', 'Description'],
					].map(([tab, label]) => (
						<button
							type="button"
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={`rounded-[4px] px-4 py-2 text-xs uppercase tracking-[0.16em] transition ${
								activeTab === tab
									? 'bg-[#211916] text-white'
									: 'bg-[#f8f7f4] text-[#6f625b] hover:text-[#211916]'
							}`}
						>
							{label}
						</button>
					))}
				</div>

				{activeTab === 'diamond' && (
					<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{detailRows
							.filter(([, value]) => value)
							.map(([label, value]) => (
								<div key={label} className="flex justify-between border-b border-[#eee7df] py-3 text-sm">
									<span className="text-[#8a7b72]">{label}</span>
									<span className="text-[#211916]">{value}</span>
								</div>
							))}
					</div>
				)}

				{activeTab === 'notes' && (
					<p className="mt-5 max-w-3xl text-sm leading-7 text-[#5f5550]">
						{product?.description}
					</p>
				)}
			</section>
		</div>
	)
}

export default Diamond
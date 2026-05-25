import { useDispatch, useSelector } from 'react-redux'
import {
	setShowRing,
	setStep,
	updateRingDetails,
	setImageURLs,
} from '../redux/ringCustomizationSlice'
import { useEffect, useState } from 'react'
import { ChevronLeft, Settings2, ShieldCheck, Truck } from 'lucide-react'
import { getCustomStyle } from '../utils/api'
import { calculateRingTotal, headStyles, metals, shankStyles } from '../utils/helpers'
import { useLocation } from 'react-router-dom'
import PriceDisplay from './PriceDisplay'

function Ring() {
	const dispatch = useDispatch()
	const { state } = useLocation()
	const { productDetails } = useSelector((state) => state.ringCustomization)
	const [product, setProduct] = useState(null)
	const [showFilters, setShowFilters] = useState(false)
	const [activeTab, setActiveTab] = useState('setting')
	const selectedRing = productDetails[0].ring

	useEffect(() => {
		if (state) {
			setProduct(state)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (state === null) {
			if (productDetails.length > 0 && productDetails[0].ring) {
				getCustomStyle({
					head_style: selectedRing.headStyle,
					head_metal: selectedRing.headMetal,
					shank_style: selectedRing.shankStyle,
					shank_metal: selectedRing.shankMetal,
				}).then((res) => {
					setProduct(res[0])
				})
			}
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [productDetails])

	const handleClick = () => {
		dispatch(
			updateRingDetails({
				ring_price: calculateRingTotal(product),
			})
		)
		dispatch(setImageURLs(product?.image_URL))
		if (productDetails[0].diamond.product_id === null) {
			dispatch(setStep(1))
		} else {
			dispatch(setStep(3))
		}
	}

	const optionGroups = [
		{
			title: 'Head style',
			value: selectedRing.headStyle,
			items: headStyles,
			onSelect: (styleName) => dispatch(updateRingDetails({ headStyle: styleName })),
		},
		{
			title: 'Head metal',
			value: selectedRing.headMetal,
			items: metals,
			onSelect: (metalName) => dispatch(updateRingDetails({ headMetal: metalName })),
		},
		{
			title: 'Shank style',
			value: selectedRing.shankStyle,
			items: shankStyles,
			onSelect: (styleName) => dispatch(updateRingDetails({ shankStyle: styleName })),
		},
		{
			title: 'Shank metal',
			value: selectedRing.shankMetal,
			items: metals,
			onSelect: (metalName) => dispatch(updateRingDetails({ shankMetal: metalName })),
		},
	]

	const detailRows = [
		['Head', product?.head_style ?? selectedRing.headStyle],
		['Head metal', product?.head_metal ?? selectedRing.headMetal],
		['Shank', product?.shank_style ?? selectedRing.shankStyle],
		['Shank metal', product?.shank_metal ?? selectedRing.shankMetal],
		['SKU', product?.SKU],
	]

	return (
		<div className="space-y-8">
			<button
				type="button"
				className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#8a7b72] transition hover:text-[#211916]"
				onClick={() => dispatch(setShowRing(false))}
			>
				<ChevronLeft size={16} />
				Back to settings
			</button>

			<div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(380px,0.55fr)]">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{product?.image_URL?.map((image, index) => (
						<div
							key={`${image}-${index}`}
							className="aspect-square overflow-hidden rounded-[6px] border border-[#e4ded7] bg-white"
						>
							<img
								src={image}
								alt={product?.name ?? 'Ring setting'}
								className="h-full w-full object-cover"
							/>
						</div>
					))}
				</div>

				<aside className="self-start rounded-[6px] border border-[#e4ded7] bg-white p-6 shadow-[0_24px_55px_rgba(33,25,22,0.08)] lg:sticky lg:top-32">
					<p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8779]">
						Selected Setting
					</p>
					<h2 className="mt-3 text-3xl font-light leading-tight tracking-wide text-[#211916]">
						{product?.name}
					</h2>

					<div className="mt-6 border-y border-[#eee7df] py-5">
						<p className="text-[11px] uppercase tracking-[0.18em] text-[#9a8779]">
							Setting price
						</p>
						<div className="mt-2 text-2xl font-light text-[#211916]">
							<PriceDisplay value={calculateRingTotal(product)} />
						</div>
					</div>

					<div className="mt-5 grid gap-2 text-sm">
						{detailRows
							.filter(([, value]) => value)
							.map(([label, value]) => (
								<div key={label} className="flex justify-between border-b border-[#eee7df] py-3">
									<span className="text-[#8a7b72]">{label}</span>
									<span className="text-right text-[#211916]">{value}</span>
								</div>
							))}
					</div>

					{!showFilters && (
						<button
							type="button"
							onClick={() => setShowFilters(true)}
							className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[4px] border border-[#211916] bg-white px-5 text-xs uppercase tracking-[0.18em] text-[#211916] transition hover:bg-[#211916] hover:text-white"
						>
							<Settings2 size={15} />
							Customize style
						</button>
					)}

					<button
						type="button"
						onClick={handleClick}
						className="mt-3 h-14 w-full rounded-[4px] bg-[#211916] px-6 text-sm uppercase tracking-[0.18em] text-white transition hover:bg-[#3a2d27]"
					>
						Select this setting
					</button>

					<div className="mt-5 space-y-3 border-t border-[#eee7df] pt-5 text-sm text-[#5f5550]">
						<div className="flex items-center gap-3">
							<ShieldCheck size={18} className="text-[#9a8779]" />
							<span>Risk-free retail inspection</span>
						</div>
						<div className="flex items-center gap-3">
							<Truck size={18} className="text-[#9a8779]" />
							<span>Complimentary insured shipping</span>
						</div>
					</div>
				</aside>
			</div>

			{showFilters && (
				<section className="rounded-[6px] border border-[#e4ded7] bg-white p-6">
					<div className="mb-5 flex flex-col justify-between gap-3 border-b border-[#eee7df] pb-4 sm:flex-row sm:items-end">
						<div>
							<p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8779]">
								Customize
							</p>
							<h3 className="text-2xl font-light tracking-wide text-[#211916]">
								Refine this setting
							</h3>
						</div>
						<button
							type="button"
							onClick={() => setShowFilters(false)}
							className="text-xs uppercase tracking-[0.18em] text-[#8a7b72] transition hover:text-[#211916]"
						>
							Done
						</button>
					</div>

					<div className="grid gap-6 lg:grid-cols-2">
						{optionGroups.map((group) => (
							<div key={group.title}>
								<h4 className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#211916]">
									{group.title}
								</h4>
								<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
									{group.items.map((item) => {
										const selected = group.value === item.name

										return (
											<button
												type="button"
												key={item.name}
												onClick={() => group.onSelect(item.name)}
												className={`min-h-24 rounded-[4px] border px-3 py-3 text-center text-xs uppercase tracking-[0.12em] transition ${
													selected
														? 'border-[#211916] bg-[#211916] text-white'
														: 'border-[#e4ded7] bg-[#f8f7f4] text-[#6f625b] hover:border-[#bda28f] hover:text-[#211916]'
												}`}
											>
												<img
													src={item.image}
													alt=""
													className="mx-auto mb-2 h-10 w-10 object-contain opacity-80"
												/>
												{item.name}
											</button>
										)
									})}
								</div>
							</div>
						))}
					</div>
				</section>
			)}

			<section className="rounded-[6px] border border-[#e4ded7] bg-white p-6">
				<div className="flex flex-wrap gap-2 border-b border-[#eee7df] pb-4">
					{[
						['setting', 'Setting details'],
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

				{activeTab === 'setting' && (
					<div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{detailRows
							.filter(([, value]) => value)
							.map(([label, value]) => (
								<div key={label} className="flex justify-between border-b border-[#eee7df] py-3 text-sm">
									<span className="text-[#8a7b72]">{label}</span>
									<span className="text-right text-[#211916]">{value}</span>
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

export default Ring
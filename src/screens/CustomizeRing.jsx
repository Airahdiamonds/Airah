import { useDispatch, useSelector } from 'react-redux'
import StepOne from '../components/CustomizeRing/StepOne'
import StepTwo from '../components/CustomizeRing/StepTwo'
import StepThree from '../components/CustomizeRing/StepThree'
import Image from '../assets/ring4.jpg'
import { Check, Gem, Settings, ShoppingBag, X } from 'lucide-react'
import {
	resetDiamond,
	resetRing,
	setShowDiamond,
	setShowRing,
	setStep,
} from '../redux/ringCustomizationSlice'
import PriceDisplay from '../components/PriceDisplay'

const CustomizeRing = () => {
	const dispatch = useDispatch()
	const { step, productDetails } = useSelector(
		(state) => state.ringCustomization
	)
	const activeProduct = productDetails[0]
	const diamondPreview = activeProduct.diamond?.product_id
	const ringPreview = activeProduct.ring?.product_id
	const selectedDiamond = activeProduct.diamond?.diamond_price
	const selectedRing = activeProduct.ring?.ring_price
	const computedTotal = Number(selectedDiamond ?? 0) + Number(selectedRing ?? 0)
	const isComplete = selectedDiamond && selectedRing
	const steps = [
		{
			id: 1,
			title: 'Choose a Diamond',
			eyebrow: 'Diamond',
			icon: Gem,
			hasPreview: diamondPreview,
			selected: selectedDiamond,
			price: productDetails[0].diamond?.diamond_price ? (
				<PriceDisplay value={productDetails[0].diamond.diamond_price} />
			) : (
				'Pending'
			),
			remove: () => {
				dispatch(resetDiamond())
				dispatch(setShowDiamond(false))
				dispatch(setStep(1))
			},
		},
		{
			id: 2,
			title: 'Choose a Setting',
			eyebrow: 'Setting',
			icon: Settings,
			hasPreview: ringPreview,
			selected: selectedRing,
			price: productDetails[0].ring?.ring_price ? (
				<PriceDisplay value={productDetails[0].ring.ring_price} />
			) : (
				'Pending'
			),
			remove: () => {
				dispatch(resetRing())
				dispatch(setShowRing(false))
				dispatch(setStep(2))
			},
		},
		{
			id: 3,
			title: 'Complete a Ring',
			eyebrow: 'Review',
			icon: ShoppingBag,
			selected: isComplete,
			price: productDetails[0].total_cost ? (
				<PriceDisplay value={productDetails[0].total_cost} />
			) : (
				'Awaiting selections'
			),
		},
	]

	return (
		<div className="min-h-screen bg-[#f7f7f5] text-[#211916]">
			<section className="border-b border-[#e4ded7] bg-white">
				<div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
					<div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
						<div>
							<p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#9a8779]">
								Bespoke Builder
							</p>
							<h1 className="mt-3 text-3xl font-light tracking-wide text-[#211916] md:text-4xl">
								Create your engagement ring
							</h1>
						</div>
						<div className="min-w-[220px] border-l border-[#e4ded7] pl-5 md:text-right">
							<p className="text-[11px] uppercase tracking-[0.22em] text-[#9a8779]">
								Current total
							</p>
							<div className="mt-1 text-xl font-light text-[#211916]">
								{computedTotal > 0 ? (
									<PriceDisplay value={computedTotal} />
								) : (
									<span>Pending</span>
								)}
							</div>
						</div>
					</div>

					<div className="grid gap-3 md:grid-cols-3">
						{steps.map((currentStep, index) => {
							const isActive = currentStep.id === step
							const isCompleted = Boolean(currentStep.selected)
							const Icon = currentStep.icon

							return (
								<div
									key={currentStep.id}
									className={`relative overflow-hidden rounded-[6px] border bg-white transition duration-300 ${
										isActive
											? 'border-[#211916] shadow-[0_22px_50px_rgba(33,25,22,0.10)]'
											: 'border-[#e4ded7] hover:border-[#bda28f]'
									}`}
								>
									<button
										type="button"
										onClick={() => dispatch(setStep(currentStep.id))}
										className="flex min-h-[128px] w-full items-stretch text-left"
									>
										<div className={`flex w-16 flex-col items-center justify-between border-r px-3 py-4 ${isActive ? 'border-[#211916] bg-[#211916] text-white' : 'border-[#e4ded7] text-[#9a8779]'}`}>
											<span className="text-[11px] uppercase tracking-[0.18em]">
												0{currentStep.id}
											</span>
											<span className="flex h-8 w-8 items-center justify-center rounded-full border border-current">
												{isCompleted ? <Check size={15} /> : <Icon size={15} />}
											</span>
										</div>

										<div className="flex flex-1 items-center justify-between gap-4 p-4">
											<div className="min-w-0">
												<p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#9a8779]">
													{currentStep.eyebrow}
												</p>
												<h2 className="mt-2 text-base font-medium text-[#211916]">
													{currentStep.title}
												</h2>
												<div className="mt-3 text-sm text-[#5f5550]">
													{currentStep.price}
												</div>
											</div>
											<img
												src={Image}
												alt=""
												className="hidden h-20 w-20 shrink-0 object-cover opacity-90 sm:block"
											/>
										</div>
									</button>

									{currentStep.id !== 3 && (
										<div className="flex items-center justify-between border-t border-[#eee7df] px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-[#8a7b72]">
											<button
												type="button"
												onClick={() => dispatch(setStep(currentStep.id))}
												className="transition hover:text-[#211916]"
											>
												View
											</button>
											{currentStep.hasPreview && (
												<button
													type="button"
													onClick={currentStep.remove}
													className="inline-flex items-center gap-1 transition hover:text-[#211916]"
												>
													<X size={12} />
													Remove
												</button>
											)}
										</div>
									)}

									{index < steps.length - 1 && (
										<div className="absolute right-0 top-0 hidden h-full w-px bg-[#e4ded7] md:block" />
									)}
								</div>
							)
						})}
					</div>
				</div>
			</section>

			<div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
				{step === 1 && <StepOne />}
				{step === 2 && <StepTwo />}
				{step === 3 && <StepThree />}
			</div>
		</div>
	)
}

export default CustomizeRing

import { useDispatch, useSelector } from 'react-redux'
import StepOne from '../components/CustomizeRing/StepOne'
import StepTwo from '../components/CustomizeRing/StepTwo'
import StepThree from '../components/CustomizeRing/StepThree'
import Image from '../assets/ring4.jpg'
import {
	resetDiamond,
	resetRing,
	setShowDiamond,
	setShowRing,
	setStep,
} from '../redux/ringCustomizationSlice'
import { convertPrice } from '../utils/helpers'

const CustomizeRing = () => {
	const dispatch = useDispatch()
	const { step, productDetails } = useSelector(
		(state) => state.ringCustomization
	)
	const { currency, country, INR_rate, GBP_rate } = useSelector(
		(state) => state.localization
	)

	const steps = [
		{
			id: 1,
			title: 'Choose a Diamond',
			price:
				currency +
				(productDetails[0].diamond?.diamond_price === null
					? 0
					: convertPrice(
							productDetails[0].diamond?.diamond_price,
							country,
							INR_rate,
							GBP_rate
					  )),
			remove: () => {
				dispatch(resetDiamond())
				dispatch(setShowDiamond(false))
				dispatch(setStep(1))
			},
		},
		{
			id: 2,
			title: 'Choose a Setting',
			price:
				currency +
				(productDetails[0].ring?.ring_price === null
					? 0
					: convertPrice(
							productDetails[0].ring?.ring_price,
							country,
							INR_rate,
							GBP_rate
					  )),
			remove: () => {
				dispatch(resetRing())
				dispatch(setShowRing(false))
				dispatch(setStep(2))
			},
		},
		{
			id: 3,
			title: 'Complete a Ring',
			price:
				currency +
				(productDetails[0].total_cost === null
					? 0
					: convertPrice(
							productDetails[0].total_cost,
							country,
							INR_rate,
							GBP_rate
					  )),
		},
	]

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<div className="w-[96%] border border-gray-300 mt-10 h-[100px] mx-auto flex">
				{steps.map((step) => (
					<div
						key={step.id}
						className="w-1/3 h-full border-r border-gray-300 flex items-center justify-between p-4 last:border-r-0"
					>
						<div className="flex items-center">
							<span className="text-3xl mr-4">{step.id}</span>
							<span className="text-sm font-medium">{step.title}</span>
						</div>
						<div className="flex items-center space-x-2">
							<div className="flex flex-col items-center">
								<span className="text-sm">{step.price}</span>
								{step.id !== 3 && (
									<div className="flex space-x-2">
										<button
											onClick={() => dispatch(setStep(step.id))}
											className="text-xs"
										>
											View
										</button>
										<button onClick={step.remove} className="text-xs">
											Remove
										</button>
									</div>
								)}
							</div>
							<img src={Image} alt="something" className="h-20 w-20" />
						</div>
					</div>
				))}
			</div>
			<div className="container items-center p-6" style={{ maxWidth: '100%' }}>
				{step === 1 && <StepOne />}
				{step === 2 && <StepTwo />}
				{step === 3 && <StepThree />}
			</div>
		</div>
	)
}

export default CustomizeRing

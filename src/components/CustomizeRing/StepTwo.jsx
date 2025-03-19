import { useSelector } from 'react-redux'
import Ring from '../Ring'
import RingGrid from '../RingGrid'

const StepTwo = () => {
	const { showRing } = useSelector((state) => state.ringCustomization)

	return (
		<>
			{showRing ? (
				<>
					<Ring />
				</>
			) : (
				<>
					<RingGrid />
				</>
			)}
		</>
	)
}

export default StepTwo

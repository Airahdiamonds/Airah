import { useSelector } from 'react-redux'
import DiamondGrid from '../DiamondGrid'
import Diamond from '../Diamond'

const StepOne = () => {
	const { showDiamond } = useSelector((state) => state.ringCustomization)

	return (
		<>
			{showDiamond ? (
				<>
					<Diamond />
				</>
			) : (
				<>
					<DiamondGrid />
				</>
			)}
		</>
	)
}

export default StepOne

import { useSelector } from 'react-redux'
import { convertPrice } from '../utils/helpers'

const PriceDisplay = ({ value, className = '' }) => {
	const {
		currency,
		country,
		USD_rate,
		GBP_rate,
		AUD_rate,
		OMR_rate,
		AED_rate,
		EUR_rate,
	} = useSelector((state) => state.localization)

	const converted = convertPrice(
		Number(value ?? 0),
		country,
		USD_rate,
		GBP_rate,
		AUD_rate,
		OMR_rate,
		AED_rate,
		EUR_rate
	)

	return <span className={className}>{currency}{converted.toFixed(2)}</span>
}

export default PriceDisplay

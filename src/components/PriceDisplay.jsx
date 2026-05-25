import { useSelector } from 'react-redux'
import { convertPrice } from '../utils/helpers'

const PriceDisplay = ({ value, className = '', fractionDigits = 2 }) => {
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

	const formattedPrice = converted.toLocaleString(undefined, {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	})

	return <span className={className}>{currency}{formattedPrice}</span>
}

export default PriceDisplay

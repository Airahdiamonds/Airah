export const convertFormData = (data) => {
	const updatedData = { ...data }

	Object.keys(updatedData).forEach((key) => {
		if (
			key.includes('quantity') ||
			key.includes('price') ||
			key.includes('total') ||
			key.includes('cost')
		) {
			updatedData[key] =
				updatedData[key] === '' || updatedData[key] === null
					? null
					: parseFloat(updatedData[key])
		}
	})

	return updatedData
}

export const formatDate = (date) => {
	const newDate = new Date(date)
	const formattedDate = newDate.toLocaleDateString('en-GB')
	return formattedDate
}

export const productJson = {
	name: '',
	SKU: '',
	category: 'ring',
	description: '',
	image_URL: [],
	status: 'active',
	source: 'natural',
	shape: '',
	cut: '',
	color: '',
	clarity: '',
	carat: '',
	diamond_price: '',
	head_style: '',
	head_style_price: '',
	head_metal: '',
	head_metal_price: '',
	shank_style: '',
	shank_style_price: '',
	shank_metal: '',
	shank_metal_price: '',
	total_cost: '',
}

export const diamondJson = {
	name: '',
	SKU: '',
	description: '',
	image_URL: [],
	size: '0.5',
	shape: 'round',
	cut: 'regular',
	color: 'D',
	clarity: 'IF',
	price: '',
}

export const stylesJson = {
	name: '',
	SKU: '',
	description: '',
	image_URL: [],
	head_style: 'Four Prong',
	head_style_price: '',
	head_metal: '14K White Gold',
	head_metal_price: '',
	shank_style: 'Solitaire',
	shank_style_price: '',
	shank_metal: '14K White Gold',
	shank_metal_price: '',
}

export const convertPrice = (price, country, INR_rate, GBP_rate) => {
	switch (country) {
		case 'INR':
			return price * INR_rate
		case 'GBP':
			return price * GBP_rate
		case 'USD':
			return price
		default:
			return price
	}
}

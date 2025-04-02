// Import images for headStyles
import headFourProng from '../assets/head/h02.png'
import headSixProng from '../assets/head/h03.png'
import headClassicBasket from '../assets/head/h04.png'
import headSurpriseDiamond from '../assets/head/h05.png'
import headSurpriseSapphire from '../assets/head/h06.png'
import headLotusBasket from '../assets/head/h07.png'
import headTulipBasket from '../assets/head/h08.png'
import headScallopedSixProng from '../assets/head/h09.png'
import headVintageBasket from '../assets/head/h10.png'
import headPaveHalo from '../assets/head/h11.png'
import headSapphireHalo from '../assets/head/h12.png'
import headFrenchPaveHalo from '../assets/head/h13.png'
import headFallingEdgeHalo from '../assets/head/h14.png'

// Import images for metals
import whiteGoldSVG from '../assets/metal/14K_White_Gold.svg'
import yellowGoldSVG from '../assets/metal/14K_Yellow_Gold.svg'
import roseGoldSVG from '../assets/metal/14K_Rose_Gold.svg'
import platinumSVG from '../assets/metal/Platinum.svg'

// Import images for shankStyles
import shankSolitaire from '../assets/shank/s01_C.png'
import shankFrenchPave from '../assets/shank/s02_C.png'
import shankUShapedPave from '../assets/shank/s03_C.png'
import shankKnifeEdgePave from '../assets/shank/s04_C.png'
import shankKnifeEdgeSolitaire from '../assets/shank/s05_C.png'
import shankMarquiseDiamond from '../assets/shank/s06_C.png'
import shankMarquiseSaphire from '../assets/shank/s07_C.png'
import shankCathedralPave from '../assets/shank/s08_C.png'
import shankRopeSolitaire from '../assets/shank/s09_C.png'
import shankRopePave from '../assets/shank/s10_C.png'
import shankSleekAccent from '../assets/shank/s11_C.png'
import shankChannelSet from '../assets/shank/s12_C.png'

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

export const convertPrice = (
	price,
	country,
	USD_rate,
	GBP_rate,
	AUD_rate,
	OMR_rate,
	AED_rate,
	EUR_rate
) => {
	console.log(
		price,
		country,
		USD_rate,
		GBP_rate,
		AUD_rate,
		OMR_rate,
		AED_rate,
		EUR_rate
	)
	switch (country) {
		case 'INR':
			return price
		case 'GBP':
			return price * GBP_rate
		case 'USD':
			return price * USD_rate
		case 'AUD':
			return price * AUD_rate
		case 'AED':
			return price * AED_rate
		case 'OMR':
			return price * OMR_rate
		case 'EUR':
			return price * EUR_rate
		default:
			return price
	}
}

// switch (country) {
// 	case 'INR':
// 		return price * INR_rate
// 	case 'GBP':
// 		return price * GBP_rate
// 	case 'USD':
// 		return price
// 	case 'AUD':
// 		return price * AUD_rate
// 	case 'AED':
// 		return price * AED_rate
// 	case 'OMR':
// 		return price * OMR_rate
// 	case 'EUR':
// 		return price * EUR_rate
// 	default:
// 		return price
// }

export const headStyles = [
	{ name: 'Four Prong', image: headFourProng },
	{ name: 'Six Prong', image: headSixProng },
	{ name: 'Classic Basket', image: headClassicBasket },
	{ name: 'Surprise Diamond', image: headSurpriseDiamond },
	{ name: 'Surprise Sapphire', image: headSurpriseSapphire },
	{ name: 'Lotus Basket', image: headLotusBasket },
	{ name: 'Tulip Basket', image: headTulipBasket },
	{ name: 'Scalloped Six Prong', image: headScallopedSixProng },
	{ name: 'Vintage Basket', image: headVintageBasket },
	{ name: 'Pave Halo', image: headPaveHalo },
	{ name: 'Sapphire Halo', image: headSapphireHalo },
	{ name: 'French Pave Halo', image: headFrenchPaveHalo },
	{ name: 'Falling Edge Halo', image: headFallingEdgeHalo },
]

export const metals = [
	{ name: '14K White Gold', image: whiteGoldSVG },
	{ name: '14K Yellow Gold', image: yellowGoldSVG },
	{ name: '14K Rose Gold', image: roseGoldSVG },
	{ name: 'Platinum', image: platinumSVG },
]

export const shankStyles = [
	{ name: 'Solitaire', image: shankSolitaire },
	{ name: 'French Pave', image: shankFrenchPave },
	{ name: 'U Shaped Pave', image: shankUShapedPave },
	{ name: 'Knife Edge Pave', image: shankKnifeEdgePave },
	{ name: 'Knife Edge Solitaire', image: shankKnifeEdgeSolitaire },
	{ name: 'Marquise Diamond', image: shankMarquiseDiamond },
	{ name: 'Marquise Saphire', image: shankMarquiseSaphire },
	{ name: 'Cathedral Pave', image: shankCathedralPave },
	{ name: 'Rope Solitaire', image: shankRopeSolitaire },
	{ name: 'Rope Pave', image: shankRopePave },
	{ name: 'Sleek Accent', image: shankSleekAccent },
	{ name: 'Channel Set', image: shankChannelSet },
]

export const menuItems = [
	{
		name: 'Rings',
		submenu: [
			{
				heading: 'Rings',
				items: [
					{ name: 'Stackable Rings', link: '/product/Stackable%20Rings' },
					{ name: 'Birthstone Rings', link: '/product/Birthstone%20Rings' },
					{ name: 'Eternity Rings', link: '/rings/Eternity%20Rings' },
					{ name: 'Fashion Rings', link: '/rings/Fashion%20Rings' },
				],
			},
			{
				heading: 'Ready-to-Ship',
				items: [
					{
						name: 'Ready to Ship Engagement Rings',
						link: '/product/Stackable%20Rings',
					},
					{
						name: 'Preset Diamond Engagement Rings',
						link: '/product/Birthstone%20Rings',
					},
				],
			},
			{
				heading: 'Popular Styles',
				items: [
					{
						name: 'Round Cut Rings',
						link: '/product/Stackable%20Rings',
					},
					{
						name: 'Princess Cut Rings',
						link: '/product/Birthstone%20Rings',
					},
					{
						name: 'Cushion Cut Rings',
						link: '/product/Birthstone%20Rings',
					},
					{
						name: 'Explore Mens Engagement Rings',
						link: '/product/Birthstone%20Rings',
					},
					{
						name: 'Top Engagement Rings',
						link: '/product/Birthstone%20Rings',
					},
				],
			},
			{
				heading: 'Engagement Ring Styles',
				items: [
					{ name: 'Solitaire', link: '/product/Stackable%20Rings' },
					{ name: 'Pavé', link: '/product/Birthstone%20Rings' },
					{ name: 'Channel-Set', link: '/rings/Eternity%20Rings' },
					{ name: 'Side-Stone', link: '/rings/Fashion%20Rings' },
					{ name: 'Bezel', link: '/rings/Fashion%20Rings' },
					{ name: 'Hidden Halo', link: '/rings/Fashion%20Rings' },
					{ name: 'Cluster', link: '/rings/Fashion%20Rings' },
					{ name: 'Three-Stone', link: '/rings/Fashion%20Rings' },
				],
			},
			{
				heading: 'More Styles',
				items: [
					{ name: 'Tension', link: '/product/Stackable%20Rings' },
					{ name: 'Floral', link: '/product/Birthstone%20Rings' },
					{ name: 'Tiara', link: '/rings/Eternity%20Rings' },
					{ name: 'Vintage', link: '/rings/Fashion%20Rings' },
					{ name: 'Unique', link: '/rings/Fashion%20Rings' },
					{ name: 'Cathedral', link: '/rings/Fashion%20Rings' },
					{ name: 'Cluster', link: '/rings/Fashion%20Rings' },
				],
			},
			{
				heading: 'Shop by Metal',
				items: [
					{ name: 'Rose Gold', link: '/product/Stackable%20Rings' },
					{ name: 'White Gold', link: '/product/Stackable%20Rings' },
					{ name: 'Yellow Gold', link: '/product/Stackable%20Rings' },
					{ name: 'Platinum', link: '/product/Stackable%20Rings' },
				],
			},
		],
	},
	{
		name: 'Fine Jewelry',
		submenu: [
			{
				heading: 'Earrings',
				items: [
					{ name: 'Stud Earrings', link: '/earrings/Stud%20Earrings' },
					{ name: 'Hoop Earrings', link: '/earrings/Hoop%20Earrings' },
					{ name: 'Drop Earrings', link: '/earrings/Drop%20Earrings' },
					{
						name: 'Chandelier Earrings',
						link: '/earrings/Chandelier%20Earrings',
					},
				],
			},
			{
				heading: 'Bracelets',
				items: [
					{ name: 'Bangle Bracelets', link: '/bracelets/Bangle%20Bracelets' },
					{ name: 'Tennis Bracelets', link: '/bracelets/Tennis%20Bracelets' },
					{ name: 'Cuff Bracelets', link: '/bracelets/Cuff%20Bracelets' },
					{ name: 'Charm Bracelets', link: '/bracelets/Charm%20Bracelets' },
				],
			},
			{
				heading: 'Necklaces',
				items: [
					{ name: 'Pendant Necklaces', link: '/necklaces/Pendant%20Necklaces' },
					{ name: 'Choker Necklaces', link: '/necklaces/Choker%20Necklaces' },
					{ name: 'Lariat Necklaces', link: '/necklaces/Lariat%20Necklaces' },
					{
						name: 'Statement Necklaces',
						link: '/necklaces/Statement%20Necklaces',
					},
				],
			},
		],
	},
	{
		name: 'FAQ',
		submenu: [
			{
				heading: 'Orders & Shipping',
				items: [
					{
						name: 'Track Your Order',
						link: '/faq/orders-shipping/track-order',
					},
					{
						name: 'Shipping Policies',
						link: '/faq/orders-shipping/shipping-policies',
					},
					{
						name: 'International Shipping',
						link: '/faq/orders-shipping/international',
					},
				],
			},
			{
				heading: 'Returns & Exchanges',
				items: [
					{
						name: 'Return Policy',
						link: '/faq/returns-exchanges/return-policy',
					},
					{
						name: 'How to Return an Item',
						link: '/faq/returns-exchanges/how-to-return',
					},
					{
						name: 'Exchanges & Store Credit',
						link: '/faq/returns-exchanges/exchanges',
					},
				],
			},
			{
				heading: 'Payment & Financing',
				items: [
					{
						name: 'Accepted Payment Methods',
						link: '/faq/payment/accepted-methods',
					},
					{ name: 'Financing Options', link: '/faq/payment/financing' },
					{ name: 'Gift Cards', link: '/faq/payment/gift-cards' },
				],
			},
			{
				heading: 'Customization & Engraving',
				items: [
					{ name: 'Custom Jewelry', link: '/faq/customization/custom-jewelry' },
					{ name: 'Engraving Services', link: '/faq/customization/engraving' },
					{ name: 'Special Orders', link: '/faq/customization/special-orders' },
				],
			},
		],
	},
]

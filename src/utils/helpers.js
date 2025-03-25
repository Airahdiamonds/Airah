// Import images for headStyles
import headFourProng from '../assets/head/h02.png';
import headSixProng from '../assets/head/h03.png';
import headClassicBasket from '../assets/head/h04.png';
import headSurpriseDiamond from '../assets/head/h05.png';
import headSurpriseSapphire from '../assets/head/h06.png';
import headLotusBasket from '../assets/head/h07.png';
import headTulipBasket from '../assets/head/h08.png';
import headScallopedSixProng from '../assets/head/h09.png';
import headVintageBasket from '../assets/head/h10.png';
import headPaveHalo from '../assets/head/h11.png';
import headSapphireHalo from '../assets/head/h12.png';
import headFrenchPaveHalo from '../assets/head/h13.png';
import headFallingEdgeHalo from '../assets/head/h14.png';

// Import images for metals
import whiteGoldSVG from '../assets/metal/14K_White_Gold.svg';
import yellowGoldSVG from '../assets/metal/14K_Yellow_Gold.svg';
import roseGoldSVG from '../assets/metal/14K_Rose_Gold.svg';
import platinumSVG from '../assets/metal/Platinum.svg';

// Import images for shankStyles
import shankSolitaire from '../assets/shank/s01_C.png';
import shankFrenchPave from '../assets/shank/s02_C.png';
import shankUShapedPave from '../assets/shank/s03_C.png';
import shankKnifeEdgePave from '../assets/shank/s04_C.png';
import shankKnifeEdgeSolitaire from '../assets/shank/s05_C.png';
import shankMarquiseDiamond from '../assets/shank/s06_C.png';
import shankMarquiseSaphire from '../assets/shank/s07_C.png';
import shankCathedralPave from '../assets/shank/s08_C.png';
import shankRopeSolitaire from '../assets/shank/s09_C.png';
import shankRopePave from '../assets/shank/s10_C.png';
import shankSleekAccent from '../assets/shank/s11_C.png';
import shankChannelSet from '../assets/shank/s12_C.png';

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
];

export const metals = [
	{ name: '14K White Gold', image: whiteGoldSVG },
	{ name: '14K Yellow Gold', image: yellowGoldSVG },
	{ name: '14K Rose Gold', image: roseGoldSVG },
	{ name: 'Platinum', image: platinumSVG },
];

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
];

export const menuItems = [
	{
		name: 'Rings',
		submenu: [
			{
				heading: 'Design Your Own',
				items: [
					'Start with a Setting',
					'Start with a Diamond',
					'Start With A Lab Grown Diamond',
					'Start with a Gemstone',
				],
			},
			{
				heading: 'Ready-to-Ship',
				items: [
					'Ready to Ship Engagement Rings',
					'Preset Diamond Engagement Rings',
				],
			},
			{
				heading: 'Popular Styles',
				items: [
					'Round Cut Rings',
					'Princess Cut Rings',
					'Cushion Cut Rings',
					"Explore Men's Engagement Rings",
					'Top Engagement Rings',
					'Customize Your Engagement Ring',
					'The Ring Studio',
				],
			},
			{
				heading: 'Engagement Ring Styles',
				items: [
					'Solitaire',
					'Pavé',
					'Channel-Set',
					'Side-Stone',
					'Bezel',
					'Halo',
					'Hidden Halo',
					'Three-Stone',
				],
			},
			{
				heading: 'More Styles',
				items: [
					'Tension',
					'Floral',
					'Tiara',
					'Vintage',
					'Unique',
					'Cathedral',
					'Cluster',
				],
			},
			{
				heading: 'Shop by Metal',
				items: ['Rose Gold', 'White Gold', 'Yellow Gold', 'Platinum'],
			},
		],
	},
	{
		name: 'Fine Jewelry',
		submenu: [
			{
				heading: 'Earrings',
				items: [
					'Stud Earrings',
					'Hoop Earrings',
					'Drop Earrings',
					'Chandelier Earrings',
				],
			},
			{
				heading: 'Bracelets',
				items: [
					'Bangle Bracelets',
					'Tennis Bracelets',
					'Cuff Bracelets',
					'Charm Bracelets',
				],
			},
			{
				heading: 'Necklaces',
				items: [
					'Pendant Necklaces',
					'Choker Necklaces',
					'Lariat Necklaces',
					'Statement Necklaces',
				],
			},
			{
				heading: 'Rings',
				items: [
					'Stackable Rings',
					'Birthstone Rings',
					'Eternity Rings',
					'Fashion Rings',
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
					'Track Your Order',
					'Shipping Policies',
					'International Shipping',
				],
			},
			{
				heading: 'Returns & Exchanges',
				items: [
					'Return Policy',
					'How to Return an Item',
					'Exchanges & Store Credit',
				],
			},
			{
				heading: 'Payment & Financing',
				items: ['Accepted Payment Methods', 'Financing Options', 'Gift Cards'],
			},
			{
				heading: 'Customization & Engraving',
				items: ['Custom Jewelry', 'Engraving Services', 'Special Orders'],
			},
		],
	},
]

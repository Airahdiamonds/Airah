import WhiteGoldSVG from '../assets/14K_White_Gold.svg'
import head from '../assets/h01.png'
import shank from '../assets/s01_C.png'

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
	{ name: 'Four Prong', image: head },
	{ name: 'Six Prong', image: head },
	{ name: 'Classic Basket', image: head },
	{ name: 'Surprise Diamond', image: head },
	{ name: 'Surprise Sapphire', image: head },
	{ name: 'Lotus Basket', image: head },
	{ name: 'Tulip Basket', image: head },
	{ name: 'Scalloped Six Prong', image: head },
	{ name: 'Vintage Basket', image: head },
	{ name: 'Pave Halo', image: head },
	{ name: 'Sapphire Halo', image: head },
	{ name: 'French Pave Halo', image: head },
	{ name: 'Falling Edge Halo', image: head },
]

export const metals = [
	{ name: '14K White Gold', image: WhiteGoldSVG },
	{ name: '14K Yellow Gold', image: WhiteGoldSVG },
	{ name: '14K Rose Gold', image: WhiteGoldSVG },
	{ name: '18K White Gold', image: WhiteGoldSVG },
	{ name: '18K Yellow Gold', image: WhiteGoldSVG },
	{ name: '18K Rose Gold', image: WhiteGoldSVG },
	{ name: 'Platinum', image: WhiteGoldSVG },
]

export const shankStyles = [
	{ name: 'Solitaire', image: shank },
	{ name: 'French Pave', image: shank },
	{ name: 'U Shaped Pave', image: shank },
	{ name: 'Knife Edge Pave', image: shank },
	{ name: 'Knife Edge Solitaire', image: shank },
	{ name: 'Marquise Diamond', image: shank },
	{ name: 'Marquise Saphire', image: shank },
	{ name: 'Cathedral Pave', image: shank },
	{ name: 'Rope Solitaire', image: shank },
	{ name: 'Rope Pave', image: shank },
	{ name: 'Sleek Accent', image: shank },
	{ name: 'Channel Set', image: shank },
]

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

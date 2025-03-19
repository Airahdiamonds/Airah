import { relations } from 'drizzle-orm'
import { decimal, pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core'
import {
	created_at,
	description,
	image_URL,
	SKU,
	updated_at,
} from '../schemaHelpers.js'
import { orderItemsTable } from './orderItems.js'
import { favoritesTable } from './favorites.js'
import { cartTable } from './cart.js'
import { reviewsTable } from './reviews.js'

export const headStyle = [
	'Four Prong',
	'Six Prong',
	'Classic Basket',
	'Pave Basket',
	'Surprise Diamond',
	'Surprise Sapphire',
	'Lotus Basket',
	'Tulip Basket',
	'Scalloped Six Prong',
	'Vintage Basket',
	'Pave Halo',
	'Sapphire Halo',
	'French Pave Halo',
	'Falling Edge Halo',
]
export const headStyleEnum = pgEnum('head_style', headStyle)
export const metal = [
	'14K White Gold',
	'14K Yellow Gold',
	'14K Rose Gold',
	'18K White Gold',
	'18K Yellow Gold',
	'18K Rose Gold',
	'Platinum',
]
export const metalEnum = pgEnum('metal', metal)
export const shankStyle = [
	'Solitaire',
	'French Pave',
	'U Shaped Pave',
	'Knife Edge Pave',
	'Knife Edge Solitaire',
	'Marquise Diamond',
	'Marquise Saphire',
	'Cathedral Pave',
	'Rope Solitaire',
	'Rope Pave',
	'Sleek Accent',
	'Channel Set',
]
export const shankStyleEnum = pgEnum('shank_style', shankStyle)

export const ringStylesTable = pgTable('ringStyles', {
	ring_style_id: serial('ring_style_id').primaryKey(),
	SKU,
	name: text().notNull(),
	image_URL,
	description,
	head_style: headStyleEnum().default('Four Prong'),
	head_style_price: decimal(10, 2),
	head_metal: metalEnum().default('14K White Gold'),
	head_metal_price: decimal(10, 2),
	shank_style: shankStyleEnum().default('Solitaire'),
	shank_style_price: decimal(10, 2),
	shank_metal: metalEnum().default('14K White Gold'),
	shank_metal_price: decimal(10, 2),
	created_at,
	updated_at,
})

export const ringStylesRelations = relations(ringStylesTable, ({ many }) => ({
	orderItems: many(orderItemsTable),
	favorites: many(favoritesTable),
	cartItems: many(cartTable),
	reviews: many(reviewsTable),
}))

import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { created_at, image_URL, SKU, updated_at } from '../schemaHelpers.js'
import { orderItemsTable } from './orderItems.js'
import { cartTable } from './cart.js'
import { reviewsTable } from './reviews.js'
import { description, price } from '../schemaHelpers.js'

export const diamondSize = ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4']
export const diamondSizeEnum = pgEnum('size', diamondSize)
export const diamondClarity = ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF']
export const diamondClarityEnum = pgEnum('clarity', diamondClarity)
export const diamondShape = [
	'round',
	'princess',
	'emerald',
	'asscher',
	'oval',
	'pear',
	'marquise',
	'radiant',
	'cushion',
	'heart',
]
export const diamondShapeEnum = pgEnum('shape', diamondShape)
export const diamondColor = ['D', 'E', 'F', 'G', 'H']
export const diamondColorEnum = pgEnum('color', diamondColor)
export const diamondCut = ['regular', 'best', 'premium']
export const diamondCutEnum = pgEnum('cut', diamondCut)

export const diamondsTable = pgTable('diamonds', {
	diamond_id: serial('diamond_id').primaryKey(),
	SKU,
	name: text().notNull(),
	description,
	size: diamondSizeEnum().default('0.5'),
	image_URL,
	shape: diamondShapeEnum().default('round'),
	cut: diamondCutEnum().default('regular'),
	color: diamondColorEnum().default('D'),
	clarity: diamondClarityEnum().default('IF'),
	price,
	created_at,
	updated_at,
})

export const diamondsRelations = relations(diamondsTable, ({ many }) => ({
	orderItems: many(orderItemsTable),
	cartItems: many(cartTable),
	reviews: many(reviewsTable),
}))

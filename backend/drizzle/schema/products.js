import { relations } from 'drizzle-orm'
import {
	decimal,
	jsonb,
	pgEnum,
	pgTable,
	serial,
	text,
} from 'drizzle-orm/pg-core'
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

export const productCategory = ['ring', 'necklace', 'pendant', 'bracelet']
export const productSubCategory = [
	'Stackable Rings',
	'Birthstone Rings',
	'Eternity Rings',
	'Fashion Rings',
	'Stud Earrings',
	'Hoop Earrings',
	'Drop Earrings',
	'Chandelier Earrings',
	'Bangle Bracelets',
	'Tennis Bracelets',
	'Cuff Bracelets',
	'Charm Bracelets',
	'Pendant Necklaces',
	'Choker Necklaces',
	'Lariat Necklaces',
	'Statement Necklaces',
]
export const productCategoryEnum = pgEnum('product_category', productCategory)
export const productSubCategoryEnum = pgEnum(
	'product_sub_category',
	productSubCategory
)

export const productsTable = pgTable('products', {
	product_id: serial('product_id').primaryKey(),
	SKU,
	created_at,
	updated_at,
	segment: text(),
	name: text().notNull(),
	category: productCategoryEnum().default('ring'),
	description,
	subCategory: productSubCategoryEnum().default('Stackable Rings'),
	tags: jsonb('product_tags').default([]).notNull(),
	image_URL,
	gold_quantity: decimal(10, 2),
	gold_price: decimal(10, 2),
	gold_total: decimal(10, 2),
	round_quantity: decimal(10, 2),
	round_price: decimal(10, 2),
	round_total: decimal(10, 2),
	oval_quantity: decimal(10, 2),
	oval_price: decimal(10, 2),
	oval_total: decimal(10, 2),
	marquise_quantity: decimal(10, 2),
	marquise_price: decimal(10, 2),
	marquise_total: decimal(10, 2),
	emerald_quantity: decimal(10, 2),
	emerald_price: decimal(10, 2),
	emerald_total: decimal(10, 2),
	princess_quantity: decimal(10, 2),
	princess_price: decimal(10, 2),
	princess_total: decimal(10, 2),
	pear_quantity: decimal(10, 2),
	pear_price: decimal(10, 2),
	pear_total: decimal(10, 2),
	heart_quantity: decimal(10, 2),
	heart_price: decimal(10, 2),
	heart_total: decimal(10, 2),
	other_diamond_quantity: decimal(10, 2),
	other_diamond_price: decimal(10, 2),
	other_diamond_total: decimal(10, 2),
	gemstone_quantity: decimal(10, 2),
	gemstone_price: decimal(10, 2),
	gemstone_total: decimal(10, 2),
	misc_cost: decimal(10, 2),
	labour_cost: decimal(10, 2),
	other_cost: decimal(10, 2),
	total_cost: decimal(10, 2),
})

export const productsRelations = relations(productsTable, ({ many }) => ({
	orderItems: many(orderItemsTable),
	favorites: many(favoritesTable),
	cartItems: many(cartTable),
	reviews: many(reviewsTable),
}))

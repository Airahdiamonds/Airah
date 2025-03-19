import { integer, pgTable, serial } from 'drizzle-orm/pg-core'
import { created_at, quantity, updated_at } from '../schemaHelpers.js'
import { userTable } from './users.js'
import { productsTable } from './products.js'
import { relations } from 'drizzle-orm'
import { diamondsTable } from './diamonds.js'
import { ringStylesTable } from './ringStyles.js'

export const cartTable = pgTable('cart', {
	cart_id: serial('cart_id').primaryKey(),
	user_id: serial('user_id').references(() => userTable.user_id, {
		onDelete: 'cascade',
	}),
	product_id: integer('product_id')
		.references(() => productsTable.product_id, {
			onDelete: 'set null',
		})
		.default(null),
	diamond_id: integer('diamond_id')
		.references(() => diamondsTable.diamond_id, {
			onDelete: 'set null',
		})
		.default(null),
	ring_style_id: integer('ring_style_id')
		.references(() => ringStylesTable.ring_style_id, {
			onDelete: 'set null',
		})
		.default(null),
	quantity,
	created_at,
	updated_at,
})

export const cartRelations = relations(cartTable, ({ one }) => ({
	user: one(userTable, {
		fields: [cartTable.user_id],
		references: [userTable.user_id],
	}),
	product: one(productsTable, {
		fields: [cartTable.product_id],
		references: [productsTable.product_id],
	}),
	diamond: one(diamondsTable, {
		fields: [cartTable.diamond_id],
		references: [diamondsTable.diamond_id],
	}),
	ringStyle: one(ringStylesTable, {
		fields: [cartTable.ring_style_id],
		references: [ringStylesTable.ring_style_id],
	}),
}))

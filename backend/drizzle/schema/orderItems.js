import { decimal, integer, pgTable, serial } from 'drizzle-orm/pg-core'
import { created_at, quantity, updated_at } from '../schemaHelpers.js'
import { productsTable } from './products.js'
import { ordersTable } from './orders.js'
import { relations } from 'drizzle-orm'
import { diamondsTable } from './diamonds.js'
import { ringStylesTable } from './ringStyles.js'

export const orderItemsTable = pgTable('order_items', {
	order_item_id: serial('order_item_id').primaryKey(),
	order_id: serial().references(() => ordersTable.order_id, {
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
	product_cost: decimal(10, 2),
	diamond_cost: decimal(10, 2),
	ring_cost: decimal(10, 2),
	quantity,
	created_at,
	updated_at,
})

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
	order: one(ordersTable, {
		fields: [orderItemsTable.order_id],
		references: [ordersTable.order_id],
	}),
	product: one(productsTable, {
		fields: [orderItemsTable.product_id],
		references: [productsTable.product_id],
	}),
	diamond: one(diamondsTable, {
		fields: [orderItemsTable.diamond_id],
		references: [diamondsTable.diamond_id],
	}),
	ringStyle: one(ringStylesTable, {
		fields: [orderItemsTable.ring_style_id],
		references: [ringStylesTable.ring_style_id],
	}),
}))

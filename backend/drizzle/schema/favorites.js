import { integer, pgTable, serial } from 'drizzle-orm/pg-core'
import { created_at, updated_at } from '../schemaHelpers.js'
import { userTable } from './users.js'
import { productsTable } from './products.js'
import { relations } from 'drizzle-orm'
import { ringStylesTable } from './ringStyles.js'
import { diamondsTable } from './diamonds.js'

export const favoritesTable = pgTable('favorites', {
	favourite_id: serial('favourite_id').primaryKey(),
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
	created_at,
	updated_at,
})

export const favoritesRelations = relations(favoritesTable, ({ one }) => ({
	user: one(userTable, {
		fields: [favoritesTable.user_id],
		references: [userTable.user_id],
	}),
	diamond: one(diamondsTable, {
		fields: [favoritesTable.diamond_id],
		references: [diamondsTable.diamond_id],
	}),
	product: one(productsTable, {
		fields: [favoritesTable.product_id],
		references: [productsTable.product_id],
	}),
	ringStyle: one(ringStylesTable, {
		fields: [favoritesTable.ring_style_id],
		references: [ringStylesTable.ring_style_id],
	}),
}))

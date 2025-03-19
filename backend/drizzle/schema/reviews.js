import { pgTable, text, integer, serial } from 'drizzle-orm/pg-core'
import { created_at, image_URL } from '../schemaHelpers.js'
import { userTable } from './users.js'
import { productsTable } from './products.js'
import { relations } from 'drizzle-orm'
import { diamondsTable } from './diamonds.js'
import { ringStylesTable } from './ringStyles.js'

export const reviewsTable = pgTable('reviews', {
	review_id: serial('review_id').primaryKey(),
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
	rating: integer().notNull(),
	image_URL,
	comment: text(),
	created_at,
})

export const reviewRelations = relations(reviewsTable, ({ one }) => ({
	user: one(userTable, {
		fields: [reviewsTable.user_id],
		references: [userTable.user_id],
	}),
	product: one(productsTable, {
		fields: [reviewsTable.product_id],
		references: [productsTable.product_id],
	}),
	diamond: one(diamondsTable, {
		fields: [reviewsTable.diamond_id],
		references: [diamondsTable.diamond_id],
	}),
	ringStyle: one(ringStylesTable, {
		fields: [reviewsTable.ring_style_id],
		references: [ringStylesTable.ring_style_id],
	}),
}))

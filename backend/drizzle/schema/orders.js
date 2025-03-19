import { integer, pgEnum, pgTable, serial } from 'drizzle-orm/pg-core'
import { created_at, updated_at } from '../schemaHelpers.js'
import { userTable } from './users.js'
import { relations } from 'drizzle-orm'
import { orderItemsTable } from './orderItems.js'
import { transactionsTable } from './transactions.js'

export const status = ['pending', 'paid', 'shipped', 'delivered', 'cancelled']
export const statusEnum = pgEnum('status', status)

export const ordersTable = pgTable('orders', {
	order_id: serial('order_id').primaryKey(),
	user_id: serial('user_id').references(() => userTable.user_id, {
		onDelete: 'cascade',
	}),
	total_amount: integer().notNull(),
	status: statusEnum().default('pending'),
	created_at,
	updated_at,
})

export const orderRelations = relations(ordersTable, ({ one, many }) => ({
	user: one(userTable, {
		fields: [ordersTable.user_id],
		references: [userTable.user_id],
	}),
	orderItems: many(orderItemsTable),
	transactions: many(transactionsTable),
}))

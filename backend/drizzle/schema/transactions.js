import {
	integer,
	pgEnum,
	pgTable,
	serial,
	text,
	timestamp,
} from 'drizzle-orm/pg-core'
import { created_at, updated_at } from '../schemaHelpers.js'
import { userTable } from './users.js'
import { ordersTable } from './orders.js'
import { relations } from 'drizzle-orm'

export const paymentMethod = ['creditCard', 'upi']
export const paymentStatus = ['pending', 'success', 'failed']
export const paymentMethodEnum = pgEnum('payment_method', paymentMethod)
export const paymentStatusEnum = pgEnum('payment_status', paymentStatus)

export const transactionsTable = pgTable('transactions', {
	transaction_id: serial('transaction_id').primaryKey(),
	order_id: serial().references(() => ordersTable.order_id, {
		onDelete: 'restrict',
	}),
	user_id: serial('user_id').references(() => userTable.user_id, {
		onDelete: 'restrict',
	}),
	payment_method: paymentMethodEnum().notNull(),
	payment_status: paymentStatusEnum().default('pending'),
	payment_date: timestamp({ withTimezone: true }).notNull().defaultNow(),
	transaction_amount: integer().notNull(),
	transaction_reference: text(),
	refunded_at: timestamp({ withTimezone: true }),
	created_at,
	updated_at,
})

export const transactionRelations = relations(transactionsTable, ({ one }) => ({
	user: one(userTable, {
		fields: [transactionsTable.user_id],
		references: [userTable.user_id],
	}),
	order: one(ordersTable, {
		fields: [transactionsTable.order_id],
		references: [ordersTable.order_id],
	}),
}))

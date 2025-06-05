import {
	boolean,
	integer,
	pgTable,
	serial,
	text,
	varchar,
} from 'drizzle-orm/pg-core'
import { userTable } from './users.js'
import { ordersTable } from './orders.js'
import { created_at, updated_at } from '../schemaHelpers.js'
import { relations } from 'drizzle-orm'

export const addressesTable = pgTable('addresses', {
	address_id: serial('address_id').primaryKey(),

	user_id: integer('user_id')
		.references(() => userTable.user_id, { onDelete: 'cascade' })
		.default(null),

	guest_id: varchar('guest_id', { length: 36 }).default(null),

	order_id: integer('order_id')
		.references(() => ordersTable.order_id, { onDelete: 'cascade' })
		.default(null),

	full_name: text().notNull(),
	phone_number: varchar('phone_number', { length: 15 }).notNull(),

	address_line1: text().notNull(),
	address_line2: text().default(''),
	city: text().notNull(),
	state: text().notNull(),
	country: text().notNull(),
	pincode: varchar('pincode', { length: 10 }).notNull(),

	is_billing: boolean().default(false),
	is_shipping: boolean().default(true),

	created_at,
	updated_at,
})

export const addressesRelations = relations(addressesTable, ({ one }) => ({
	user: one(userTable, {
		fields: [addressesTable.user_id],
		references: [userTable.user_id],
	}),

	order: one(ordersTable, {
		fields: [addressesTable.order_id],
		references: [ordersTable.order_id],
	}),
}))

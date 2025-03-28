import { pgTable, serial, text } from 'drizzle-orm/pg-core'
import { created_at, updated_at } from '../schemaHelpers.js'

export const adminTable = pgTable('admin', {
	user_id: serial('user_id').primaryKey(),
	name: text().notNull(),
	email: text().notNull().unique(),
	password: text().notNull(),
	created_at,
	updated_at,
})

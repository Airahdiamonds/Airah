import { pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { created_at, updated_at } from '../schemaHelpers.js'
import { relations } from 'drizzle-orm'
import { ordersTable } from './orders.js'
import { favoritesTable } from './favorites.js'
import { cartTable } from './cart.js'
import { reviewsTable } from './reviews.js'

export const userRole = ['admin', 'user']
export const userRoleEnum = pgEnum('role', userRole)

export const userTable = pgTable('users', {
	user_id: serial('user_id').primaryKey(),
	password: text(),
	salt: text(),
	name: text().notNull(),
	role: userRoleEnum().default('user'),
	email: text().notNull().unique(),
	created_at,
	updated_at,
})

export const userRelations = relations(userTable, ({ many }) => ({
	orders: many(ordersTable),
	favorites: many(favoritesTable),
	cartItems: many(cartTable),
	reviews: many(reviewsTable),
}))

import { pgEnum, pgTable, serial, text } from 'drizzle-orm/pg-core'
import { created_at, updated_at } from '../schemaHelpers.js'
import { relations } from 'drizzle-orm'
import { ordersTable } from './orders.js'
import { favoritesTable } from './favorites.js'
import { cartTable } from './cart.js'
import { reviewsTable } from './reviews.js'

export const userRoles = ['user', 'admin']
export const userRolesEnum = pgEnum('user_roles', userRoles)

export const userTable = pgTable('users', {
	user_id: serial('user_id').primaryKey(),
	clerk_user_id: text('clerk_user_id').unique(),
	name: text().notNull(),
	email: text().notNull().unique(),
	role: userRolesEnum().default('user'),
	created_at,
	updated_at,
})

export const userRelations = relations(userTable, ({ many }) => ({
	orders: many(ordersTable),
	favorites: many(favoritesTable),
	cartItems: many(cartTable),
	reviews: many(reviewsTable),
}))

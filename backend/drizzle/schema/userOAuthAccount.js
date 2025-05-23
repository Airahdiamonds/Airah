import { pgEnum, pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core'
import { userTable } from './users.js'
import { created_at, updated_at } from '../schemaHelpers.js'
import { relations } from 'drizzle-orm'

export const oAuthProviders = ['google', 'facebook']
export const oAuthProviderEnum = pgEnum('oauth_provides', oAuthProviders)

export const UserOAuthAccount = pgTable(
	'user_oauth_accounts',
	{
		userId: serial('user_id').references(() => userTable.user_id, {
			onDelete: 'cascade',
		}),
		provider: oAuthProviderEnum().notNull(),
		providerAccountId: text().notNull().unique(),
		createdAt: created_at,
		updatedAt: updated_at,
	},
	(t) => [primaryKey({ columns: [t.providerAccountId, t.provider] })]
)

export const userOauthAccountRelationships = relations(
	UserOAuthAccount,
	({ one }) => ({
		user: one(userTable, {
			fields: [UserOAuthAccount.userId],
			references: [userTable.user_id],
		}),
	})
)

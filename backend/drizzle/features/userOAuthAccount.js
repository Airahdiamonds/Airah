import { db } from '../db.js'
import { eq, and } from 'drizzle-orm'
import { userTable } from '../schema/users.js'
import { UserOAuthAccount } from '../schema/userOAuthAccount.js'

export async function handleGoogleLogin(userInfo) {
	const { sub, name, email } = userInfo

	// 1. Check if this Google account already exists
	const existingOAuth = await db
		.select()
		.from(UserOAuthAccount)
		.where(
			and(
				eq(UserOAuthAccount.provider, 'google'),
				eq(UserOAuthAccount.providerAccountId, sub)
			)
		)
		.limit(1)

	if (existingOAuth.length > 0) {
		// 2. If yes, fetch the user
		const userId = existingOAuth[0].userId
		const user = await db
			.select()
			.from(userTable)
			.where(eq(userTable.user_id, userId))
			.limit(1)
		return user[0]
	}

	// 3. If not, create a new user (no password, it's OAuth)
	const newUser = await db
		.insert(userTable)
		.values({
			name,
			email,
			password: null,
			salt: null,
		})
		.returning()

	const userId = newUser[0].user_id

	// 4. Link the Google account
	await db.insert(UserOAuthAccount).values({
		userId,
		provider: 'google',
		providerAccountId: sub,
	})

	return newUser[0]
}

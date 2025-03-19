import { db } from './db.js'
import { userTable } from './schema/users.js'
import { eq } from 'drizzle-orm'

export async function getUserByClerkId(clerk_user_id) {
	if (!clerk_user_id) throw new Error('Clerk user ID is required')

	const user = await db
		.select({ user_id: userTable.user_id })
		.from(userTable)
		.where(eq(userTable.clerk_user_id, clerk_user_id))
		.limit(1)

	return user[0]?.user_id
}

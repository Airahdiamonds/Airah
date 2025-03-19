import { db } from '../db.js'
import { userTable } from '../schema/users.js'
import { eq } from 'drizzle-orm'

export async function insertUser(data) {
	const [newUser] = await db
		.insert(userTable)
		.values(data)
		.returning()
		.onConflictDoUpdate({
			target: [userTable.clerk_user_id],
			set: data,
		})

	if (newUser == null) throw new Error('Failed to insert user')

	return newUser
}

export async function updateUser({ clerk_user_id }, data) {
	const [updatedUser] = await db
		.update(userTable)
		.set(data)
		.where(eq(userTable.clerk_user_id, clerk_user_id))
		.returning()

	if (updatedUser == null) throw new Error('Failed to update user')

	return updatedUser
}

export async function deleteUser({ clerk_user_id }) {
	const [deletedUser] = await db
		.update(userTable)
		.set({
			email: 'redacted@deleted.com',
			name: 'Deleted User',
			clerk_user_id: 'deleted',
		})
		.where(eq(userTable.clerk_user_id, clerk_user_id))
		.returning()

	if (deletedUser == null) throw new Error('Failed to delete user')

	return deletedUser
}

export async function getAllUsers() {
	const users = await db.select().from(userTable)

	if (users == null) throw new Error('Failed to get products')

	return users
}

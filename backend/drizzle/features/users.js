import { db } from '../db.js'
import { adminTable } from '../schema/admin.js'
import { userTable } from '../schema/users.js'
import { and, eq } from 'drizzle-orm'

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

export async function getAllAdmin() {
	const users = await db.select().from(adminTable)

	if (users == null) throw new Error('Failed to get admins')

	return users
}

export async function addAdmin(data) {
	const [newAdmin] = await db
		.insert(adminTable)
		.values(data)
		.returning()
		.onConflictDoUpdate({
			target: [adminTable.email],
			set: data,
		})

	if (newAdmin == null) throw new Error('Failed to insert admin')

	return newAdmin
}

export async function updateAdmin({ id }, data) {
	const [updatedAdmin] = await db
		.update(adminTable)
		.set(data)
		.where(eq(adminTable.user_id, id))
		.returning()

	if (updatedAdmin == null) throw new Error('Failed to update admin')

	return updatedAdmin
}

export async function deleteAdmin({ id }) {
	const deletedAdmins = await db
		.delete(adminTable)
		.where(eq(adminTable.user_id, id))
		.returning()

	if (deletedAdmins.length === 0) {
		throw new Error('Failed to delete admin')
	}

	return deletedAdmins[0]
}

export async function getAdmin(email, password) {
	const admin = await db
		.select()
		.from(adminTable)
		.where(and(eq(adminTable.email, email), eq(adminTable.password, password)))

	if (!admin || admin.length === 0) {
		throw new Error('Invalid email or password')
	}

	return admin[0]
}

import { comparePasswords, generateSalt, hashPassword } from '../../passwordHasher.js'
import { db } from '../db.js'
import { adminTable } from '../schema/admin.js'
import { userTable } from '../schema/users.js'
import { eq } from 'drizzle-orm'

// Helpers for the `users` and `admin` tables. Note that the `users`
// table uses `email` as its conflict target on upsert.

export async function insertUser(data) {
	const [newUser] = await db
		.insert(userTable)
		.values(data)
		.returning()
		.onConflictDoUpdate({
			target: [userTable.email],
			set: data,
		})

	if (newUser == null) throw new Error('Failed to insert user')
	return newUser
}

export async function getAllUsers() {
	const users = await db.select().from(userTable)
	if (users == null) throw new Error('Failed to get users')
	return users
}

export async function getUser(email) {
	const user = await db
		.select()
		.from(userTable)
		.where(eq(userTable.email, email))
	return user[0]
}

// ── admin ────────────────────────────────────────────────────────────────────

export async function getAllAdmin() {
	const users = await db.select().from(adminTable)
	if (users == null) throw new Error('Failed to get admins')
	return users
}

export async function addAdmin(data) {
	const salt = generateSalt()
	const hashedPassword = await hashPassword(data.password, salt)

	const [newAdmin] = await db
		.insert(adminTable)
		.values({ ...data, password: hashedPassword, salt })
		.returning()
		.onConflictDoUpdate({
			target: [adminTable.email],
			set: { ...data, password: hashedPassword, salt },
		})

	if (newAdmin == null) throw new Error('Failed to insert admin')
	return newAdmin
}

export async function updateAdmin({ id }, data) {
	const updateData = { ...data }

	// Only re-hash if a new password was supplied. Otherwise leave the
	// stored hash/salt untouched.
	if (data.password) {
		const salt = generateSalt()
		updateData.password = await hashPassword(data.password, salt)
		updateData.salt = salt
	}

	const [updatedAdmin] = await db
		.update(adminTable)
		.set(updateData)
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

	if (deletedAdmins.length === 0) throw new Error('Failed to delete admin')
	return deletedAdmins[0]
}

export async function getAdmin(email, password) {
	const admins = await db
		.select()
		.from(adminTable)
		.where(eq(adminTable.email, email))

	if (!admins || admins.length === 0) {
		throw new Error('Invalid email or password')
	}

	const admin = admins[0]

	if (admin.salt) {
		const isValid = await comparePasswords({
			password,
			salt: admin.salt,
			hashedPassword: admin.password,
		})
		if (!isValid) throw new Error('Invalid email or password')
	} else {
		// Legacy: plaintext comparison for admins created before the
		// salt+hash migration. New admins always go through `addAdmin`
		// which hashes them.
		if (admin.password !== password) throw new Error('Invalid email or password')
	}

	return admin
}

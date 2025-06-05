import { addressesTable } from '../schema/addresses.js'
import { db } from '../db.js'
import { and, eq, isNull } from 'drizzle-orm'

export async function addAddress({
	user_id,
	guest_id,
	order_id,
	full_name,
	phone_number,
	address_line1,
	address_line2,
	city,
	state,
	country,
	pincode,
	is_shipping = true,
	is_billing = false,
}) {
	return await db.insert(addressesTable).values({
		user_id,
		guest_id,
		order_id,
		full_name,
		phone_number,
		address_line1,
		address_line2,
		city,
		state,
		country,
		pincode,
		is_shipping,
		is_billing,
	})
}

export async function getUserSavedAddresses(user_id) {
	return await db
		.select()
		.from(addressesTable)
		.where(
			and(eq(addressesTable.user_id, user_id), isNull(addressesTable.order_id))
		)
}

export async function getOrderAddresses(order_id) {
	return await db
		.select()
		.from(addressesTable)
		.where(eq(addressesTable.order_id, order_id))
}

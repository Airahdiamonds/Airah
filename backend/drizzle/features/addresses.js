import { addressesTable } from '../schema/addresses.js'
import { db } from '../db.js'
import { and, eq, isNull } from 'drizzle-orm'

// Address-book helpers. A row is a saved address when `order_id IS NULL`
// (it belongs to a user). A row tied to a specific `order_id` is a
// historical snapshot of the address used at checkout — never edit those.

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

// Update is scoped to (address_id, user_id) AND order_id IS NULL so a
// caller can never edit an order's historical address snapshot, even by
// guessing the right address_id.
export async function updateAddress({ address_id, user_id, data }) {
	const [row] = await db
		.update(addressesTable)
		.set({
			full_name: data.full_name,
			phone_number: data.phone_number,
			address_line1: data.address_line1,
			address_line2: data.address_line2 ?? '',
			city: data.city,
			state: data.state,
			country: data.country,
			pincode: data.pincode,
			is_shipping: data.is_shipping ?? true,
			is_billing: data.is_billing ?? false,
		})
		.where(
			and(
				eq(addressesTable.address_id, Number(address_id)),
				eq(addressesTable.user_id, user_id),
				isNull(addressesTable.order_id)
			)
		)
		.returning()
	return row ?? null
}

export async function deleteAddress({ address_id, user_id }) {
	const result = await db
		.delete(addressesTable)
		.where(
			and(
				eq(addressesTable.address_id, Number(address_id)),
				eq(addressesTable.user_id, user_id),
				isNull(addressesTable.order_id)
			)
		)
		.returning({ address_id: addressesTable.address_id })
	return result.length > 0
}

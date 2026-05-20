import { and, eq, gte, isNotNull, or, sql } from 'drizzle-orm'
import { db } from '../db.js'
import { ordersTable } from '../schema/orders.js'
import { orderItemsTable } from '../schema/orderItems.js'
import { transactionsTable } from '../schema/transactions.js'
import { cartTable } from '../schema/cart.js'
import { productsTable } from '../schema/products.js'
import { diamondsTable } from '../schema/diamonds.js'
import { ringStylesTable } from '../schema/ringStyles.js'
import { couponsTable } from '../schema/coupons.js'
import { addressesTable } from '../schema/addresses.js'
import { ringStyleTotalPriceSQL } from '../featureHelpers.js'

export async function getOrdersByUser({ userId, guestId }) {
	if (userId) {
		return await db
			.select()
			.from(ordersTable)
			.where(eq(ordersTable.user_id, userId))
	} else if (guestId) {
		return await db
			.select()
			.from(ordersTable)
			.where(eq(ordersTable.guest_id, guestId))
	}
	return []
}

export async function getOrdersAdmin() {
	return await db.select().from(ordersTable)
}

// Fetches the cart from DB and computes the authoritative line items + total.
// Never trust prices the client sends — recompute from the catalog.
async function loadCartForCheckout({ userId, guestId }) {
	const owner = userId
		? eq(cartTable.user_id, userId)
		: eq(cartTable.guest_id, guestId)

	const rows = await db
		.select({
			cart_id: cartTable.cart_id,
			product_id: cartTable.product_id,
			diamond_id: cartTable.diamond_id,
			ring_style_id: cartTable.ring_style_id,
			ring_size: cartTable.ring_size,
			quantity: cartTable.quantity,
			product_price: productsTable.total_cost,
			diamond_price: diamondsTable.price,
			ring_style_price: ringStyleTotalPriceSQL(ringStylesTable).as('ring_style_price'),
		})
		.from(cartTable)
		.leftJoin(productsTable, eq(cartTable.product_id, productsTable.product_id))
		.leftJoin(diamondsTable, eq(cartTable.diamond_id, diamondsTable.diamond_id))
		.leftJoin(ringStylesTable, eq(cartTable.ring_style_id, ringStylesTable.ring_style_id))
		.where(owner)

	const items = rows
		.filter(
			(r) => r.product_id != null || r.diamond_id != null || r.ring_style_id != null
		)
		.map((r) => {
			const unitPrice =
				Number(r.product_price ?? 0) +
				Number(r.diamond_price ?? 0) +
				Number(r.ring_style_price ?? 0)
			const quantity = Math.max(1, Number(r.quantity) || 1)
			return {
				cart_id: r.cart_id,
				product_id: r.product_id,
				diamond_id: r.diamond_id,
				ring_style_id: r.ring_style_id,
				ring_size: r.ring_size,
				quantity,
				product_price: r.product_price,
				diamond_price: r.diamond_price,
				ring_style_price: r.ring_style_price,
				lineTotal: unitPrice * quantity,
			}
		})

	const subtotal = items.reduce((s, i) => s + i.lineTotal, 0)

	return { items, subtotal }
}

// Server-side checkout — computes total from DB, applies a validated coupon,
// decrements stock atomically, inserts order + items in a transaction.
// `shippingAddress` is the address payload from the client; it is persisted
// against the new order_id rather than as a saved user address.
export async function createOrderFromCart({ userId, guestId, couponCode, shippingAddress }) {
	const { items, subtotal } = await loadCartForCheckout({ userId, guestId })
	if (items.length === 0) throw new Error('Cart is empty')
	if (!shippingAddress) throw new Error('Missing shipping address')

	let discount = 0
	let coupon = null
	if (couponCode) {
		const [c] = await db
			.select()
			.from(couponsTable)
			.where(eq(couponsTable.code, couponCode))
			.limit(1)
		if (c) {
			const expired = new Date(c.expiry_date) < new Date()
			const exhausted = c.used_count >= c.max_uses
			if (!expired && !exhausted) {
				coupon = c
				discount = Math.round((subtotal * c.discount_percentage) / 100)
			}
		}
	}

	const total = Math.max(0, subtotal - discount)

	const order = await db.transaction(async (tx) => {
		// Decrement stock for each line. Use a guarded UPDATE so that two
		// concurrent checkouts cannot both drain the last unit. If the row
		// count returned is 0, the item is out of stock — abort the txn.
		for (const item of items) {
			await decrementStock(tx, item)
		}

		const [newOrder] = await tx
			.insert(ordersTable)
			.values({
				user_id: userId || null,
				guest_id: guestId || null,
				total_amount: total,
				status: 'pending',
			})
			.returning()

		await tx.insert(orderItemsTable).values(
			items.map((item) => ({
				order_id: newOrder.order_id,
				product_id: item.product_id ?? null,
				diamond_id: item.diamond_id ?? null,
				ring_style_id: item.ring_style_id ?? null,
				ring_size: item.ring_size ?? null,
				quantity: item.quantity,
				product_cost: item.product_price ?? null,
				diamond_cost: item.diamond_price ?? null,
				ring_cost: item.ring_style_price ?? null,
			}))
		)

		await tx.insert(addressesTable).values({
			user_id: userId || null,
			guest_id: guestId || null,
			order_id: newOrder.order_id,
			full_name: shippingAddress.full_name,
			phone_number: shippingAddress.phone_number,
			address_line1: shippingAddress.address_line1,
			address_line2: shippingAddress.address_line2 ?? '',
			city: shippingAddress.city,
			state: shippingAddress.state,
			country: shippingAddress.country,
			pincode: shippingAddress.pincode,
			is_shipping: true,
			is_billing: shippingAddress.is_billing ?? false,
		})

		return newOrder
	})

	return { order, total, items, subtotal, discount, coupon }
}

async function decrementStock(tx, item) {
	let table, idColumn, idValue, label
	if (item.product_id != null) {
		table = productsTable
		idColumn = productsTable.product_id
		idValue = item.product_id
		label = 'Product'
	} else if (item.diamond_id != null) {
		table = diamondsTable
		idColumn = diamondsTable.diamond_id
		idValue = item.diamond_id
		label = 'Diamond'
	} else if (item.ring_style_id != null) {
		table = ringStylesTable
		idColumn = ringStylesTable.ring_style_id
		idValue = item.ring_style_id
		label = 'Ring style'
	} else {
		return
	}

	const updated = await tx
		.update(table)
		.set({ stock_qty: sql`${table.stock_qty} - ${item.quantity}` })
		.where(and(eq(idColumn, idValue), gte(table.stock_qty, item.quantity)))
		.returning({ id: idColumn })

	if (updated.length === 0) {
		throw new Error(`${label} ${idValue} is out of stock`)
	}
}

export async function cancelOrder(orderId) {
	await db
		.update(ordersTable)
		.set({ status: 'cancelled' })
		.where(eq(ordersTable.order_id, orderId))
}

export async function updateStatus(orderId, status) {
	await db
		.update(ordersTable)
		.set({ status })
		.where(eq(ordersTable.order_id, orderId))
}

// Atomically records a payment and marks the order paid, only if no
// successful transaction already exists for this Razorpay payment id.
// Returns true if this call was the one that recorded the payment.
export async function recordPaymentIfNew({
	orderId,
	userId,
	amount,
	razorpayPaymentId,
}) {
	return await db.transaction(async (tx) => {
		const existing = await tx
			.select({ transaction_id: transactionsTable.transaction_id })
			.from(transactionsTable)
			.where(eq(transactionsTable.transaction_reference, razorpayPaymentId))
			.limit(1)

		if (existing.length > 0) return false

		await tx.insert(transactionsTable).values({
			order_id: orderId ?? null,
			user_id: userId ?? null,
			payment_method: 'creditCard',
			payment_status: 'success',
			transaction_amount: amount ?? 0,
			transaction_reference: razorpayPaymentId,
		})

		await tx
			.update(ordersTable)
			.set({ status: 'paid' })
			.where(eq(ordersTable.order_id, orderId))

		return true
	})
}

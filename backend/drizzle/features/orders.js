import { eq } from 'drizzle-orm'
import { db } from '../db.js'
import { ordersTable } from '../schema/orders.js'
import { orderItemsTable } from '../schema/orderItems.js'

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
	return [] // fallback
}

export async function getOrdersAdmin() {
	return await db.select().from(ordersTable)
}

export async function createOrder({ userId, guestId, cartItems, totalPrice }) {
	const [newOrder] = await db
		.insert(ordersTable)
		.values({
			user_id: userId || null,
			guest_id: guestId || null,
			total_amount: totalPrice,
			status: 'pending',
		})
		.returning()

	await db.insert(orderItemsTable).values(
		cartItems.map((item) => ({
			order_id: newOrder.order_id, // Make sure you're using correct key
			product_id: item.product_id,
			diamond_id: item.diamond_id,
			ring_style_id: item.ring_style_id,
			quantity: item.quantity,
			product_cost: item.product_price,
			diamond_cost: item.diamond_price,
			ring_cost: item.ring_style_price,
		}))
	)

	return newOrder
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

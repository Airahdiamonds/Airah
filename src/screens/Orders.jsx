import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrders, cancelOrder } from '../redux/ordersSlice'
import { useUser } from '@clerk/clerk-react'
import { convertPrice, formatDate } from '../utils/helpers'

// Order Status Mapping for Tracking
const statusSteps = {
	Pending: 0,
	Shipped: 1,
	Delivered: 2,
	Cancelled: -1,
}

export default function OrdersPage() {
	const dispatch = useDispatch()
	const { orders, status, error } = useSelector((state) => state.orders)
	const [filter, setFilter] = useState('All')
	const { user } = useUser()
	const dbId = user?.publicMetadata?.dbId
	const {
		currency,
		country,
		USD_rate,
		GBP_rate,
		AUD_rate,
		OMR_rate,
		AED_rate,
		EUR_rate,
	} = useSelector((state) => state.localization)

	useEffect(() => {
		if (dbId) {
			dispatch(fetchOrders(dbId))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dbId])

	const filteredOrders = orders.filter(
		(order) => filter === 'All' || order.status === filter
	)

	const handleCancelOrder = (orderId) => {
		dispatch(cancelOrder(orderId))
		dispatch(fetchOrders(dbId))
	}

	return (
		<div className="max-w-5xl mx-auto p-6">
			<h2 className="text-2xl font-bold mb-4">My Orders</h2>

			{/* Filter Dropdown */}
			<div className="mb-4">
				<label className="mr-2 text-gray-700 font-medium">Filter:</label>
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="border rounded px-3 py-1 bg-white"
				>
					<option value="All">All</option>
					<option value="pending">Pending</option>
					<option value="shipped">Shipped</option>
					<option value="delivered">Delivered</option>
					<option value="cancelled">Cancelled</option>
				</select>
			</div>

			{/* Loading & Error Handling */}
			{status === 'loading' && <p>Loading orders...</p>}
			{status === 'failed' && <p className="text-red-500">{error}</p>}

			{/* Orders List */}
			<div className="overflow-x-auto bg-white shadow-md rounded-lg">
				<table className="w-full text-left border-collapse">
					<thead className="bg-gray-200">
						<tr>
							<th className="p-3">Order ID</th>
							<th className="p-3">Date</th>
							<th className="p-3">Status</th>
							<th className="p-3">Total</th>
							<th className="p-3">Actions</th>
						</tr>
					</thead>
					<tbody>
						{filteredOrders.map((order) => (
							<tr key={order.order_id} className="border-t hover:bg-gray-100">
								<td className="p-3">{order.order_id}</td>
								<td className="p-3">{formatDate(order.created_at)}</td>
								<td className="p-3 font-semibold">
									<OrderStatus status={order.status} />
								</td>
								<td className="p-3 font-bold">
									{currency}
									{convertPrice(
										Number(order.total_amount),
										country,
										USD_rate,
										GBP_rate,
										AUD_rate,
										OMR_rate,
										AED_rate,
										EUR_rate
									).toFixed(2)}
								</td>
								<td className="p-3">
									{order.status === 'pending' && (
										<button
											className="text-red-500 hover:underline"
											onClick={() => handleCancelOrder(order.order_id)}
										>
											Cancel Order
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

// Order Status Component with Tracking Bar
function OrderStatus({ status }) {
	return (
		<div className="flex flex-col items-start">
			<span className="font-bold">{status}</span>
			{status !== 'Cancelled' && (
				<div className="w-32 h-1 mt-1 bg-gray-300 relative">
					<div
						className={`absolute h-1 ${
							statusSteps[status] === 0
								? 'bg-yellow-500 w-1/3'
								: statusSteps[status] === 1
								? 'bg-blue-500 w-2/3'
								: 'bg-green-500 w-full'
						}`}
					></div>
				</div>
			)}
		</div>
	)
}

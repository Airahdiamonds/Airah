import { useEffect, useState } from 'react'
import { addCouponEntry, getCouponList } from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const AddCoupon = () => {
	const [showForm, setShowForm] = useState(false)
	const [products, setProducts] = useState([])
	const [formData, setFormData] = useState({
		code: '',
		discount_percentage: '',
		expiry_date: '',
		max_uses: '',
	})

	useEffect(() => {
		fetchCouponList()
	}, [])

	const fetchCouponList = async () => {
		try {
			const data = await getCouponList()
			setProducts(data)
		} catch (error) {
			console.error('Error fetching master list:', error)
		}
	}

	const handleCloseForm = () => {
		setShowForm(false)
		setFormData({
			code: '',
			discount_percentage: '',
			expiry_date: '',
			max_uses: '',
		})
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			await addCouponEntry(formData)
			setShowForm(false)
			fetchCouponList()
		} catch (error) {
			console.error('Error adding new entry:', error)
		}
	}

	return (
		<div className="max-w-6xl mx-auto p-8">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold mb-4">Coupons List</h2>
				<button
					onClick={() => setShowForm(true)}
					className="bg-blue-500 text-white px-4 py-1 rounded"
				>
					Add
				</button>
			</div>

			<table className="min-w-full bg-white border border-gray-200">
				<thead>
					<tr className="bg-gray-100">
						<th className="border px-4 py-2">Coupon Code</th>
						<th className="border px-4 py-2">Discount %</th>
						<th className="border px-4 py-2">Expiry Date</th>
						<th className="border px-4 py-2">Max Uses</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr key={product.product_id} className="border">
							<td className="border px-4 py-2">{product.code}</td>
							<td className="border px-4 py-2">
								{product.discount_percentage}
							</td>
							<td className="border px-4 py-2">
								{formatDate(product.expiry_date)}
							</td>
							<td className="border px-4 py-2">{product.max_uses}</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Add Entry Form */}
			{showForm && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
						<h3 className="text-lg font-bold mb-4">Add New Entry</h3>
						<form onSubmit={handleSubmit}>
							<div className="grid grid-cols-2 gap-4">
								<input
									type="text"
									name="code"
									value={formData.code}
									onChange={handleChange}
									placeholder="Coupon Code"
									required
									className="border p-2 rounded w-full"
								/>
								<input
									type="number"
									name="discount_percentage"
									value={formData.discount_percentage}
									onChange={handleChange}
									placeholder="Discount Percentage"
									required
									className="border p-2 rounded w-full"
								/>
								<input
									type="date"
									name="expiry_date"
									value={formData.expiry_date}
									onChange={handleChange}
									placeholder="Gold Rate"
									required
									className="border p-2 rounded w-full"
								/>
								<input
									type="number"
									name="max_uses"
									value={formData.max_uses}
									onChange={handleChange}
									placeholder="Max Uses"
									required
									className="border p-2 rounded w-full"
								/>
							</div>

							<div className="flex justify-end mt-4">
								<button
									type="button"
									onClick={handleCloseForm}
									className="bg-red-500 text-white px-4 py-2 rounded mr-2"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="bg-green-500 text-white px-4 py-2 rounded"
								>
									Save
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}

export default AddCoupon

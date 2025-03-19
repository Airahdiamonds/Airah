import { useEffect, useState } from 'react'
import { getMasterList, addMasterEntry } from '../../utils/api'
import { formatDate } from '../../utils/helpers'

const Master = () => {
	const [showForm, setShowForm] = useState(false)
	const [products, setProducts] = useState([])
	const [formData, setFormData] = useState({
		GBP_rate: '',
		INR_rate: '',
		gold_rate: '',
		diamond_rate: '',
	})

	useEffect(() => {
		fetchMasterList()
	}, [])

	const fetchMasterList = async () => {
		try {
			const data = await getMasterList()
			setProducts(data)
		} catch (error) {
			console.error('Error fetching master list:', error)
		}
	}

	const handleCloseForm = () => {
		setShowForm(false)
		setFormData({
			GBP_rate: '',
			INR_rate: '',
			gold_rate: '',
			diamond_rate: '',
		})
	}

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			await addMasterEntry(formData)
			setShowForm(false)
			fetchMasterList()
		} catch (error) {
			console.error('Error adding new entry:', error)
		}
	}

	return (
		<div className="max-w-6xl mx-auto p-8">
			<div className="flex justify-between items-center">
				<h2 className="text-2xl font-bold mb-4">Masters List</h2>
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
						<th className="border px-4 py-2">Date</th>
						<th className="border px-4 py-2">GBP Rate</th>
						<th className="border px-4 py-2">INR Rate</th>
						<th className="border px-4 py-2">Gold Rate</th>
						<th className="border px-4 py-2">Diamond Rate</th>
					</tr>
				</thead>
				<tbody>
					{products.map((product) => (
						<tr key={product.product_id} className="border">
							<td className="border px-4 py-2">
								{formatDate(product.created_at)}
							</td>
							<td className="border px-4 py-2">{product.GBP_rate}</td>
							<td className="border px-4 py-2">{product.INR_rate}</td>
							<td className="border px-4 py-2">{product.gold_rate}</td>
							<td className="border px-4 py-2">{product.diamond_rate}</td>
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
									type="number"
									name="GBP_rate"
									value={formData.GBP_rate}
									onChange={handleChange}
									placeholder="GBP Rate"
									required
									className="border p-2 rounded w-full"
								/>
								<input
									type="number"
									name="INR_rate"
									value={formData.INR_rate}
									onChange={handleChange}
									placeholder="INR Rate"
									required
									className="border p-2 rounded w-full"
								/>
								<input
									type="number"
									name="gold_rate"
									value={formData.gold_rate}
									onChange={handleChange}
									placeholder="Gold Rate"
									required
									className="border p-2 rounded w-full"
								/>
								<input
									type="number"
									name="diamond_rate"
									value={formData.diamond_rate}
									onChange={handleChange}
									placeholder="Diamond Rate"
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

export default Master

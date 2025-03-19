import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../../redux/userProductsSlice'
import AddProduct from './AddProduct'
import { useUser } from '@clerk/clerk-react'

const ProductsList = () => {
	const dispatch = useDispatch()
	const { products } = useSelector((state) => state.userProducts)
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [showForm, setShowForm] = useState(false)
	const { user } = useUser()
	const dbId = user?.publicMetadata?.dbId

	useEffect(() => {
		if (products?.length === 0) {
			dispatch(fetchProducts(dbId))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleEditClick = (product) => {
		setSelectedProduct(product)
		setShowForm(true)
	}

	const handleCloseForm = () => {
		setShowForm(false)
		setSelectedProduct(null)
	}

	return (
		<div className="max-w-6xl mx-auto p-8">
			<h2 className="text-2xl font-bold mb-4">Products List</h2>
			<table className="min-w-full bg-white border border-gray-200">
				<thead>
					<tr className="bg-gray-100">
						<th className="border px-4 py-2">Name</th>
						<th className="border px-4 py-2">Category</th>
						<th className="border px-4 py-2">Price</th>
						<th className="border px-4 py-2">Actions</th>
					</tr>
				</thead>
				<tbody>
					{products?.map((product) => (
						<tr key={product.product_id} className="border">
							<td className="border px-4 py-2">{product.name}</td>
							<td className="border px-4 py-2">{product.category}</td>
							<td className="border px-4 py-2">{product.total_cost}</td>
							<td className="border px-4 py-2">
								<button
									onClick={() => handleEditClick(product)}
									className="bg-blue-500 text-white px-4 py-1 rounded"
								>
									Update
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Show AddProduct component for updating */}
			{showForm && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-1/2 h-[40rem] overflow-y-auto">
						<AddProduct
							initialData={selectedProduct}
							onSuccess={handleCloseForm}
						/>
						<button
							onClick={handleCloseForm}
							className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
						>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	)
}

export default ProductsList

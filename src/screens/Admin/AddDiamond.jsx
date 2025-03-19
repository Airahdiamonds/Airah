import { useState, useEffect } from 'react'
import { addDiamond, updateDiamond } from '../../utils/api'
import { convertFormData, diamondJson } from '../../utils/helpers'
import { useDispatch } from 'react-redux'
import { fetchDiamonds } from '../../redux/userProductsSlice'
import ImageURLInput from '../../components/ImageURLInput'
import { useUser } from '@clerk/clerk-react'

const AddDiamond = ({ initialData = null, onSuccess }) => {
	const dispatch = useDispatch()
	const [formData, setFormData] = useState(diamondJson)
	const { user } = useUser()
	const dbId = user?.publicMetadata?.dbId

	// Pre-fill the form if initialData is provided
	useEffect(() => {
		if (initialData) {
			setFormData(initialData)
		}
	}, [initialData])

	const handleChange = (e) => {
		const { name, value } = e.target
		setFormData({ ...formData, [name]: value })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		const cleanedData = convertFormData(formData)

		try {
			if (initialData) {
				// Update existing product
				await updateDiamond(initialData.diamond_id, cleanedData)
				dispatch(fetchDiamonds(dbId))
				alert('Diamond updated successfully!')
			} else {
				// Add new product
				await addDiamond(cleanedData)
				alert('Diamond added successfully!')
				dispatch(fetchDiamonds(dbId))
			}
			setFormData(diamondJson)
			onSuccess?.() // Call callback function to refresh list
		} catch (error) {
			console.error('Error:', error)
		}
	}

	return (
		<div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
			<h2 className="text-2xl font-bold mb-4">
				{initialData ? 'Update Diamond' : 'Add Diamond'}
			</h2>
			<form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
				<div>
					<label className="block font-medium">Diamond Name</label>
					<input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="border p-2 rounded w-full"
					/>
				</div>
				<div>
					<label className="block font-medium">SKU</label>
					<input
						type="text"
						name="SKU"
						value={formData.SKU}
						onChange={handleChange}
						className="border p-2 rounded w-full"
					/>
				</div>
				<div>
					<label className="block font-medium">Size</label>
					<select
						name="size"
						value={formData.size}
						onChange={handleChange}
						className="border p-2 rounded w-full"
					>
						<option value="0.5">0.5</option>
						<option value="1">1</option>
						<option value="1.5">1.5</option>
						<option value="2">2</option>
						<option value="2.5">2.5</option>
						<option value="3">3</option>
						<option value="3.5">3.5</option>
						<option value="4">4</option>
					</select>
				</div>
				<div className="col-span-2">
					<label className="block font-medium">Description</label>
					<textarea
						name="description"
						value={formData.description}
						onChange={handleChange}
						className="border p-2 rounded w-full"
					/>
				</div>
				<div>
					<label className="block font-medium">Shape</label>
					<select
						name="shape"
						value={formData.shape}
						onChange={handleChange}
						className="border p-2 rounded w-full"
					>
						<option value="round">round</option>
						<option value="princess">princess</option>
						<option value="emerald">emerald</option>
						<option value="asscher">asscher</option>
						<option value="oval">oval</option>
						<option value="pear">pear</option>
						<option value="marquise">marquise</option>
						<option value="radiant">radiant</option>
						<option value="cushion">cushion</option>
						<option value="heart">heart</option>
					</select>
				</div>
				<div>
					<label className="block font-medium">Cut</label>
					<select
						name="cut"
						value={formData.cut}
						onChange={handleChange}
						className="border p-2 rounded w-full"
					>
						<option value="regular">regular</option>
						<option value="best">best</option>
						<option value="premium">premium</option>
					</select>
				</div>
				<ImageURLInput
					imageURLs={formData.image_URL}
					setImageURLs={(newImageURLs) =>
						setFormData({ ...formData, image_URL: newImageURLs })
					}
				/>
				<div>
					<label className="block font-medium">Color</label>
					<select
						name="color"
						value={formData.color}
						onChange={handleChange}
						className="border p-2 rounded w-full"
					>
						<option value="D">D</option>
						<option value="E">E</option>
						<option value="F">F</option>
						<option value="G">G</option>
						<option value="H">H</option>
					</select>
				</div>
				<div>
					<label className="block font-medium">Clarity</label>
					<select
						name="clarity"
						value={formData.clarity}
						onChange={handleChange}
						className="border p-2 rounded w-full"
					>
						<option value="SI2">SI2</option>
						<option value="SI1">SI1</option>
						<option value="VS2">VS2</option>
						<option value="VS1">VS1</option>
						<option value="VVS2">VVS2</option>
						<option value="VVS1">VVS1</option>
						<option value="IF">IF</option>
					</select>
				</div>
				<div>
					<label className="block font-medium">Price</label>
					<input
						type="number"
						name="price"
						value={formData.price}
						onChange={handleChange}
						className="border p-2 rounded w-full"
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 text-white p-2 rounded col-span-2"
				>
					{initialData ? 'Update Diamond' : 'Add Diamond'}
				</button>
			</form>
		</div>
	)
}

export default AddDiamond

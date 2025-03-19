const ImageURLInput = ({ imageURLs, setImageURLs }) => {
	const handleImageChange = (e, index) => {
		const newImageUrls = [...imageURLs]
		newImageUrls[index] = e.target.value // Update the specific index
		setImageURLs(newImageUrls)
	}

	const addImageField = () => {
		setImageURLs([...imageURLs, ''])
	}

	const removeImageField = (index) => {
		const newImageUrls = [...imageURLs]
		newImageUrls.splice(index, 1) // Remove the specific index
		setImageURLs(newImageUrls)
	}

	return (
		<div>
			<label className="block font-medium">Image URLs</label>
			{imageURLs.map((url, index) => (
				<div key={index} className="flex items-center gap-2 mb-2">
					<input
						type="text"
						value={url}
						onChange={(e) => handleImageChange(e, index)}
						className="border p-2 rounded w-full"
					/>
					<button
						type="button"
						onClick={() => removeImageField(index)}
						className="bg-red-500 text-white px-3 py-1 rounded"
					>
						X
					</button>
				</div>
			))}
			<button
				type="button"
				onClick={addImageField}
				className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
			>
				Add Image
			</button>
		</div>
	)
}

export default ImageURLInput

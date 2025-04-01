import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'

const Filters = ({ filters, setFilters }) => {
	const diamondSize = ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4']
	const diamondClarity = ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF']
	const diamondShape = [
		'round',
		'princess',
		'emerald',
		'asscher',
		'oval',
		'pear',
		'marquise',
		'radiant',
		'cushion',
		'heart',
	]
	const diamondColor = ['D', 'E', 'F', 'G', 'H']
	const diamondCut = ['regular', 'best', 'premium']

	// Toggle state for collapsible filters
	const [openFilters, setOpenFilters] = useState({
		diamondSize: false,
		diamondClarity: false,
		diamondShape: false,
		diamondColor: false,
		diamondCut: false,
	})

	const toggleFilter = (category) => {
		setOpenFilters((prev) => ({ ...prev, [category]: !prev[category] }))
	}

	const handleFilterChange = (category, value) => {
		setFilters((prevFilters) => ({
			...prevFilters,
			[category]: prevFilters[category].includes(value)
				? prevFilters[category].filter((item) => item !== value)
				: [...prevFilters[category], value],
		}))
	}

	return (
		<div className="w-full lg:w-80 bg-white shadow-lg rounded-lg p-6 sticky top-4">
			<h2 className="text-xl font-semibold text-[#be9080] mb-6">Filters</h2>

			{/* Filter Groups in a Horizontal Layout */}
			<div className="flex flex-wrap justify-between gap-4">
				<FilterGroup
					title="Diamond Size"
					options={diamondSize}
					selected={filters.diamondSize}
					onChange={(value) => handleFilterChange('diamondSize', value)}
					isOpen={openFilters.diamondSize}
					toggle={() => toggleFilter('diamondSize')}
				/>

				<FilterGroup
					title="Clarity"
					options={diamondClarity}
					selected={filters.diamondClarity}
					onChange={(value) => handleFilterChange('diamondClarity', value)}
					isOpen={openFilters.diamondClarity}
					toggle={() => toggleFilter('diamondClarity')}
				/>

				<FilterGroup
					title="Shape"
					options={diamondShape}
					selected={filters.diamondShape}
					onChange={(value) => handleFilterChange('diamondShape', value)}
					isOpen={openFilters.diamondShape}
					toggle={() => toggleFilter('diamondShape')}
				/>

				<FilterGroup
					title="Color"
					options={diamondColor}
					selected={filters.diamondColor}
					onChange={(value) => handleFilterChange('diamondColor', value)}
					isOpen={openFilters.diamondColor}
					toggle={() => toggleFilter('diamondColor')}
				/>

				<FilterGroup
					title="Cut"
					options={diamondCut}
					selected={filters.diamondCut}
					onChange={(value) => handleFilterChange('diamondCut', value)}
					isOpen={openFilters.diamondCut}
					toggle={() => toggleFilter('diamondCut')}
				/>
			</div>

			{/* Reset Button */}
			<button
				onClick={() =>
					setFilters({
						diamondSize: [],
						diamondClarity: [],
						diamondShape: [],
						diamondColor: [],
						diamondCut: [],
					})
				}
				className="mt-6 w-full bg-red-500 text-white py-2 rounded-md shadow hover:bg-red-600 transition"
			>
				Reset Filters
			</button>
		</div>
	)
}

// Collapsible Filter Group
const FilterGroup = ({
	title,
	options,
	selected,
	onChange,
	isOpen,
	toggle,
}) => (
	<div className="mb-4 w-full">
		{/* Filter Title */}
		<button
			onClick={toggle}
			className="flex justify-between w-full text-lg font-medium text-[#be9080] py-2 border-b border-gray-300 mb-2"
		>
			{title}
			{isOpen ? <FaChevronUp /> : <FaChevronDown />}
		</button>
		
		{/* Filter Options */}
		{isOpen && (
			<div className="flex flex-wrap gap-2">
				{options.map((option) => (
					<label
						key={option}
						className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md cursor-pointer hover:bg-gray-200 transition-all duration-300 ease-in-out"
					>
						<input
							type="checkbox"
							checked={selected.includes(option)}
							onChange={() => onChange(option)}
							className="h-4 w-4 text-[#be9080] focus:ring-[#be9080]"
						/>
						<span className="text-sm">{option}</span>
					</label>
				))}
			</div>
		)}
	</div>
)

export default Filters

import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { motion } from 'framer-motion'

const Filters = ({ filters, setFilters }) => {
	const diamondSize = ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4']
	const diamondClarity = ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF']
	const diamondShape = ['round', 'princess', 'emerald', 'asscher', 'oval', 'pear', 'marquise', 'radiant', 'cushion', 'heart']
	const diamondColor = ['D', 'E', 'F', 'G', 'H']
	const diamondCut = ['regular', 'best', 'premium']

	const [activeFilter, setActiveFilter] = useState(null)

	const toggleFilter = (category) => {
		setActiveFilter(prev => (prev === category ? null : category))
	}

	const handleFilterChange = (category, value) => {
		setFilters(prev => ({
			...prev,
			[category]: prev[category].includes(value)
				? prev[category].filter(item => item !== value)
				: [...prev[category], value]
		}))
	}

	return (
		<div className="w-full  flex justify-center  px-4">
			<div className="w-full max-w-4xl  ">

				{/* Centered Tab Buttons + Reset */}
				<div className="flex  flex-wrap justify-center items-center gap-3 mb-6">
					<TabButton label="Size" active={activeFilter === 'diamondSize'} onClick={() => toggleFilter('diamondSize')} />
					<TabButton label="Clarity" active={activeFilter === 'diamondClarity'} onClick={() => toggleFilter('diamondClarity')} />
					<TabButton label="Shape" active={activeFilter === 'diamondShape'} onClick={() => toggleFilter('diamondShape')} />
					<TabButton label="Color" active={activeFilter === 'diamondColor'} onClick={() => toggleFilter('diamondColor')} />
					<TabButton label="Cut" active={activeFilter === 'diamondCut'} onClick={() => toggleFilter('diamondCut')} />
					<ResetButton onClick={() =>
						setFilters({
							diamondSize: [],
							diamondClarity: [],
							diamondShape: [],
							diamondColor: [],
							diamondCut: [],
						})
					} />
				</div>

				{/* Filter Options */}
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					transition={{ duration: 0.3 }}
				>
					{activeFilter === 'diamondSize' && (
						<OptionsList options={diamondSize} selected={filters.diamondSize} onChange={(val) => handleFilterChange('diamondSize', val)} />
					)}
					{activeFilter === 'diamondClarity' && (
						<OptionsList options={diamondClarity} selected={filters.diamondClarity} onChange={(val) => handleFilterChange('diamondClarity', val)} />
					)}
					{activeFilter === 'diamondShape' && (
						<OptionsList options={diamondShape} selected={filters.diamondShape} onChange={(val) => handleFilterChange('diamondShape', val)} />
					)}
					{activeFilter === 'diamondColor' && (
						<OptionsList options={diamondColor} selected={filters.diamondColor} onChange={(val) => handleFilterChange('diamondColor', val)} />
					)}
					{activeFilter === 'diamondCut' && (
						<OptionsList options={diamondCut} selected={filters.diamondCut} onChange={(val) => handleFilterChange('diamondCut', val)} />
					)}
				</motion.div>
			</div>
		</div>
	)
}

// Tab Button Component
const TabButton = ({ label, active, onClick }) => (
	<motion.button
		onClick={onClick}
		whileTap={{ scale: 0.95 }}
		className={`px-6 py-3  text-sm rounded-xl font-semibold transition-all border border-gray-400 ${
			active
				? 'bg-white text-gray-800 shadow-md'
				: 'bg-white/70 text-gray-700 hover:bg-white'
		}`}
	>
		{label} {active ? <FaChevronUp className="inline ml-1" /> : <FaChevronDown className="inline ml-1" />}
	</motion.button>
)

// Reset Button
const ResetButton = ({ onClick }) => (
	<motion.button
		onClick={onClick}
		whileTap={{ scale: 0.95 }}
		className="ml-2 px-5 py-3 border border-red-400 text-sm rounded-xl font-semibold bg-red-100 text-red-600 hover:bg-red-200 transition-all"
	>
		Reset
	</motion.button>
)

// Option List
const OptionsList = ({ options, selected, onChange }) => (
	<div className="mt-6 flex flex-wrap justify-center gap-4">
		{options.map((option) => (
			<label
				key={option}
				className="flex items-center gap-2 bg-white/80 border border-gray-300 px-4 py-2 rounded-xl cursor-pointer hover:bg-white text-gray-800 transition"
			>
				<input
					type="checkbox"
					checked={selected.includes(option)}
					onChange={() => onChange(option)}
					className="accent-gray-700 h-4 w-4"
				/>
				<span className="text-sm">{option}</span>
			</label>
		))}
	</div>
)

export default Filters

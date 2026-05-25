import princessPng from '../assets/shapes/princess.png'
import emeraldPng from '../assets/shapes/emerald.png'
import asscherPng from '../assets/shapes/asscher.png'
import ovalPng from '../assets/shapes/oval.png'
import pearPng from '../assets/shapes/pear.png'
import marquisePng from '../assets/shapes/marquise.png'
import radiantPng from '../assets/shapes/radiant.png'
import cushionPng from '../assets/shapes/cushion.png'
import PriceDisplay from './PriceDisplay'

const shapeOptions = [
  { value: 'round', label: 'Round' },
  { value: 'princess', label: 'Princess', image: princessPng },
  { value: 'emerald', label: 'Emerald', image: emeraldPng },
  { value: 'asscher', label: 'Asscher', image: asscherPng },
  { value: 'oval', label: 'Oval', image: ovalPng },
  { value: 'pear', label: 'Pear', image: pearPng },
  { value: 'marquise', label: 'Marquise', image: marquisePng },
  { value: 'radiant', label: 'Radiant', image: radiantPng },
  { value: 'cushion', label: 'Cushion', image: cushionPng },
]

const sizeOptions = ['0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4']
const cutOptions = [
  { value: 'regular', label: 'Regular' },
  { value: 'best', label: 'Best' },
  { value: 'premium', label: 'Premium' },
]
const colorOptions = ['D', 'E', 'F', 'G', 'H']
const clarityOptions = ['SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF']
const priceOptions = [10000, 25000]
const ratingOptions = [4, 3]

const diamondEmptyFilters = {
  diamondSize: [],
  diamondClarity: [],
  diamondShape: [],
  diamondColor: [],
  diamondCut: [],
}

const productEmptyFilters = {
  price: '',
  inStock: false,
  minRating: null,
}

const chipClassName = (selected) =>
  `min-h-9 rounded-[4px] border px-3 py-2 text-xs tracking-[0.08em] transition ${
    selected
      ? 'border-[#2b211d] bg-[#2b211d] text-white shadow-[0_10px_24px_rgba(43,33,29,0.12)]'
      : 'border-[#e3dbd3] bg-white text-[#6f625b] hover:border-[#bda28f] hover:text-[#2b211d]'
  }`

const sectionClassName = 'border-t border-[#eee7df] pt-5'

const FilterSection = ({ title, children }) => (
  <section className={sectionClassName}>
    <div className="mb-3 flex items-center justify-between gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2b211d]">
        {title}
      </h3>
    </div>
    {children}
  </section>
)

const ActiveChip = ({ label, onRemove }) => (
  <button
    type="button"
    onClick={onRemove}
    className="inline-flex items-center gap-2 rounded-full border border-[#e7ded6] bg-white px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-[#6f625b] transition hover:border-[#bda28f] hover:text-[#2b211d]"
  >
    {label}
    <span aria-hidden="true" className="text-sm leading-none">
      ×
    </span>
  </button>
)

const Filters = ({ filters, setFilters, variant = 'default', mode = 'diamond' }) => {
  const isRail = variant === 'rail' || variant === 'card'
  const emptyFilters = mode === 'product' ? productEmptyFilters : diamondEmptyFilters

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const toggleArrayFilter = (key, value) => {
    setFilters((prev) => {
      const currentValues = prev[key] ?? []
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [key]: nextValues,
      }
    })
  }

  const clearFilters = () => setFilters(emptyFilters)

  const activeChips = []

  if (mode === 'product') {
    if (filters.price) {
      activeChips.push({
        key: 'price',
        label: 'Price cap',
        onRemove: () => updateFilter('price', ''),
      })
    }
    if (filters.inStock) {
      activeChips.push({
        key: 'inStock',
        label: 'In stock',
        onRemove: () => updateFilter('inStock', false),
      })
    }
    if (filters.minRating) {
      activeChips.push({
        key: 'minRating',
        label: `${filters.minRating}+ stars`,
        onRemove: () => updateFilter('minRating', null),
      })
    }
  } else {
    const diamondConfig = [
      { key: 'diamondShape', options: shapeOptions },
      { key: 'diamondSize', options: sizeOptions.map((value) => ({ value, label: `${value}ct` })) },
      { key: 'diamondCut', options: cutOptions },
      { key: 'diamondColor', options: colorOptions.map((value) => ({ value, label: value })) },
      { key: 'diamondClarity', options: clarityOptions.map((value) => ({ value, label: value })) },
    ]

    diamondConfig.forEach(({ key, options }) => {
      ;(filters[key] ?? []).forEach((value) => {
        const option = options.find((item) => item.value === value)
        activeChips.push({
          key: `${key}-${value}`,
          label: option?.label ?? value,
          onRemove: () => toggleArrayFilter(key, value),
        })
      })
    })
  }

  const panelClassName = isRail
    ? 'w-full space-y-5 rounded-[6px] border border-[#e7ded6] bg-[#fbfaf8]/95 px-5 py-5 shadow-[0_18px_45px_rgba(43,33,29,0.06)]'
    : 'w-full space-y-5 border-y border-[#e7ded6] bg-[#fbfaf8] px-4 py-5 md:px-8'

  const optionGridClassName = isRail
    ? 'grid grid-cols-2 gap-2'
    : 'grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6'

  return (
    <div className={panelClassName}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#9a8779]">
            Curate
          </p>
          <h2 className="mt-1 text-lg font-medium text-[#2b211d]">
            Filters
          </h2>
        </div>
        <button
          type="button"
          onClick={clearFilters}
          className="text-xs uppercase tracking-[0.18em] text-[#9a8779] underline-offset-4 transition hover:text-[#2b211d] hover:underline"
        >
          Clear
        </button>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <ActiveChip
              key={chip.key}
              label={chip.label}
              onRemove={chip.onRemove}
            />
          ))}
        </div>
      )}

      {mode === 'product' ? (
        <>
          <FilterSection title="Price">
            <div className="grid grid-cols-1 gap-3">
              <label className="block">
                <span className="mb-2 block text-xs uppercase tracking-[0.16em] text-[#9a8779]">
                  Max price
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={filters.price ?? ''}
                  placeholder="Any"
                  onChange={(event) => updateFilter('price', event.target.value)}
                  className="h-11 w-full rounded-[4px] border border-[#e3dbd3] bg-white px-3 text-sm text-[#2b211d] outline-none transition focus:border-[#bda28f]"
                />
              </label>
              <div className={optionGridClassName}>
                {priceOptions.map((value) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => updateFilter('price', value)}
                    className={chipClassName(Number(filters.price) === value)}
                  >
                    Under <PriceDisplay value={value} fractionDigits={0} />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => updateFilter('price', '')}
                  className={chipClassName(!filters.price)}
                >
                  Any
                </button>
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Availability">
            <button
              type="button"
              onClick={() => updateFilter('inStock', !filters.inStock)}
              className={`${chipClassName(filters.inStock)} w-full`}
            >
              Ready to ship
            </button>
          </FilterSection>

          <FilterSection title="Reviews">
            <div className={optionGridClassName}>
              {ratingOptions.map((rating) => (
                <button
                  type="button"
                  key={rating}
                  onClick={() => updateFilter('minRating', filters.minRating === rating ? null : rating)}
                  className={chipClassName(filters.minRating === rating)}
                >
                  {rating}+ Stars
                </button>
              ))}
            </div>
          </FilterSection>
        </>
      ) : (
        <>
          <FilterSection title="Shape">
            <div className={optionGridClassName}>
              {shapeOptions.map(({ value, label, image }) => {
                const selected = (filters.diamondShape ?? []).includes(value)
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => toggleArrayFilter('diamondShape', value)}
                    aria-pressed={selected}
                    className={`flex min-h-16 flex-col items-center justify-center gap-2 rounded-[4px] border px-2 py-3 text-[11px] uppercase tracking-[0.12em] transition ${
                      selected
                        ? 'border-[#2b211d] bg-[#2b211d] text-white shadow-[0_10px_24px_rgba(43,33,29,0.12)]'
                        : 'border-[#e3dbd3] bg-white text-[#6f625b] hover:border-[#bda28f] hover:text-[#2b211d]'
                    }`}
                  >
                    {image ? (
                      <img src={image} alt="" className="h-7 w-7 object-contain opacity-75" />
                    ) : (
                      <span className="text-sm tracking-[0.08em]">RD</span>
                    )}
                    {label}
                  </button>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection title="Carat">
            <div className={optionGridClassName}>
              {sizeOptions.map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => toggleArrayFilter('diamondSize', value)}
                  className={chipClassName((filters.diamondSize ?? []).includes(value))}
                >
                  {value}ct
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Cut">
            <div className={optionGridClassName}>
              {cutOptions.map(({ value, label }) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => toggleArrayFilter('diamondCut', value)}
                  className={chipClassName((filters.diamondCut ?? []).includes(value))}
                >
                  {label}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Color">
            <div className={optionGridClassName}>
              {colorOptions.map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => toggleArrayFilter('diamondColor', value)}
                  className={chipClassName((filters.diamondColor ?? []).includes(value))}
                >
                  {value}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Clarity">
            <div className={optionGridClassName}>
              {clarityOptions.map((value) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => toggleArrayFilter('diamondClarity', value)}
                  className={chipClassName((filters.diamondClarity ?? []).includes(value))}
                >
                  {value}
                </button>
              ))}
            </div>
          </FilterSection>
        </>
      )}
    </div>
  )
}

export default Filters

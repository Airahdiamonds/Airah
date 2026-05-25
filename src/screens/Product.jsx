import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getProduct } from '../utils/api'
import { useNavigate, useParams } from 'react-router-dom'
import {
	ChevronLeft,
	Gem,
	Ruler,
	ShieldCheck,
	ShoppingBag,
	Truck,
} from 'lucide-react'
import { addToCart } from '../redux/favoritesCartSlice'
import ProductImages from '../components/ProductImages'
import ReviewsList from '../components/ReviewsList'
import PriceDisplay from '../components/PriceDisplay'

const RING_SIZES = ['4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14']

const SPEC_FIELDS = [
	['Gold', 'gold_quantity', 'gold_price', 'gold_total'],
	['Round', 'round_quantity', 'round_price', 'round_total'],
	['Oval', 'oval_quantity', 'oval_price', 'oval_total'],
	['Marquise', 'marquise_quantity', 'marquise_price', 'marquise_total'],
	['Emerald', 'emerald_quantity', 'emerald_price', 'emerald_total'],
	['Princess', 'princess_quantity', 'princess_price', 'princess_total'],
	['Pear', 'pear_quantity', 'pear_price', 'pear_total'],
	['Heart', 'heart_quantity', 'heart_price', 'heart_total'],
	['Other Diamond', 'other_diamond_quantity', 'other_diamond_price', 'other_diamond_total'],
	['Gemstone', 'gemstone_quantity', 'gemstone_price', 'gemstone_total'],
]

const PRODUCT_INFO_FIELDS = [
	['SKU', 'SKU'],
	['Category', 'category'],
	['Sub Category', 'subCategory'],
	['Segment', 'segment'],
	['Stock', 'stock_qty'],
]

const COST_FIELDS = [
	['Misc Cost', 'misc_cost'],
	['Labour Cost', 'labour_cost'],
	['Other Cost', 'other_cost'],
	['Total Cost', 'total_cost'],
]

const hasDisplayValue = (value) => {
	if (Array.isArray(value)) return value.length > 0
	return value !== undefined && value !== null && value !== ''
}

const formatNumber = (value) => {
	if (!hasDisplayValue(value)) return '0'
	const number = Number(value)
	if (Number.isNaN(number)) return value
	return number.toLocaleString(undefined, {
		maximumFractionDigits: 2,
	})
}

const formatTextValue = (value) => {
	if (!hasDisplayValue(value)) return 'Not specified'
	if (Array.isArray(value)) return value.join(', ')
	return value
}

function Product() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { id } = useParams()
	const { currentUser, guestUser } = useSelector((state) => state.localization)
	const [product, setProduct] = useState(null)
	const [selectedSize, setSelectedSize] = useState(RING_SIZES[0])

	useEffect(() => {
		getProduct(id).then((res) => {
			setProduct(res.data[0])
		})
	}, [id])

	const handleClick = async () => {
		await dispatch(
			addToCart({
				userId: currentUser,
				guestId: guestUser,
				productId: product.product_id,
				diamondId: null,
				ringStyleId: null,
				ringSize: selectedSize,
				quantity: 1,
			})
		)
		navigate('/cart')
	}

	const productInfo = PRODUCT_INFO_FIELDS.map(([label, key]) => [
		label,
		product?.[key],
	]).filter(([, value]) => hasDisplayValue(value))
	const collectionLabel = product?.subCategory
		? decodeURIComponent(product.subCategory).replace(/-/g, ' ')
		: 'Fine jewellery'
	const productTags = Array.isArray(product?.tags) ? product.tags : []

	const handleBack = () => {
		if (product?.subCategory) {
			navigate(`/product/${product.subCategory}`)
			return
		}

		navigate(-1)
	}

	return (
		<div className="min-h-screen bg-[#f8f6f3] text-[#211916]">
			<div className="mx-auto w-full max-w-[1440px] px-5 pb-20 pt-8 md:px-8 lg:px-10">
				<button
					type="button"
					onClick={handleBack}
					className="mb-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#8a7b72] transition-colors hover:text-[#211916]"
				>
					<ChevronLeft size={14} strokeWidth={1.5} />
					Back to Products
				</button>

				<div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] lg:gap-12 xl:gap-16">
					<ProductImages product={product} />

					<div className="w-full self-start lg:sticky lg:top-32">
						<div className="border border-[#e7ded6] bg-[#fbfaf8]/90 px-5 py-6 shadow-[0_18px_55px_rgba(43,33,29,0.06)] backdrop-blur md:px-7">
							<div className="mb-6 flex items-center justify-between gap-4 border-b border-[#e7ded6] pb-4">
								<p className="text-[10px] uppercase tracking-[0.28em] text-[#9a8779]">
									{collectionLabel}
								</p>
								{product?.SKU && (
									<p className="text-[10px] uppercase tracking-[0.2em] text-[#8a7b72]">
										{product.SKU}
									</p>
								)}
							</div>

							<div className="space-y-4">
								<h1 className="text-4xl font-light leading-[1.04] tracking-normal text-[#211916] md:text-[44px] xl:text-[52px]">
									{product?.name}
								</h1>
								<p className="max-w-md text-sm leading-7 text-[#6f625b]">
									A refined diamond piece selected for quiet brilliance, balanced
									proportion, and everyday permanence.
								</p>
								<div className="flex items-end justify-between gap-5 pt-1">
									<div className="text-3xl font-light text-[#211916] md:text-4xl">
										<PriceDisplay value={product?.total_cost} />
									</div>
									<p className="hidden text-right text-[10px] uppercase leading-5 tracking-[0.2em] text-[#9a8779] sm:block">
										Includes insured delivery
									</p>
								</div>
							</div>

							<div className="my-6 grid grid-cols-2 gap-3 border-y border-[#e7ded6] py-4 text-[11px] uppercase tracking-[0.18em] text-[#7e7068]">
								<div className="flex items-center gap-2">
									<Gem className="h-4 w-4 text-[#a16207]" strokeWidth={1.4} />
									Certified diamonds
								</div>
								<div className="flex items-center gap-2">
									<ShieldCheck className="h-4 w-4 text-[#a16207]" strokeWidth={1.4} />
									Lifetime care
								</div>
							</div>

							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#8a7b72]">
										<Ruler className="h-4 w-4" strokeWidth={1.4} />
										Ring size
									</div>
									<span className="text-sm text-[#211916]">{selectedSize}</span>
								</div>
								<div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
									{RING_SIZES.map((size) => {
										const isActive = selectedSize === size
										return (
											<button
												key={size}
												type="button"
												onClick={() => setSelectedSize(size)}
												className={`h-11 border text-sm transition duration-200 ${
													isActive
														? 'border-[#211916] bg-[#211916] text-[#fbfaf8] shadow-[0_12px_25px_rgba(43,33,29,0.14)]'
														: 'border-[#d9cfc6] bg-white/60 text-[#4a403a] hover:border-[#211916] hover:bg-white'
												}`}
											>
												{size}
											</button>
										)
									})}
								</div>
							</div>

							<div className="mt-6 space-y-3">
								<button
									type="button"
									onClick={handleClick}
									disabled={!product}
									className="flex h-14 w-full items-center justify-center gap-3 bg-[#211916] text-[11px] uppercase tracking-[0.26em] text-[#fbfaf8] transition duration-200 hover:bg-[#3b302b] disabled:cursor-not-allowed disabled:opacity-40"
								>
									<ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
									Add to Cart
								</button>
								<p className="text-center text-xs leading-6 text-[#7e7068]">
									Complimentary insured shipping and signature delivery.
								</p>
							</div>

							<dl className="mt-6 grid grid-cols-1 gap-4 border-t border-[#e7ded6] pt-5 text-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
								<div className="flex items-start gap-3 text-[#6f625b]">
									<ShieldCheck
										size={18}
										strokeWidth={1.25}
										className="mt-0.5 shrink-0 text-[#a16207]"
									/>
									<div>
										<dt className="text-[#211916]">Risk-free purchase</dt>
										<dd className="mt-0.5 text-xs leading-5 text-[#8a7b72]">
											30-day returns, lifetime warranty
										</dd>
									</div>
								</div>
								<div className="flex items-start gap-3 text-[#6f625b]">
									<Truck
										size={18}
										strokeWidth={1.25}
										className="mt-0.5 shrink-0 text-[#a16207]"
									/>
									<div>
										<dt className="text-[#211916]">Complimentary shipping</dt>
										<dd className="mt-0.5 text-xs leading-5 text-[#8a7b72]">
											Dispatched after final quality inspection
										</dd>
									</div>
								</div>
							</dl>
						</div>
					</div>
				</div>

				<section className="mt-16 border-t border-[#e7ded6] pt-12 md:mt-20 md:pt-14">
					<div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
						<div className="lg:col-span-4">
							<p className="mb-3 text-[11px] uppercase tracking-[0.28em] text-[#9a8779]">
								The Detail
							</p>
							<h2 className="max-w-sm text-3xl font-light leading-tight text-[#211916] md:text-4xl">
								Full specifications, without the clutter.
							</h2>
						</div>
						<div className="lg:col-span-8">
							<div className="space-y-10">
								<div>
									{product?.description && (
										<p className="text-[15px] leading-8 text-[#5f534d] md:text-base">
											{product.description}
										</p>
									)}
									<p className="mt-6 border-l border-[#cdb9aa] pl-5 text-sm leading-7 text-[#7e7068]">
										Each piece is individually inspected before dispatch and arrives in
										Airah signature packaging.
									</p>
								</div>

								<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
									<SpecPanel title="Product Information">
										<dl className="divide-y divide-[#e7ded6]">
											{productInfo.map(([label, value]) => (
												<SpecItem key={label} label={label} value={formatTextValue(value)} />
											))}
											{productTags.length > 0 && (
												<div className="grid grid-cols-[120px_1fr] gap-4 py-3">
													<dt className="text-[10px] uppercase tracking-[0.2em] text-[#8a7b72]">
														Tags
													</dt>
													<dd className="flex flex-wrap gap-2 text-sm text-[#211916]">
														{productTags.map((tag) => (
															<span
																key={tag}
																className="border border-[#e7ded6] bg-white/70 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] text-[#6f625b]"
															>
																{tag}
															</span>
														))}
													</dd>
												</div>
											)}
										</dl>
									</SpecPanel>

									<SpecPanel title="Cost Breakdown">
										<dl className="divide-y divide-[#e7ded6]">
											{COST_FIELDS.map(([label, key]) => (
												<div
													key={key}
													className="grid grid-cols-[120px_1fr] gap-4 py-3"
												>
													<dt className="text-[10px] uppercase tracking-[0.2em] text-[#8a7b72]">
														{label}
													</dt>
													<dd className="text-sm tabular-nums text-[#211916]">
														<PriceDisplay value={product?.[key]} />
													</dd>
												</div>
											))}
										</dl>
									</SpecPanel>
								</div>

								<SpecPanel title="Material And Stone Details">
									<div className="overflow-x-auto">
										<table className="w-full min-w-[640px] border-collapse text-left">
											<thead>
												<tr className="border-b border-[#d9cfc6] text-[10px] uppercase tracking-[0.2em] text-[#8a7b72]">
													<th className="py-3 pr-4 font-normal">Material</th>
													<th className="px-4 py-3 font-normal">Quantity</th>
													<th className="px-4 py-3 font-normal">Rate</th>
													<th className="py-3 pl-4 text-right font-normal">Total</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-[#e7ded6]">
												{SPEC_FIELDS.map(([label, quantityKey, priceKey, totalKey]) => (
													<tr key={label} className="text-sm text-[#211916]">
														<th className="py-3 pr-4 font-normal text-[#5f534d]">
															{label}
														</th>
														<td className="px-4 py-3 tabular-nums text-[#211916]">
															{formatNumber(product?.[quantityKey])}
														</td>
														<td className="px-4 py-3 tabular-nums text-[#211916]">
															<PriceDisplay value={product?.[priceKey]} />
														</td>
														<td className="py-3 pl-4 text-right tabular-nums text-[#211916]">
															<PriceDisplay value={product?.[totalKey]} />
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</SpecPanel>
							</div>
						</div>
					</div>
				</section>

				{product?.product_id && (
					<div className="mt-20 border-t border-[#e7ded6] pt-10 md:mt-24 md:pt-12">
						<ReviewsList product_id={product?.product_id} />
					</div>
				)}
			</div>
		</div>
	)
}

function SpecPanel({ title, children }) {
	return (
		<section className="border border-[#e7ded6] bg-[#fbfaf8]/70 p-4 md:p-5">
			<h3 className="border-b border-[#e7ded6] pb-3 text-[11px] uppercase tracking-[0.24em] text-[#9a8779]">
				{title}
			</h3>
			<div className="pt-1">{children}</div>
		</section>
	)
}

function SpecItem({ label, value }) {
	return (
		<div className="grid grid-cols-[120px_1fr] gap-4 py-3">
			<dt className="text-[10px] uppercase tracking-[0.2em] text-[#8a7b72]">
				{label}
			</dt>
			<dd className="text-sm text-[#211916]">{value}</dd>
		</div>
	)
}

export default Product

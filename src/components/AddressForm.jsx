import { useState } from 'react'

const FIELDS = [
	{ key: 'full_name', label: 'Full name', required: true },
	{ key: 'phone_number', label: 'Phone', required: true },
	{ key: 'address_line1', label: 'Address line 1', required: true },
	{ key: 'address_line2', label: 'Address line 2 (optional)', required: false },
	{ key: 'city', label: 'City', required: true },
	{ key: 'state', label: 'State', required: true },
	{ key: 'country', label: 'Country', required: true },
	{ key: 'pincode', label: 'Pincode', required: true },
]

const emptyAddress = FIELDS.reduce((acc, f) => ({ ...acc, [f.key]: '' }), {})

export default function AddressForm({ value, onChange }) {
	const [local, setLocal] = useState(value || emptyAddress)

	const update = (key, val) => {
		const next = { ...local, [key]: val }
		setLocal(next)
		onChange?.(next)
	}

	return (
		<div className="space-y-4">
			<div>
				<p className="text-[11px] uppercase tracking-[0.22em] text-[#9a8779]">
					Shipping Address
				</p>
				<p className="mt-1 text-sm leading-6 text-[#7e7068]">
					Used for insured delivery and order updates.
				</p>
			</div>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				{FIELDS.map((f) => (
					<input
						key={f.key}
						type="text"
						placeholder={f.label}
						value={local[f.key] || ''}
						onChange={(e) => update(f.key, e.target.value)}
						className="h-11 w-full border border-[#d9cfc6] bg-white/70 px-3 text-sm text-[#211916] outline-none transition placeholder:text-[#a18f83] focus:border-[#211916]"
						required={f.required}
					/>
				))}
			</div>
		</div>
	)
}

export function isAddressComplete(address) {
	if (!address) return false
	return FIELDS.filter((f) => f.required).every(
		(f) => typeof address[f.key] === 'string' && address[f.key].trim() !== ''
	)
}

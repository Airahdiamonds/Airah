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
		<div className="space-y-2">
			<p className="text-lg font-semibold text-gray-900">Shipping Address</p>
			<div className="grid grid-cols-2 gap-2">
				{FIELDS.map((f) => (
					<input
						key={f.key}
						type="text"
						placeholder={f.label}
						value={local[f.key] || ''}
						onChange={(e) => update(f.key, e.target.value)}
						className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
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

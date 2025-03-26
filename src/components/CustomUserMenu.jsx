import { useUser, useClerk } from '@clerk/clerk-react'
import { useState } from 'react'

export default function CustomUserMenu() {
	const { user } = useUser()
	const { signOut } = useClerk()
	const [isOpen, setIsOpen] = useState(false)

	if (!user) return null // Hide if not signed in

	return (
		<div className="relative">
			{/* Profile Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				// className="flex items-center space-x-2 bg-gray-200 rounded-full p-2"
			>
				<img
					src={user.imageUrl}
					alt="Profile"
					className="w-8 h-8 rounded-full"
				/>
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
					<ul className="p-2 text-gray-700">
						<li className="p-2 hover:bg-gray-100 cursor-pointer">
							<a href="/orders">My Orders</a>
						</li>
						<li className="p-2 hover:bg-gray-100 cursor-pointer">
							<button onClick={() => signOut()}>Sign Out</button>
						</li>
					</ul>
				</div>
			)}
		</div>
	)
}

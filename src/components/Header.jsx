import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Search } from 'lucide-react'
import LOGO from '../assets/logo.webp'
import {
	SignedIn,
	SignedOut,
	SignInButton,
	UserButton,
	useUser,
} from '@clerk/clerk-react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCurrencyRates, setCountry } from '../redux/localizationSlice'
import { Link, useNavigate } from 'react-router-dom'
import { menuItems } from '../utils/menuItems'
import model from '../assets/Wedding-rings.jpg'
import {
	fetchUserCartItems,
	fetchUserFavorites,
} from '../redux/favoritesCartSlice'

const adminNavLinks = [
	{ to: '/dashboard', label: 'Dashboard' },
	{ to: '/master', label: 'Master' },
	{ to: '/userList', label: 'User List' },
	{ to: '/productsList', label: 'Product List' },
	{ to: '/diamondsList', label: 'Diamond List' },
	{ to: '/stylesList', label: 'Style List' },
	{ to: '/addProducts', label: 'Add Products' },
	{ to: '/addDiamonds', label: 'Add Diamonds' },
	{ to: '/addStyles', label: 'Add Styles' },
	{ to: '/addCoupon', label: 'Coupons' },
]

const userNavLinks = [
	{ to: '/customize', label: 'Customize' },
	{ to: '/product', label: 'Products' },
	{ to: '/Edu', label: 'Education' },
]

export default function Header() {
	const [dropdownOpen, setDropdownOpen] = useState(null)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [query, setQuery] = useState('')
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { country } = useSelector((state) => state.localization)
	const { favorites, cartItems } = useSelector((state) => state.favoritesCart)
	const { user, isSignedIn } = useUser()
	const role = user?.publicMetadata?.role
	const dbId = user?.publicMetadata?.dbId

	// Fetch user data and currency rates on component mount
	useEffect(() => {
		if (dbId) {
			dispatch(fetchUserFavorites(dbId))
			dispatch(fetchUserCartItems(dbId))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, isSignedIn])

	useEffect(() => {
		dispatch(fetchCurrencyRates())
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Handlers for mobile menu, country change, and search
	const handleMobileMenuToggle = () => {
		setMobileMenuOpen(!mobileMenuOpen)
	}

	const handleCountryChange = (event) => {
		dispatch(setCountry(event.target.value))
	}

	const handleSearch = () => {
		navigate('/search', { state: query })
	}

	// Render navigation links dynamically
	const renderNavLinks = (links) => {
		return links.map((link, index) => (
			<Link
				key={index}
				to={link.to}
				className="relative text-gray-700 hover:text-gray-900 font-medium after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-black after:w-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
			>
				{link.label}
			</Link>
		))
	}

	return (
		<header className="bg-white w-full p-4 sticky top-0 z-50">
			<div className="max-w-full mx-auto flex items-center justify-evenly">
				{/* Logo */}
				<div className="text-2xl font-bold text-gray-800 flex items-center space-x-2">
					<Link to="/">
						<img
							src={LOGO}
							alt="Brand Logo"
							className="h-20 w-auto cursor-pointer"
						/>
					</Link>
				</div>

				{/* Navigation */}
				{role === 'admin' && isSignedIn ? (
					<nav className="flex-1 flex justify-center space-x-6">
						{renderNavLinks(adminNavLinks)}
						<div className="flex items-center space-x-4">
							<SignedIn>
								<button className="p-2 rounded-full hover:bg-gray-100">
									<UserButton size={20} />
								</button>
							</SignedIn>
						</div>
					</nav>
				) : (
					<nav className="flex-1 flex justify-center space-x-6 items-center">
						{renderNavLinks(userNavLinks)}
						{Array.isArray(menuItems) && menuItems.length > 0
							? menuItems.map((item, index) => (
									<div
										key={index}
										className="relative group cursor-pointer text-gray-700 hover:text-gray-900 font-medium"
										onMouseEnter={() => setDropdownOpen(index)}
										onMouseLeave={() => setDropdownOpen(null)}
									>
										{/* Menu Item with Underline Animation */}
										<span className="relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-black after:w-0 after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full">
											{item.name}
										</span>

										{/* Dropdown Menu */}
										{dropdownOpen === index && item.submenu && (
											<div className="fixed z-10 left-0 top-[115px] bg-white w-full grid grid-cols-3">
												{/* Submenu Items (Left Section) */}
												<div className="col-span-2 grid grid-cols-3 gap-6 px-6">
													{item.submenu.map((category, catIndex) => (
														<div key={catIndex}>
															<h3 className="text-gray-900 font-semibold mb-2">
																{category.heading}
															</h3>
															<ul className="space-y-1">
																{category.items.map((subitem, subIndex) => (
																	<li
																		key={subIndex}
																		className="text-gray-700 hover:text-gray-900 cursor-pointer"
																	>
																		{subitem}
																	</li>
																))}
															</ul>
														</div>
													))}
												</div>

												{/* Full-Size Image (Right Section) */}
												<div className="col-span-1 flex justify-center items-center">
													<img
														src={model}
														alt="Category Preview"
														className="w-full h-auto"
													/>
												</div>
											</div>
										)}
									</div>
							  ))
							: null}
						{/* Right Controls */}
						<div className="flex items-center space-x-4">
							{/* Search Bar */}
							<div className="hidden md:flex items-center space-x-2">
								<input
									type="text"
									placeholder="Search"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									className="border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 w-48"
								/>
								<Search
									onClick={handleSearch}
									className="text-gray-500 cursor-pointer"
									size={18}
								/>
							</div>

							{/* Icons */}
							<SignedIn>
								<button className="p-2 rounded-full hover:bg-gray-100">
									<UserButton size={20} />
								</button>
							</SignedIn>
							<SignedOut>
								<SignInButton />
							</SignedOut>
							<Link
								to="/favorites"
								className="p-2 rounded-full hover:bg-gray-100 relative"
							>
								<Heart size={20} />
							</Link>
							{favorites ? favorites.length : '0'}

							<Link
								to="/cart"
								className="p-2 rounded-full hover:bg-gray-100 relative"
							>
								<ShoppingCart size={20} />
							</Link>
							{cartItems ? cartItems.length : '(0)'}

							{/* Mobile Menu */}
							<button
								className="md:hidden p-2 rounded-full hover:bg-gray-100"
								onClick={handleMobileMenuToggle}
							>
								☰
							</button>

							<select
								value={country}
								onChange={handleCountryChange}
								className="py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
							>
								<option value="INR">INR</option>
								<option value="USD">USD</option>
								<option value="GBP">GBP</option>
							</select>
						</div>
					</nav>
				)}
			</div>

			{/* Mobile Dropdown */}
			{mobileMenuOpen && (
				<div className="md:hidden bg-white shadow-md p-4 flex flex-col space-y-2">
					{menuItems.map((item, index) => (
						<div
							key={index}
							className="text-gray-700 hover:text-gray-900 font-medium"
						>
							{item.name}
							{item.submenu.length > 0 && (
								<div className="space-y-2">
									{item.submenu.map((category, catIndex) => (
										<div key={catIndex}>
											<h3 className="text-gray-900 font-semibold">
												{category.heading}
											</h3>
											<ul className="space-y-1">
												{category.items.map((subitem, subIndex) => (
													<li
														key={subIndex}
														className="text-gray-700 hover:text-gray-900"
													>
														{subitem}
													</li>
												))}
											</ul>
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</header>
	)
}

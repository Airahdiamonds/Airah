import { useState, useEffect } from 'react'
import { ShoppingCart, Heart, Search, Menu, X, ChevronDown } from 'lucide-react'
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
import {
	fetchUserCartItems,
	fetchUserFavorites,
} from '../redux/favoritesCartSlice'
import { menuItems } from '../utils/helpers'
import CustomUserMenu from './CustomUserMenu'

const userNavLinks = [
	// { to: '/customize', label: 'Customize' },
	// { to: '/product', label: 'Products' },
	{ to: '/Edu', label: 'Education' },
]

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [activeDropdown, setActiveDropdown] = useState(null)
	const [query, setQuery] = useState('')
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { country } = useSelector((state) => state.localization)
	const { favorites, cartItems } = useSelector((state) => state.favoritesCart)
	const { user, isSignedIn } = useUser()
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
		<header className="bg-white w-full py-2 px-4 sticky top-0 z-50 border-b">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center">
							<img src={LOGO} alt="Brand Logo" className="h-16 w-auto" />
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="center_1">
						{Array.isArray(menuItems) && menuItems.length > 0
							? menuItems.map((item, index) => (
									<div
										key={index}
										className="center_2"
										onMouseEnter={() => setActiveDropdown(index)}
										onMouseLeave={() => setActiveDropdown(null)}
									>
										{/* Menu Item with Underline Animation */}
										<span className="relative after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-black after:w-0 after:transition-all after:duration-300 after:ease-in-out group-hover:after:w-full">
											{item.name}
										</span>

										{/* Dropdown Menu */}
										{activeDropdown === index && item.submenu && (
											<div className="center_3">
												<div className="center_4">
													{/* Submenu Items */}
													{item.submenu.map((category, catIndex) => (
														<div key={catIndex} className="center_5">
															<h3 className="text-gray-900 font-semibold mb-2">
																{category.heading}
															</h3>
															<ul className="space-y-1">
																{category.items.map((subitem, subIndex) => (
																	<li
																		key={subIndex}
																		className="text-gray-700 hover:text-gray-900 cursor-pointer"
																	>
																		<Link to={subitem.link}>
																			{subitem.name}
																		</Link>
																	</li>
																))}
															</ul>
														</div>
													))}

													{/* Image */}
													<div className="hidden md:flex justify-center items-center">
														<img
															src={LOGO}
															alt="Category Preview"
															className="w-full h-auto rounded-lg"
														/>
													</div>
												</div>
											</div>
										)}
									</div>
							  ))
							: null}
						{renderNavLinks(userNavLinks)}
					</nav>

					{/* Right Controls */}
					<div className="flex items-center space-x-2 md:space-x-4">
						{/* Search Bar - Desktop */}
						<div className="hidden md:flex items-center relative">
							<input
								type="text"
								placeholder="Search"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="w-32 lg:w-48 h-9 rounded-full pr-8 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4"
							/>
							<Search
								onClick={handleSearch}
								className="absolute right-3 text-gray-500 cursor-pointer"
								size={18}
							/>
						</div>

						{/* User Authentication */}
						<SignedIn>
							{/* <button className="rounded-full bg-gray-200 p-2"> */}
							{/* <UserButton size={20} /> */}
							<CustomUserMenu />
							{/* </button> */}
						</SignedIn>
						<SignedOut>
							<SignInButton />
						</SignedOut>

						{/* Favorites */}
						<Link
							to="/favorites"
							className="relative p-2 rounded-full hover:bg-gray-100"
						>
							<Heart size={20} />
							{favorites ? (
								<span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
									{favorites.length}
								</span>
							) : null}
						</Link>

						{/* Cart */}
						<Link
							to="/cart"
							className="relative p-2 rounded-full hover:bg-gray-100"
						>
							<ShoppingCart size={20} />
							{cartItems ? (
								<span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
									{cartItems.length}
								</span>
							) : null}
						</Link>

						{/* Country Selector */}
						<select
							value={country}
							onChange={handleCountryChange}
							className="hidden sm:block py-1 px-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
						>
							<option value="INR">INR</option>
							<option value="USD">USD</option>
							<option value="GBP">GBP</option>
							<option value="EUR">EUR</option>
							<option value="AUD">AUD</option>
							<option value="OMR">OMR</option>
							<option value="AED">AED</option>
						</select>

						{/* Mobile Menu Trigger */}
						<button
							onClick={handleMobileMenuToggle}
							className="lg:hidden p-2 rounded-md hover:bg-gray-100"
						>
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle menu</span>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Sidebar */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-50 lg:hidden">
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-black/25"
						onClick={handleMobileMenuToggle}
					/>

					{/* Sidebar */}
					<div className="fixed inset-y-0 left-0 w-[280px] sm:w-[350px] bg-white shadow-lg overflow-y-auto">
						<div className="h-full flex flex-col">
							{/* Header */}
							<div className="border-b p-4 flex items-center justify-between">
								<Link to="/" className="flex items-center">
									<img src={LOGO} alt="Brand Logo" className="h-10 w-auto" />
								</Link>
								<button
									onClick={handleMobileMenuToggle}
									className="p-2 rounded-md hover:bg-gray-100"
								>
									<X className="h-5 w-5" />
									<span className="sr-only">Close</span>
								</button>
							</div>

							{/* Search */}
							<div className="p-4 border-b">
								<div className="relative">
									<input
										type="text"
										placeholder="Search"
										value={query}
										onChange={(e) => setQuery(e.target.value)}
										className="w-full pr-8 py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									<Search
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
										size={18}
									/>
								</div>
							</div>

							{/* User Authentication - Mobile */}
							<div className="p-4 border-b">
								<SignedIn>
									<div className="flex items-center space-x-3">
										<button className="rounded-full bg-gray-200 p-2">
											<UserButton size={20} />
										</button>
										<span className="text-sm font-medium">My Account</span>
									</div>
								</SignedIn>
								<SignedOut>
									<SignInButton />
								</SignedOut>
							</div>

							{/* Navigation Links */}
							<div className="flex-1 overflow-auto py-2">
								<nav className="flex flex-col space-y-1 px-2">
									{renderNavLinks(userNavLinks)}
									{Array.isArray(menuItems) && menuItems.length > 0
										? menuItems.map((item, index) => (
												<div key={index} className="w-full">
													<button
														onClick={() =>
															setActiveDropdown(
																index === activeDropdown ? null : index
															)
														}
														className="flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900"
													>
														<span>{item.name}</span>
														<ChevronDown
															className={`h-4 w-4 transition-transform ${
																activeDropdown === index ? 'rotate-180' : ''
															}`}
														/>
													</button>

													{activeDropdown === index && (
														<div className="pl-4">
															{item.submenu.map((category, catIndex) => (
																<div key={catIndex} className="py-2">
																	<h3 className="font-medium text-sm text-gray-900 px-3 py-1">
																		{category.heading}
																	</h3>
																	<ul className="space-y-1 mt-1">
																		{category.items.map((subitem, subIndex) => (
																			<li key={subIndex}>
																				<Link
																					to="#"
																					className="block py-1 px-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
																				>
																					{subitem}
																				</Link>
																			</li>
																		))}
																	</ul>
																</div>
															))}
														</div>
													)}
												</div>
										  ))
										: null}
								</nav>
							</div>

							{/* Footer */}
							<div className="border-t p-4">
								<div className="flex items-center justify-between">
									<div className="flex space-x-4">
										<Link
											to="/favorites"
											className="flex items-center space-x-2 text-sm text-gray-700"
										>
											<Heart size={16} />
											<span>Favorites</span>
										</Link>
										<Link
											to="/cart"
											className="flex items-center space-x-2 text-sm text-gray-700"
										>
											<ShoppingCart size={16} />
											<span>Cart</span>
										</Link>
									</div>

									<select
										value={country}
										onChange={handleCountryChange}
										className="py-1 px-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
									>
										<option value="INR">INR</option>
										<option value="USD">USD</option>
										<option value="GBP">GBP</option>
									</select>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</header>
	)
}

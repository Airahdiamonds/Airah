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
import { FaGoogle } from 'react-icons/fa'
import {
	fetchCurrentUser,
	signInUser,
	signoutUser,
	signUpUser,
} from '../utils/api'

const userNavLinks = [
	{ to: '/customize', label: 'Customize' },
	// { to: '/product', label: 'Products' },
	// { to: '/Edu', label: 'Education' },
]

const userNavLinks2 = [
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

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [authMode, setAuthMode] = useState('login')
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [currentUser, setCurrentUser] = useState(null)
	useEffect(() => {
		const getUser = async () => {
			const user = await fetchCurrentUser()
			if (user) {
				setCurrentUser(user)
				console.log(user)
			}
		}
		getUser()
	}, [])

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
		if (!query) return
		navigate('/search', { state: query })
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
		setError('') // Clear error on input change
		setSuccess('') // Clear success on input change
	}

	const handleLogin = async (e) => {
		e.preventDefault()
		const { email, password } = formData

		if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
			setError('Please enter a valid email address')
			return
		}
		const result = await signInUser({ email, password })
		if (result) {
			setSuccess('Account created successfully! Please log in.')
			setFormData({ email: '', password: '' })
			const user = await fetchCurrentUser()
			if (user) {
				setCurrentUser(user)
				console.log(user)
			}
			setIsModalOpen(false)
		} else {
			alert('Sign up failed')
		}
	}
	const handleLogout = async () => {
		await signoutUser()
		setCurrentUser(null)
	}
	const handleSignUp = async (e) => {
		e.preventDefault()
		const { name, email, password, confirmPassword } = formData

		// Basic validation
		if (!name.trim()) {
			setError('Full name is required')
			return
		}
		if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
			setError('Please enter a valid email address')
			return
		}
		if (password.length < 8) {
			setError('Password must be at least 8 characters long')
			return
		}
		if (password !== confirmPassword) {
			setError('Passwords do not match')
			return
		}
		if (formData.password !== formData.confirmPassword) {
			alert('Passwords do not match')
			return
		}
		const result = await signUpUser({ name, email, password })
		if (result) {
			setSuccess('Account created successfully! Please log in.')
			setFormData({ name: '', email: '', password: '', confirmPassword: '' })
			const user = await fetchCurrentUser()
			if (user) {
				setCurrentUser(user)
				console.log(user)
			}
			setIsModalOpen(false)
		} else {
			alert('Sign up failed')
		}
	}
	const handleGoogleAuth = () => {
		const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
		const redirectUri = 'http://localhost:4000/api/auth/google/callback' // Update this for production
		const scope = encodeURIComponent('profile email')
		const state = crypto.randomUUID() // Optional, useful for CSRF protection
		const responseType = 'code'

		const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${state}&access_type=offline&prompt=consent`

		window.location.href = googleAuthUrl
	}

	// Render navigation links dynamically
	const renderNavLinks = (links) => {
		return links.map((link, index) => (
			<Link
				key={index}
				to={link.to}
				className="relative px-3 py-2 text-gray-700 hover:text-gray-900 font-medium after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-black after:w-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
			>
				{link.label}
			</Link>
		))
	}

	return (
		<header className="bg-white w-full py-2 px-4 sticky top-0 z-50 border-b shadow-sm">
			<div className="max-w-7xl mx-auto">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<div className="flex items-center">
						<Link to="/" className="flex items-center">
							<img
								src={LOGO || '/placeholder.svg'}
								alt="Brand Logo"
								className="h-16 w-auto"
							/>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center justify-center space-x-4">
						{renderNavLinks(userNavLinks)}
						{Array.isArray(menuItems) && menuItems.length > 0
							? menuItems.map((item, index) => (
									<div
										key={index}
										className="center_2"
										onMouseEnter={() => setActiveDropdown(index)}
										onMouseLeave={() => setActiveDropdown(null)}
									>
										{/* Menu Item with Underline Animation */}
										<span className="relative  ">{item.name}</span>

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
															className="w-full h-36 rounded-lg"
														/>
													</div>
												</div>
											</div>
										)}
									</div>
							  ))
							: null}
						{renderNavLinks(userNavLinks2)}
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
								className="w-32 lg:w-48 h-9 rounded-full pr-8 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 text-sm"
								onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
							/>
							<button
								onClick={handleSearch}
								className="absolute right-2 text-gray-500 hover:text-gray-700 p-1"
							>
								<Search size={18} />
							</button>
						</div>

						{/* User Authentication */}
						<div className="relative font-sans">
							{currentUser !== null ? (
								<div className="flex items-center gap-3">
									<img
										src={user?.avatar || '/default-avatar.png'}
										alt="User Avatar"
										className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 transition-transform duration-300 hover:scale-105"
									/>
									<div className="relative group">
										<button className="text-base font-semibold text-gray-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
											{user?.name || 'Account'}
										</button>
										<div className="absolute right-0 z-20 hidden group-hover:block w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
											<ul className="py-2">
												<li>
													<button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200">
														Profile
													</button>
												</li>
												<li>
													<button
														onClick={handleLogout}
														className="w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors duration-200"
													>
														Log Out
													</button>
												</li>
											</ul>
										</div>
									</div>
								</div>
							) : (
								<>
									<button
										onClick={() => setIsModalOpen(true)}
										className="inline-flex items-center justify-center rounded-full text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 h-10 px-6 py-2 shadow-md transition-all duration-300 transform hover:scale-105"
									>
										Account
									</button>

									{isModalOpen && (
										<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-500">
											<div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md transform scale-95 animate-in">
												<h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
													{authMode === 'login'
														? 'Welcome Back'
														: 'Create Account'}
												</h2>

												<div className="flex justify-center mb-6">
													<div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
														<label className="relative cursor-pointer">
															<input
																type="radio"
																name="authMode"
																value="login"
																checked={authMode === 'login'}
																onChange={() => setAuthMode('login')}
																className="sr-only"
															/>
															<span
																className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
																	authMode === 'login'
																		? 'bg-blue-600 text-white shadow-md'
																		: 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
																}`}
															>
																Login
															</span>
														</label>
														<label className="relative cursor-pointer">
															<input
																type="radio"
																name="authMode"
																value="signup"
																checked={authMode === 'signup'}
																onChange={() => setAuthMode('signup')}
																className="sr-only"
															/>
															<span
																className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
																	authMode === 'signup'
																		? 'bg-blue-600 text-white shadow-md'
																		: 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
																}`}
															>
																Sign Up
															</span>
														</label>
													</div>
												</div>

												{authMode === 'login' ? (
													<form onSubmit={handleLogin} className="space-y-5">
														<div>
															<input
																type="email"
																name="email"
																placeholder="Email"
																value={formData.email}
																onChange={handleInputChange}
																required
																className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
															/>
														</div>
														<div>
															<input
																type="password"
																name="password"
																placeholder="Password"
																value={formData.password}
																onChange={handleInputChange}
																required
																className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
															/>
														</div>
														<button
															type="submit"
															className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-300 transform hover:scale-105"
														>
															Log In
														</button>
													</form>
												) : (
													<form onSubmit={handleSignUp} className="space-y-5">
														<div>
															<input
																type="text"
																name="name"
																placeholder="Full Name"
																value={formData.name}
																onChange={handleInputChange}
																required
																className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
															/>
														</div>
														<div>
															<input
																type="email"
																name="email"
																placeholder="Email"
																value={formData.email}
																onChange={handleInputChange}
																required
																className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
															/>
														</div>
														<div>
															<input
																type="password"
																name="password"
																placeholder="Password"
																value={formData.password}
																onChange={handleInputChange}
																required
																className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
															/>
														</div>
														<div>
															<input
																type="password"
																name="confirmPassword"
																placeholder="Confirm Password"
																value={formData.confirmPassword}
																onChange={handleInputChange}
																required
																className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
															/>
														</div>
														<button
															type="submit"
															className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all duration-300 transform hover:scale-105"
														>
															Sign Up
														</button>
													</form>
												)}
												<div className="mt-6 space-y-2">
													<p className="text-center text-sm text-gray-500 dark:text-gray-400">
														or continue with
													</p>
													<div className="flex justify-center">
														<button
															onClick={handleGoogleAuth}
															className="w-full flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
														>
															<FaGoogle />
															<span>
																{authMode === 'login'
																	? 'Sign in with Google'
																	: 'Sign up with Google'}
															</span>
														</button>
													</div>
												</div>

												<button
													onClick={() => setIsModalOpen(false)}
													className="mt-6 w-full text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
												>
													Cancel
												</button>
											</div>
										</div>
									)}
								</>
							)}
						</div>

						{/* Favorites */}
						<Link
							to="/favorites"
							className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
						>
							<Heart size={20} className="text-gray-700" />
							{favorites && favorites.length > 0 && (
								<span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
									{favorites.length}
								</span>
							)}
						</Link>

						{/* Cart */}
						<Link
							to="/cart"
							className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
						>
							<ShoppingCart size={20} className="text-gray-700" />
							{cartItems && cartItems.length > 0 && (
								<span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
									{cartItems.length}
								</span>
							)}
						</Link>

						{/* Country Selector */}
						<select
							value={country}
							onChange={handleCountryChange}
							className="hidden sm:block py-1 px-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
							className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
							aria-label="Toggle menu"
						>
							<Menu className="h-5 w-5 text-gray-700" />
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Sidebar */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-50 lg:hidden">
					{/* Backdrop */}
					<div
						className="fixed inset-0 bg-black/25 transition-opacity"
						onClick={handleMobileMenuToggle}
					/>

					{/* Sidebar */}
					<div className="fixed inset-y-0 left-0 w-[280px] sm:w-[350px] bg-white shadow-lg overflow-y-auto transform transition-transform duration-200">
						<div className="h-full flex flex-col">
							{/* Header */}
							<div className="border-b p-4 flex items-center justify-between">
								<Link to="/" className="flex items-center">
									<img
										src={LOGO || '/placeholder.svg'}
										alt="Brand Logo"
										className="h-10 w-auto"
									/>
								</Link>
								<button
									onClick={handleMobileMenuToggle}
									className="p-2 rounded-md hover:bg-gray-100 transition-colors"
									aria-label="Close menu"
								>
									<X className="h-5 w-5 text-gray-700" />
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
										className="w-full pr-8 py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
										onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
									/>
									<button
										onClick={handleSearch}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
									>
										<Search size={18} />
									</button>
								</div>
							</div>

							{/* User Authentication - Mobile */}
							<div className="p-4 border-b">
								<SignedIn>
									<div className="flex items-center space-x-3">
										<div className="rounded-full bg-gray-200 p-2">
											<UserButton size={20} />
										</div>
										<span className="text-sm font-medium">My Account</span>
									</div>
								</SignedIn>
								<SignedOut>
									<button className="inline-flex items-center justify-center rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-700 text-white hover:bg-gray-800 h-9 px-4 py-2 w-full">
										<SignInButton />
									</button>
								</SignedOut>
							</div>

							{/* Navigation Links */}
							<div className="flex-1 overflow-auto py-2">
								<nav className="flex flex-col space-y-1 px-2">
									{userNavLinks.map((link, index) => (
										<Link
											key={index}
											to={link.to}
											className="flex items-center w-full py-2 px-3 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
										>
											{link.label}
										</Link>
									))}

									{Array.isArray(menuItems) && menuItems.length > 0
										? menuItems.map((item, index) => (
												<div key={index} className="w-full">
													<button
														onClick={() =>
															setActiveDropdown(
																index === activeDropdown ? null : index
															)
														}
														className="flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
													>
														<span>{item.name}</span>
														<ChevronDown
															className={`h-4 w-4 transition-transform duration-200 ${
																activeDropdown === index ? 'rotate-180' : ''
															}`}
														/>
													</button>

													{activeDropdown === index && (
														<div className="w-full py-2">
															<div className="flex flex-col md:flex-row">
																<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
																	{item.submenu.map((category, catIndex) => (
																		<div key={catIndex} className="py-1">
																			<h3 className="font-medium text-sm text-gray-900 px-3 py-1">
																				{category.heading}
																			</h3>
																			<ul className="grid grid-cols-1 gap-1 mt-1">
																				{category.items.map(
																					(subitem, subIndex) => (
																						<li key={subIndex}>
																							<Link
																								to={subitem.link || '#'}
																								className="block py-1 px-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
																							>
																								{subitem.name || subitem}
																							</Link>
																						</li>
																					)
																				)}
																			</ul>
																		</div>
																	))}
																</div>
																<div className="px-3 py-2 sm:w-1/3">
																	<img
																		src={LOGO || '/placeholder.svg'}
																		alt="Category Preview"
																		className="w-full h-auto rounded-lg object-contain"
																	/>
																</div>
															</div>
														</div>
													)}
												</div>
										  ))
										: null}

									{userNavLinks2.map((link, index) => (
										<Link
											key={index}
											to={link.to}
											className="flex items-center w-full py-2 px-3 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900 transition-colors"
										>
											{link.label}
										</Link>
									))}
								</nav>
							</div>

							{/* Footer */}
							<div className="border-t p-4">
								<div className="flex items-center justify-between">
									<div className="flex space-x-4">
										<Link
											to="/favorites"
											className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
										>
											<Heart size={16} />
											<span>Favorites</span>
										</Link>
										<Link
											to="/cart"
											className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
										>
											<ShoppingCart size={16} />
											<span>Cart</span>
										</Link>
									</div>

									<select
										value={country}
										onChange={handleCountryChange}
										className="py-1 px-2 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
									>
										<option value="INR">INR</option>
										<option value="USD">USD</option>
										<option value="GBP">GBP</option>
										<option value="EUR">EUR</option>
										<option value="AUD">AUD</option>
										<option value="OMR">OMR</option>
										<option value="AED">AED</option>
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

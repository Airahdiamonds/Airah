import { useState, useEffect } from 'react'
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, User } from 'lucide-react'
import LOGO from '../assets/logo.webp'
import { useDispatch, useSelector } from 'react-redux'
import {
	clearGuest,
	clearUser,
	fetchCurrencyRates,
	setCountry,
	setGuest,
	setUser,
} from '../redux/localizationSlice'
import { Link, useNavigate } from 'react-router-dom'
import {
	fetchUserCartItems,
	fetchUserFavorites,
} from '../redux/favoritesCartSlice'
import { menuItems } from '../utils/helpers'
import { FaGoogle } from 'react-icons/fa'
import {
	fetchCurrentUser,
	mergeCartAPI,
	mergeFavoritesAPI,
	signInUser,
	signoutUser,
	signUpUser,
} from '../utils/api'
import { v4 as uuidv4 } from 'uuid'

const userNavLinks = [
	{ to: '/customize', label: 'Customize' },
]

const userNavLinks2 = [
	{ to: '/Edu', label: 'Education' },
]

export default function Header() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const [activeDropdown, setActiveDropdown] = useState(null)
	const [query, setQuery] = useState('')
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { country, currentUser, guestUser } = useSelector(
		(state) => state.localization
	)
	const { favorites, cartItems } = useSelector((state) => state.favoritesCart)

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [authMode, setAuthMode] = useState('login')
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	// Run once on mount: determine if the visitor is an authenticated user or guest.
	// Do NOT include currentUser in deps — this effect bootstraps auth state and should
	// not re-run when currentUser changes (that would cause an infinite loop on login).
	useEffect(() => {
		const bootstrap = async () => {
			const user = await fetchCurrentUser()
			if (user) {
				// If a guest_id is still in localStorage when we discover an
				// authenticated session (e.g. after Google OAuth redirect),
				// merge the guest cart + favorites before clearing it.
				const guestId = localStorage.getItem('guest_id')
				if (guestId) {
					await Promise.all([
						mergeCartAPI(guestId).catch(console.error),
						mergeFavoritesAPI(guestId).catch(console.error),
					])
					localStorage.removeItem('guest_id')
				}
				dispatch(setUser(user))
				dispatch(clearGuest())
			} else {
				let guestId = localStorage.getItem('guest_id')
				if (!guestId) {
					guestId = uuidv4()
					localStorage.setItem('guest_id', guestId)
				}
				dispatch(setGuest(guestId))
			}
		}
		bootstrap()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// React to unauthorized responses from the API — sign the user out.
	useEffect(() => {
		const handleUnauthorized = () => {
			dispatch(clearUser())
		}
		window.addEventListener('auth:unauthorized', handleUnauthorized)
		return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
	}, [dispatch])

	// Fetch user data and currency rates on component mount
	useEffect(() => {
		if (currentUser || guestUser) {
			dispatch(fetchUserFavorites({ userId: currentUser, guestId: guestUser }))
		}
		dispatch(fetchUserCartItems({ userId: currentUser, guestId: guestUser }))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser, guestUser])

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
	}

	const handleLogin = async (e) => {
		e.preventDefault()
		const { email, password } = formData

		if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
			console.log('Please enter a valid email address')
			return
		}
		try {
			await signInUser({ email, password })
		} catch (err) {
			return
		}
		setFormData({ email: '', password: '' })
		const user = await fetchCurrentUser()
		if (user) {
			// Merge any guest cart/favorites before switching identity
			const guestId = localStorage.getItem('guest_id')
			if (guestId) {
				await Promise.all([
					mergeCartAPI(guestId).catch(console.error),
					mergeFavoritesAPI(guestId).catch(console.error),
				])
				localStorage.removeItem('guest_id')
			}
			dispatch(setUser(user))
			dispatch(clearGuest())
		}
		setIsModalOpen(false)
	}
	const handleLogout = async () => {
		try {
			await signoutUser()
		} catch (err) {
			// signoutUser failures are non-fatal — clear local state regardless
		}
		dispatch(clearUser())
	}
	const handleSignUp = async (e) => {
		e.preventDefault()
		const { name, email, password, confirmPassword } = formData

		// Basic validation
		if (!name.trim()) {
			console.log('Full name is required')
			return
		}
		if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
			console.log('Please enter a valid email address')
			return
		}
		if (password.length < 8) {
			console.log('Password must be at least 8 characters long')
			return
		}
		if (password !== confirmPassword) {
			console.log('Passwords do not match')
			return
		}
		if (formData.password !== formData.confirmPassword) {
			alert('Passwords do not match')
			return
		}
		const result = await signUpUser({ name, email, password }).catch(() => null)
		if (result) {
			setFormData({ name: '', email: '', password: '', confirmPassword: '' })
			const user = await fetchCurrentUser()
			if (user) {
				// Merge any guest cart/favorites before switching identity
				const guestId = localStorage.getItem('guest_id')
				if (guestId) {
					await Promise.all([
						mergeCartAPI(guestId).catch(console.error),
						mergeFavoritesAPI(guestId).catch(console.error),
					])
					localStorage.removeItem('guest_id')
				}
				dispatch(setUser(user))
				dispatch(clearGuest())
			}
			setIsModalOpen(false)
		}
	}
	const handleGoogleAuth = () => {
		const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
		const redirectUri = `${import.meta.env.VITE_API_URL}/auth/google/callback`
		const scope = encodeURIComponent('profile email')
		const state = crypto.randomUUID() // Optional, useful for CSRF protection
		const responseType = 'code'

		const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${state}&access_type=offline&prompt=consent`

		window.location.href = googleAuthUrl
	}

	// Elegant inline nav link with gold underline reveal
	const renderNavLinks = (links) => {
		return links.map((link, index) => (
			<Link
				key={index}
				to={link.to}
				className="group relative px-3 py-1.5 text-xs font-sans font-medium uppercase tracking-[0.11em] text-onyx-soft transition-colors duration-300 hover:text-onyx"
			>
				{link.label}
				<span className="pointer-events-none absolute inset-x-3 -bottom-[1px] h-px origin-center scale-x-0 bg-champagne transition-transform duration-500 ease-out group-hover:scale-x-100" />
			</Link>
		))
	}

	return (
		<header className="sticky top-0 z-50 w-full bg-ivory/95 font-sans shadow-[0_10px_40px_-34px_rgba(28,25,23,0.65)]">
			{/* Tier 1 — utility strip */}
			<div className="hidden border-b border-onyx/90 bg-onyx text-ivory min-[960px]:block">
				<div className="mx-auto flex min-h-7 max-w-7xl items-center justify-between gap-5 px-6 py-1 text-[11px] uppercase leading-none tracking-[0.13em]">
					<p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-ivory/75">
						Complimentary Shipping Worldwide
						<span className="text-champagne-soft">·</span>
						Lifetime Warranty
						<span className="text-champagne-soft">·</span>
						Bespoke Consultations
					</p>
					<div className="flex shrink-0 items-center gap-5">
						<div className="relative">
							<select
								value={country}
								onChange={handleCountryChange}
								className="cursor-pointer appearance-none bg-transparent pr-4 text-[11px] uppercase tracking-[0.13em] text-ivory/85 outline-none transition-colors hover:text-ivory focus-visible:text-ivory"
								aria-label="Currency"
							>
								<option value="INR" className="text-onyx">INR ₹</option>
								<option value="USD" className="text-onyx">USD $</option>
								<option value="GBP" className="text-onyx">GBP £</option>
								<option value="EUR" className="text-onyx">EUR €</option>
								<option value="AUD" className="text-onyx">AUD $</option>
								<option value="OMR" className="text-onyx">OMR ﷼</option>
								<option value="AED" className="text-onyx">AED د.إ</option>
							</select>
							<ChevronDown
								className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-ivory/60"
								size={10}
							/>
						</div>
						{currentUser ? (
							<button
								onClick={handleLogout}
								className="text-ivory/70 transition-colors hover:text-champagne-soft"
							>
								Sign out
							</button>
						) : (
							<button
								onClick={() => {
									setAuthMode('login')
									setIsModalOpen(true)
								}}
								className="text-ivory/70 transition-colors hover:text-champagne-soft"
							>
								Sign in
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Tier 2 — main bar */}
			<div className="border-b border-hairline">
				<div className="relative mx-auto grid h-16 max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-4 sm:h-[72px] sm:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-6 min-[960px]:h-14">
					{/* Left cluster: mobile menu + search */}
					<div className="flex items-center gap-1 md:gap-3">
						<button
							onClick={handleMobileMenuToggle}
							className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-onyx transition-colors hover:bg-onyx/5 min-[960px]:hidden"
							aria-label="Open menu"
						>
							<Menu className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
						</button>
						<div className="hidden items-center gap-3 sm:flex">
							<div className="relative">
								<Search
									size={16}
									className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-onyx-mute"
								/>
								<input
									type="text"
									placeholder="Search"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
									className="w-32 border-b border-hairline bg-transparent py-2 pl-7 pr-2 text-[13px] font-sans tracking-[0.08em] text-onyx placeholder:uppercase placeholder:text-onyx-mute/70 outline-none transition-colors focus:border-champagne md:w-44 xl:w-56"
								/>
							</div>
						</div>
					</div>

					{/* Center: logotype */}
					<Link
						to="/"
						className="group absolute left-1/2 flex -translate-x-1/2 sm:static sm:translate-x-0 sm:justify-self-center"
						aria-label="Airah Diamonds — home"
					>
						<img
							src={LOGO || '/placeholder.svg'}
							alt="Airah Diamonds"
							className="h-10 w-auto transition-opacity duration-300 group-hover:opacity-80 sm:h-12 min-[960px]:h-11"
						/>
					</Link>

					{/* Right cluster: account, favorites, cart */}
					<div className="flex items-center justify-end gap-0 sm:gap-1.5 md:gap-2">
						{/* Account (signed in only — sign-in lives in utility strip) */}
						{currentUser !== null ? (
							<div className="group relative hidden md:block">
								<button className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium uppercase tracking-[0.12em] text-onyx-soft transition-colors hover:text-onyx">
									<img
										src={currentUser?.avatar || '/default-avatar.png'}
										alt=""
										className="h-7 w-7 rounded-full border border-hairline object-cover"
									/>
									<span className="max-w-[8rem] truncate">
										{currentUser?.name || 'Account'}
									</span>
								</button>
								<div className="absolute right-0 top-full z-20 hidden w-56 pt-2 group-hover:block">
									<div className="overflow-hidden rounded-sm border border-hairline bg-ivory shadow-[0_24px_60px_-20px_rgba(28,25,23,0.25)]">
										<div className="border-b border-hairline px-5 py-4">
											<p className="font-serif text-base text-onyx">
												{currentUser?.name || 'Account'}
											</p>
											<p className="mt-0.5 text-xs uppercase tracking-[0.12em] text-onyx-mute">
												Member
											</p>
										</div>
										<ul className="py-1.5">
											<li>
												<button className="w-full px-5 py-3 text-left text-[13px] uppercase tracking-[0.12em] text-onyx-soft transition-colors hover:bg-onyx/[0.04] hover:text-onyx">
													Profile
												</button>
											</li>
											<li>
												<button
													onClick={handleLogout}
													className="w-full px-5 py-3 text-left text-[13px] uppercase tracking-[0.12em] text-onyx-mute transition-colors hover:bg-onyx/[0.04] hover:text-champagne"
												>
													Sign out
												</button>
											</li>
										</ul>
									</div>
								</div>
							</div>
						) : (
							<button
								onClick={() => {
									setAuthMode('login')
									setIsModalOpen(true)
								}}
								className="hidden h-11 w-11 items-center justify-center rounded-full text-onyx transition-colors hover:bg-onyx/5 md:inline-flex"
								aria-label="Sign in"
							>
								<User size={18} strokeWidth={1.5} />
							</button>
						)}

						<Link
							to="/favorites"
							className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-onyx transition-colors hover:bg-onyx/5 sm:h-11 sm:w-11"
							aria-label={`Favorites${favorites?.length ? `, ${favorites.length} items` : ''}`}
						>
							<Heart size={17} strokeWidth={1.5} />
							{favorites && favorites.length > 0 && (
								<span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[10px] font-medium text-ivory">
									{favorites.length}
								</span>
							)}
						</Link>

						<Link
							to="/cart"
							className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-onyx transition-colors hover:bg-onyx/5 sm:h-11 sm:w-11"
							aria-label={`Cart${cartItems?.length ? `, ${cartItems.length} items` : ''}`}
						>
							<ShoppingBag size={17} strokeWidth={1.5} />
							{cartItems && cartItems.length > 0 && (
								<span className="absolute right-1 top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[10px] font-medium text-ivory">
									{cartItems.length}
								</span>
							)}
						</Link>
					</div>
				</div>

				<div className="border-t border-hairline px-4 py-3 sm:hidden">
					<div className="relative mx-auto max-w-7xl">
						<Search
							size={16}
							className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-onyx-mute"
						/>
						<input
							type="text"
							placeholder="Search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
							className="w-full border-b border-hairline bg-transparent py-2.5 pl-7 pr-2 text-sm tracking-[0.08em] text-onyx placeholder:uppercase placeholder:text-onyx-mute/70 outline-none transition-colors focus:border-champagne"
						/>
					</div>
				</div>

				{/* Tier 3 — centered nav (desktop) */}
				<nav className="hidden border-t border-hairline min-[960px]:block">
					<div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-5 py-0.5 xl:gap-5 xl:px-6 2xl:gap-8">
						{renderNavLinks(userNavLinks)}
						{Array.isArray(menuItems) && menuItems.length > 0
							? menuItems.map((item, index) => (
									<div
										key={index}
										className="group/menu relative"
										onMouseEnter={() => setActiveDropdown(index)}
										onMouseLeave={() => setActiveDropdown(null)}
									>
										<span className="relative inline-flex cursor-default items-center gap-1.5 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.11em] text-onyx-soft transition-colors duration-300 hover:text-onyx">
											{item.name}
											<ChevronDown
												size={10}
												strokeWidth={1.5}
												className="transition-transform duration-300 group-hover/menu:rotate-180"
											/>
											<span className="pointer-events-none absolute inset-x-3 -bottom-[1px] h-px origin-center scale-x-0 bg-champagne transition-transform duration-500 ease-out group-hover/menu:scale-x-100" />
										</span>

										{activeDropdown === index && item.submenu && (
											<div className="absolute left-1/2 top-full z-40 w-[min(74rem,calc(100vw-2rem))] -translate-x-1/2 pt-3">
												<div className="overflow-hidden rounded-sm border border-hairline bg-ivory shadow-[0_30px_80px_-30px_rgba(28,25,23,0.35)]">
													<div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-x-8 gap-y-8 p-8 2xl:p-10">
														{item.submenu.map((category, catIndex) => (
															<div key={catIndex}>
																<h3 className="mb-4 border-b border-hairline pb-2 font-serif text-[15px] leading-snug text-onyx">
																	{category.heading}
																</h3>
																<ul className="space-y-3">
																	{category.items.map((subitem, subIndex) => (
																		<li key={subIndex}>
																			<Link
																				to={subitem.link}
																				className="group/sub relative inline-block text-sm leading-snug text-onyx-soft transition-colors duration-200 hover:text-champagne"
																			>
																				{subitem.name}
																			</Link>
																		</li>
																	))}
																</ul>
															</div>
														))}
														<div className="relative hidden min-h-56 overflow-hidden rounded-sm bg-onyx/[0.03] 2xl:flex">
															<img
																src={LOGO}
																alt=""
																className="m-auto h-24 w-auto opacity-60"
															/>
															<div className="absolute inset-x-0 bottom-0 p-5 text-center">
																<p className="font-serif text-[15px] italic text-onyx">
																	Bespoke creations
																</p>
																<p className="mt-1 text-xs uppercase tracking-[0.12em] text-onyx-mute">
																	Crafted to your story
																</p>
															</div>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
							  ))
							: null}
						{renderNavLinks(userNavLinks2)}
					</div>
				</nav>
			</div>

			{/* Auth modal */}
			{isModalOpen && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center bg-onyx/60 backdrop-blur-sm">
					<div
						className="absolute inset-0"
						onClick={() => setIsModalOpen(false)}
						aria-hidden="true"
					/>
					<div className="relative w-full max-w-md overflow-hidden border border-hairline bg-ivory p-10 shadow-[0_40px_100px_-30px_rgba(28,25,23,0.5)]">
						<button
							onClick={() => setIsModalOpen(false)}
							className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-onyx-mute transition-colors hover:bg-onyx/5 hover:text-onyx"
							aria-label="Close"
						>
							<X size={16} />
						</button>

						<p className="text-center text-xs uppercase tracking-[0.16em] text-champagne sm:text-[13px]">
							Airah Diamonds
						</p>
						<h2 className="mt-3 text-center font-serif text-3xl font-normal text-onyx">
							{authMode === 'login' ? 'Welcome back' : 'Create your account'}
						</h2>
						<div className="mx-auto mt-4 h-px w-10 bg-champagne" />

						<div className="mt-6 flex justify-center gap-6 text-xs uppercase tracking-[0.12em] sm:text-[13px]">
							<button
								type="button"
								onClick={() => setAuthMode('login')}
								className={`relative pb-2 transition-colors ${
									authMode === 'login' ? 'text-onyx' : 'text-onyx-mute hover:text-onyx'
								}`}
							>
								Sign in
								{authMode === 'login' && (
									<span className="absolute inset-x-0 -bottom-px h-px bg-champagne" />
								)}
							</button>
							<button
								type="button"
								onClick={() => setAuthMode('signup')}
								className={`relative pb-2 transition-colors ${
									authMode === 'signup' ? 'text-onyx' : 'text-onyx-mute hover:text-onyx'
								}`}
							>
								Register
								{authMode === 'signup' && (
									<span className="absolute inset-x-0 -bottom-px h-px bg-champagne" />
								)}
							</button>
						</div>

						{authMode === 'login' ? (
							<form onSubmit={handleLogin} className="mt-8 space-y-5">
								<LuxInput
									type="email"
									name="email"
									label="Email"
									value={formData.email}
									onChange={handleInputChange}
									required
								/>
								<LuxInput
									type="password"
									name="password"
									label="Password"
									value={formData.password}
									onChange={handleInputChange}
									required
								/>
								<LuxSubmit>Sign in</LuxSubmit>
							</form>
						) : (
							<form onSubmit={handleSignUp} className="mt-8 space-y-5">
								<LuxInput
									type="text"
									name="name"
									label="Full name"
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
								<LuxInput
									type="email"
									name="email"
									label="Email"
									value={formData.email}
									onChange={handleInputChange}
									required
								/>
								<LuxInput
									type="password"
									name="password"
									label="Password"
									value={formData.password}
									onChange={handleInputChange}
									required
								/>
								<LuxInput
									type="password"
									name="confirmPassword"
									label="Confirm password"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									required
								/>
								<LuxSubmit>Create account</LuxSubmit>
							</form>
						)}

						<div className="my-6 flex items-center gap-4">
							<span className="h-px flex-1 bg-hairline" />
							<span className="text-xs uppercase tracking-[0.12em] text-onyx-mute">
								or continue with
							</span>
							<span className="h-px flex-1 bg-hairline" />
						</div>

						<button
							onClick={handleGoogleAuth}
							className="flex w-full items-center justify-center gap-3 border border-onyx/15 px-4 py-3.5 text-xs uppercase tracking-[0.12em] text-onyx transition-colors hover:border-onyx hover:bg-onyx hover:text-ivory sm:text-[13px]"
						>
							<FaGoogle />
							<span>Google</span>
						</button>
					</div>
				</div>
			)}

			{/* Mobile drawer */}
			{mobileMenuOpen && (
				<div className="fixed inset-0 z-[55] min-[960px]:hidden">
					<div
						className="fixed inset-0 bg-onyx/40 backdrop-blur-sm transition-opacity"
						onClick={handleMobileMenuToggle}
						aria-hidden="true"
					/>
					<div className="fixed inset-y-0 left-0 flex w-[92%] max-w-[430px] flex-col bg-ivory shadow-2xl">
						<div className="flex items-center justify-between border-b border-hairline px-6 py-5">
							<Link to="/" onClick={handleMobileMenuToggle} aria-label="Airah Diamonds — home">
								<img src={LOGO || '/placeholder.svg'} alt="Airah Diamonds" className="h-10 w-auto" />
							</Link>
							<button
								onClick={handleMobileMenuToggle}
								className="inline-flex h-10 w-10 items-center justify-center rounded-full text-onyx-soft transition-colors hover:bg-onyx/5 hover:text-onyx"
								aria-label="Close menu"
							>
								<X size={18} />
							</button>
						</div>

						<div className="border-b border-hairline px-6 py-5">
							<div className="relative">
								<Search
									size={16}
									className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-onyx-mute"
								/>
								<input
									type="text"
									placeholder="Search"
									value={query}
									onChange={(e) => setQuery(e.target.value)}
									onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
									className="w-full border-b border-hairline bg-transparent py-2.5 pl-7 text-sm tracking-[0.08em] text-onyx placeholder:uppercase placeholder:text-onyx-mute/70 outline-none focus:border-champagne"
								/>
							</div>
						</div>

						<nav className="flex-1 overflow-y-auto px-4 py-4">
							<div className="flex flex-col">
								{userNavLinks.map((link, index) => (
									<Link
										key={index}
										to={link.to}
										onClick={handleMobileMenuToggle}
										className="flex items-center justify-between px-3 py-4 text-sm uppercase tracking-[0.11em] text-onyx transition-colors hover:bg-onyx/[0.04]"
									>
										{link.label}
									</Link>
								))}

								{Array.isArray(menuItems) && menuItems.length > 0
									? menuItems.map((item, index) => (
											<div key={index} className="border-t border-hairline first:border-t-0">
												<button
													onClick={() =>
														setActiveDropdown(index === activeDropdown ? null : index)
													}
													className="flex w-full items-center justify-between px-3 py-4 text-sm uppercase tracking-[0.11em] text-onyx transition-colors hover:bg-onyx/[0.04]"
												>
													<span>{item.name}</span>
													<ChevronDown
														className={`h-3.5 w-3.5 text-onyx-mute transition-transform duration-300 ${
															activeDropdown === index ? 'rotate-180' : ''
														}`}
													/>
												</button>

												{activeDropdown === index && (
													<div className="bg-onyx/[0.02] px-3 pb-5 pt-3">
														<div className="space-y-4">
															{item.submenu.map((category, catIndex) => (
																<div key={catIndex}>
																	<h3 className="px-2 pb-2 font-serif text-base leading-snug text-onyx">
																		{category.heading}
																	</h3>
																	<ul>
																		{category.items.map((subitem, subIndex) => (
																			<li key={subIndex}>
																				<Link
																					to={subitem.link || '#'}
																					onClick={handleMobileMenuToggle}
																					className="block px-2 py-2 text-sm leading-snug text-onyx-soft transition-colors hover:text-champagne"
																				>
																					{subitem.name || subitem}
																				</Link>
																			</li>
																		))}
																	</ul>
																</div>
															))}
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
										onClick={handleMobileMenuToggle}
										className="flex items-center justify-between border-t border-hairline px-3 py-4 text-sm uppercase tracking-[0.11em] text-onyx transition-colors hover:bg-onyx/[0.04]"
									>
										{link.label}
									</Link>
								))}
							</div>
						</nav>

						<div className="border-t border-hairline px-6 py-5">
							<div className="flex items-center justify-between">
								<div className="flex gap-5 text-xs uppercase tracking-[0.12em] text-onyx-soft">
									<Link
										to="/favorites"
										onClick={handleMobileMenuToggle}
										className="inline-flex items-center gap-2 hover:text-champagne"
									>
										<Heart size={14} strokeWidth={1.5} />
										<span>{favorites?.length || 0}</span>
									</Link>
									<Link
										to="/cart"
										onClick={handleMobileMenuToggle}
										className="inline-flex items-center gap-2 hover:text-champagne"
									>
										<ShoppingBag size={14} strokeWidth={1.5} />
										<span>{cartItems?.length || 0}</span>
									</Link>
								</div>

								<select
									value={country}
									onChange={handleCountryChange}
									className="appearance-none border-b border-hairline bg-transparent py-1.5 pl-1 pr-6 text-xs uppercase tracking-[0.12em] text-onyx outline-none"
									aria-label="Currency"
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

							{!currentUser && (
								<button
									onClick={() => {
										handleMobileMenuToggle()
										setAuthMode('login')
										setIsModalOpen(true)
									}}
									className="mt-5 w-full border border-onyx bg-onyx py-3.5 text-xs uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-transparent hover:text-onyx"
								>
									Sign in
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	)
}

function LuxInput({ label, name, type, value, onChange, required }) {
	return (
		<label className="block">
			<span className="block text-xs uppercase tracking-[0.12em] text-onyx-mute">
				{label}
			</span>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				className="mt-1.5 w-full border-b border-hairline bg-transparent py-2 text-[14px] text-onyx outline-none transition-colors focus:border-champagne"
			/>
		</label>
	)
}

function LuxSubmit({ children }) {
	return (
		<button
			type="submit"
			className="mt-2 w-full border border-onyx bg-onyx py-3.5 text-xs uppercase tracking-[0.12em] text-ivory transition-colors duration-300 hover:bg-transparent hover:text-onyx sm:text-[13px]"
		>
			{children}
		</button>
	)
}

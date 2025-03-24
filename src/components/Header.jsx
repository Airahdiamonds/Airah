import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import LOGO from "../assets/logo.webp";

// Mock data for menu items
const menuItems = [
  {
    name: "Engagement",
    submenu: [
      {
        heading: "Ring Settings",
        items: ["Solitaire", "Halo", "Three Stone", "Vintage"],
      },
      {
        heading: "Diamonds",
        items: ["Round", "Princess", "Cushion", "Oval"],
      },
      {
        heading: "Collections",
        items: ["Classic", "Modern", "Luxury", "Minimalist"],
      },
    ],
  },
  {
    name: "Wedding",
    submenu: [
      {
        heading: "Women's Bands",
        items: ["Plain", "Diamond", "Eternity", "Curved"],
      },
      {
        heading: "Men's Bands",
        items: ["Classic", "Modern", "Diamond", "Alternative"],
      },
      {
        heading: "Sets",
        items: ["Matching Sets", "Bridal Sets", "Trio Sets"],
      },
    ],
  },
  {
    name: "Jewelry",
    submenu: [
      {
        heading: "Necklaces",
        items: ["Pendants", "Chains", "Chokers", "Lockets"],
      },
      {
        heading: "Earrings",
        items: ["Studs", "Hoops", "Drops", "Climbers"],
      },
      {
        heading: "Bracelets",
        items: ["Tennis", "Bangles", "Cuffs", "Chains"],
      },
    ],
  },
];

// Define navigation links for admin and user roles
const adminNavLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/master", label: "Master" },
  { to: "/userList", label: "User List" },
  { to: "/productsList", label: "Product List" },
  { to: "/diamondsList", label: "Diamond List" },
  { to: "/stylesList", label: "Style List" },
  { to: "/addProducts", label: "Add Products" },
  { to: "/addDiamonds", label: "Add Diamonds" },
  { to: "/addStyles", label: "Add Styles" },
  { to: "/addCoupon", label: "Coupons" },
];

const userNavLinks = [
  { to: "/customize", label: "Customize" },
  { to: "/product", label: "Products" },
  { to: "/Edu", label: "Education" },
];

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [country, setCountry] = useState("USD");
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(null);

  // Mock function to simulate navigation
  const handleSearch = () => {
    console.log("Searching for:", query);
    // In a real app, you would use navigate from react-router
  };

  // Mock function to handle country change
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  // Helper function to render navigation links
  const renderNavLinks = (links) => {
    return links.map((link, index) => (
      <Link
        key={index}
        to={link.to}
        className="relative text-gray-700 hover:text-gray-900 font-medium after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-black after:w-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
      >
        {link.label}
      </Link>
    ));
  };

  // Helper function to render dropdown menu items
  const renderDropdownMenu = (submenu, index) => (
    <div className="fixed z-10 left-0 top-[115px] bg-white w-full shadow-lg py-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        {/* Submenu Items */}
        {submenu.map((category, catIndex) => (
          <div key={catIndex} className="space-y-2">
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
  );

  // Toggle mobile submenu
  const toggleMobileSubmenu = (index) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === index ? null : index);
  };

  return (
    <header className="bg-white w-full py-2 px-4 sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
             src={LOGO}
			 alt="Brand Logo"
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center justify-center space-x-6 flex-1">
            {userRole === "admin" && isUserSignedIn ? (
              renderNavLinks(adminNavLinks)
            ) : (
              <>
                {renderNavLinks(userNavLinks)}
                {menuItems.map((item, index) => (
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
                    {dropdownOpen === index &&
                      item.submenu &&
                      renderDropdownMenu(item.submenu, index)}
                  </div>
                ))}
              </>
            )}
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
            <div className="hidden sm:block">
              {isUserSignedIn ? (
                <button className="rounded-full bg-gray-200 p-2">
                  <img
                    src="https://placehold.co/32x32"
                    alt="User"
                    className="h-6 w-6 rounded-full"
                  />
                </button>
              ) : (
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Sign In
                </button>
              )}
            </div>

            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <Heart size={20} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
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
            </select>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
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
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed inset-y-0 left-0 w-[280px] sm:w-[350px] bg-white shadow-lg overflow-y-auto">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="border-b p-4 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                  <img
             src={LOGO}
			 alt="Brand Logo"
                    className="h-10 w-auto"
                  />
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
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
                {isUserSignedIn ? (
                  <div className="flex items-center space-x-3">
                    <button className="rounded-full bg-gray-200 p-2">
                      <img
                        src="https://placehold.co/32x32"
                        alt="User"
                        className="h-6 w-6 rounded-full"
                      />
                    </button>
                    <span className="text-sm font-medium">My Account</span>
                  </div>
                ) : (
                  <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 w-full">
                    Sign In
                  </button>
                )}
              </div>

              {/* Navigation Links */}
              <div className="flex-1 overflow-auto py-2">
                <nav className="flex flex-col space-y-1 px-2">
                  {userRole === "admin" && isUserSignedIn ? (
                    // Admin Links
                    adminNavLinks.map((link, index) => (
                      <Link
                        key={index}
                        to={link.to}
                        className="py-2 px-3 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                      >
                        {link.label}
                      </Link>
                    ))
                  ) : (
                    // User Links
                    <>
                      {userNavLinks.map((link, index) => (
                        <Link
                          key={index}
                          to={link.to}
                          className="py-2 px-3 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                        >
                          {link.label}
                        </Link>
                      ))}

                      {/* Menu Items with Collapsible Dropdowns */}
                      {menuItems.map((item, index) => (
                        <div key={index} className="w-full">
                          <button
                            onClick={() => toggleMobileSubmenu(index)}
                            className="flex items-center justify-between w-full py-2 px-3 rounded-md hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                mobileSubmenuOpen === index ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          {mobileSubmenuOpen === index && (
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
                      ))}
                    </>
                  )}
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
  );
}

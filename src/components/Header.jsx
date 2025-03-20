import { useState } from "react";
import LOGO from '../assets/logo.webp';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaHeart, FaShoppingCart, FaGlobe, FaInstagram, FaFacebook, FaTwitter, FaEnvelope } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [openDropdown, setOpenDropdown] = useState(null);

	const toggleDropdown = (index) => {
		setOpenDropdown(openDropdown === index ? null : index);
	};

	return (
		<nav className="bg-white text-black shadow-md p-4">
			<div className="container mx-auto flex items-center justify-between">
				{/* Logo */}
				<div className="text-xl font-bold">  <Link to="/">
					<img
						src={LOGO}
						alt="Brand Logo"
						className="h-20 w-auto cursor-pointer"
					/>
				</Link></div>

				{/* Desktop Menu */}
				<ul className="hidden md:flex space-x-6 font-medium">
          {["Fine Jewellery", "Rings", "Education", "About Us", "Contact Us"].map((item, index) => (
            <li key={index} className="relative group">
              <button
                onClick={() => toggleDropdown(index)}
                className="hover:text-gray-400 relative inline-block"
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
              </button>

              {/* Full-width Dropdown */}
              {openDropdown === index && (
               <div className="absolute z-10 left-0 mt-2 bg-white w-full grid grid-cols-3">
                  {/* Left side - Menu options */}
                  <ul className="w-1/3 p-4">
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-200">Option 1</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-200">Option 2</a></li>
                    <li><a href="#" className="block px-4 py-2 hover:bg-gray-200">Option 3</a></li>
                  </ul>

                  {/* Right side - Full-width Image */}
                  <div className="w-2/3">
                    <img 
                      src="https://via.placeholder.com/800x300" 
                      alt="Dropdown Banner" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>


				{/* Search, Icons & Buttons */}
				<div className="flex items-center space-x-4">
					{/* Search Input */}
					<div className="relative hidden md:block">
						<input type="text" placeholder="Search" className="border rounded-full px-3 py-1 pl-10 w-48 text-black" />
						<FaSearch className="absolute left-3 top-2.5 text-gray-400" />
					</div>

					{/* Icons */}
					<FaHeart className="text-red-500 cursor-pointer" size={20} />
					<FaShoppingCart className="text-gray-500 cursor-pointer" size={20} />
					<FaGlobe className="text-gray-500 cursor-pointer" size={20} />


					{/* Sign In Button */}
					<button className=" text-black px-8 py-2 rounded-full border-2 border-gray  transition-colors duration-300 hover:bg-white hover:text-black hover:border hover:border-black">
						Sign In
					</button>

					{/* Social Media Icons (Colorful) */}
					<a href="#" className="text-pink-600 hover:opacity-80 transition"><FaInstagram size={20} /></a>
					<a href="#" className="text-blue-600 hover:opacity-80 transition"><FaFacebook size={20} /></a>

					{/* Contact Info (Inline) */}

					{/* Mobile Menu Toggle */}
					<button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
						{mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
					</button>
				</div>
			</div>


			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<ul className="md:hidden flex flex-col items-center space-y-4 mt-4">
					{["Fine Jewellery", "Rings", "Education", "About Us", "Contact Us"].map((item, index) => (
						<li key={index} className="relative w-full text-center">
							<button
								onClick={() => toggleDropdown(index)}
								className="hover:text-gray-400 relative w-full py-2"
							>
								{item}
								<span className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-0 h-0.5 bg-black transition-all duration-300 hover:w-full"></span>
							</button>

							{/* Mobile Dropdown */}
							{openDropdown === index && (
								<ul className="bg-white shadow-md border rounded-md py-2 w-40 mx-auto">
									<li><a href="#" className="block px-4 py-2 hover:bg-gray-200">Option 1</a></li>
									<li><a href="#" className="block px-4 py-2 hover:bg-gray-200">Option 2</a></li>
									<li><a href="#" className="block px-4 py-2 hover:bg-gray-200">Option 3</a></li>
								</ul>
							)}
						</li>
					))}
					<div className="relative w-full flex justify-center">
						<input type="text" placeholder="Search" className="border rounded-full px-3 py-1 pl-10 w-3/4 text-black" />
						<FaSearch className="absolute left-6 top-2.5 text-gray-400" />
					</div>
				</ul>
			)}
		</nav>
	);
}
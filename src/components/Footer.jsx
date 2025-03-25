"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  ShieldCheck,
} from "lucide-react"

const Footer = () => {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Diamond showcase images from Unsplash
  const diamondImages = [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1587&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1587&auto=format&fit=crop",
  ]

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === diamondImages.length - 1 ? 0 : prev + 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [diamondImages.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === diamondImages.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? diamondImages.length - 1 : prev - 1))
  }

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* Top section with carousel */}
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
          <div>
            <h2 className="text-3xl font-serif font-light mb-6">
              Discover Our <span className="font-bold italic">Exquisite</span> Collection
            </h2>
            <p className="text-gray-300 mb-6">
              Each diamond in our collection is carefully selected for its exceptional quality, brilliance, and beauty.
              Our expert craftsmen transform these precious gems into stunning pieces of jewelry that will be treasured
              for generations.
            </p>
            <button className="bg-transparent hover:bg-white hover:text-gray-900 text-white font-semibold py-2 px-6 border border-white hover:border-transparent transition duration-300 ease-in-out">
              Explore Collection
            </button>
          </div>

          {/* Diamond Carousel */}
          <div className="relative overflow-hidden rounded-lg h-80 shadow-2xl">
            {diamondImages.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={img || "/placeholder.svg"}
                  alt={`Diamond showcase ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
            >
              <ChevronRight size={20} />
            </button>

            {/* Carousel Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {diamondImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          </div>
        </div>

        <hr className="border-gray-700 mb-12" />

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-900 font-serif text-xl font-bold">A</span>
              </div>
              <h3 className="text-xl font-serif">Airah Diamonds</h3>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              Since 1990, Airah Diamonds has been crafting the finest diamond jewelry, combining traditional
              craftsmanship with contemporary design to create timeless pieces.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-serif">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Our Collections
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Diamond Education
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Custom Designs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Our Story
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Blog & News
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-serif">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="text-gray-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">456 Diamond Way, New York, NY 10019, United States</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                <a href="tel:+12125556789" className="text-gray-300 hover:text-white transition-colors">
                  +1 (212) 555-6789
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                <a href="mailto:info@airahdiamonds.com" className="text-gray-300 hover:text-white transition-colors">
                  info@airahdiamonds.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Opening Hours</h4>
              <p className="text-gray-300 text-sm">
                Monday - Friday: 10:00 AM - 7:00 PM
                <br />
                Saturday: 10:00 AM - 5:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-serif">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for exclusive offers, new collections, and diamond insights.
            </p>
            <form className="mb-6">
              <div className="flex flex-col space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-gray-800 border border-gray-700 px-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-white text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-gray-900 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <div>
              <h4 className="text-sm font-semibold mb-3">Secure Payments</h4>
              <div className="flex space-x-3">
                <CreditCard size={24} className="text-gray-400" />
                <ShieldCheck size={24} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Airah Diamonds. All rights reserved.</p>
          <div className="flex space-x-6 mt-3 md:mt-0">
            <a href="" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="" className="hover:text-white transition-colors">
              Shipping & Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
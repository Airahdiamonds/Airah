import { ShieldCheck, CreditCard } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">About Us</h3>
          <p className="text-gray-600 text-sm">
            We provide top-notch products and services to cater to your needs.
            Experience quality and excellence with us.
          </p>
        </div>

        {/* Links Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2">
            <li>
              <a href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                Home
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                Shop
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/" className="text-gray-600 hover:text-gray-900 text-sm">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Media Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Follow Us
          </h3>
          <div className="flex space-x-4">
            <a href="/" className="text-gray-600 hover:text-blue-500">
              <ShieldCheck size={24} />
            </a>
            <a href="/" className="text-gray-600 hover:text-sky-500">
              <ShieldCheck size={24} />
            </a>
            <a href="/" className="text-gray-600 hover:text-pink-500">
              <ShieldCheck size={24} />
            </a>
            <a href="/" className="text-gray-600 hover:text-blue-700">
              <ShieldCheck size={24} />
            </a>
          </div>
        </div>

        {/* Payment & Security Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Secure Payments
          </h3>
          <div className="flex space-x-4 items-center">
            <CreditCard size={24} className="text-gray-600" />
            <ShieldCheck size={24} className="text-gray-600" />
          </div>
          <p className="text-gray-600 text-sm mt-2">
            We support multiple payment options and ensure secure transactions.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

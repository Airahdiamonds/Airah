import React, { useState, useEffect } from "react";
import "../styles/global.css";
import { motion } from "framer-motion";
import EngagementRing from "../assets/banner.webp";
import WeddingRing from "../assets/banner2.webp";
import ring1 from "../assets/Prong2.png"; // Adjust the path as needed
import ring2 from "../assets/demo2.png";
import ring3 from "../assets/demoringcarousel.png";
import ring4 from "../assets/pave-engagement-ring.png";
import ring5 from "../assets/pave-engagement-ring (1).png";
import bannerring from "../assets/Prong2.png";
import model from "../assets/Wedding-rings.jpg";

import bgImage2 from "../assets/mesh-236.png"; // Path to your background image
import bgImage from "../assets/twy_BG.png"; // Path to your background image
import leftImage from "../assets/twy.png";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Heart } from "lucide-react"; // Importing Heart Icon
import Slider from "react-slick";

const diamonds = [
  { id: 1, image: ring5, title: "Brilliant Cut" },
  { id: 2, image: ring1, title: "Princess Cut" },
  { id: 3, image: ring2, title: "Emerald Cut" },
  { id: 4, image: ring3, title: "Oval Cut" },
  { id: 5, image: ring4, title: "Pear Cut" },
  { id: 6, image: ring5, title: "Cushion Cut" },
  { id: 7, image: ring1, title: "Radiant Cut" },
  { id: 8, image: ring2, title: "Asscher Cut" },
  { id: 9, image: ring3, title: "Marquise Cut" },
  { id: 10, image: ring4, title: "Heart Cut" },
];
function Home() {
  const brands = [
    "Nike",
    "Adidas",
    "Gucci",
    "Prada",
    "Rolex",
    "Versace",
    "Chanel",
    "Puma",
    "Reebok",
    "Fendi",
    "Louis Vuitton",
    "Zara",
    "Hermès",
    "Burberry",
    "Cartier",
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const rings = [
    {
      image: ring1,
      title: "Engagement Rings",
      description:
        "Elegant engagement rings to celebrate your love. Crafted with precision, these rings feature ethically sourced diamonds set in 18K gold for a timeless and radiant look.",
      features: "Perfect for proposals, anniversaries, and special moments.",
      material: "Material: 18K Gold, Ethically Sourced Diamond",
    },
    {
      image: ring2,
      title: "Wedding Rings",
      description:
        "Timeless wedding bands designed for a lifetime of love. Handcrafted with premium metals, these bands offer comfort, durability, and a symbol of everlasting commitment.",
      features:
        "Classic and modern designs available in gold, platinum, and titanium.",
      material: "Material: 14K Gold, Platinum, Titanium",
    },
    {
      image: ring3,
      title: "Diamond Rings",
      description:
        "Brilliant diamond rings that radiate elegance and sophistication. Featuring exceptional craftsmanship and ethically sourced diamonds with stunning clarity for every occasion.",
      features: "Certified diamonds with exquisite cuts and brilliance.",
      material: "Material: 18K White Gold, Premium Diamond",
    },
    {
      image: ring4,
      title: "Gold Rings",
      description:
        "Classic gold rings that blend tradition with modern elegance. Designed to suit every style, these rings are available in a variety of finishes and gold tones.",
      features: "Available in yellow, white, and rose gold variations.",
      material: "Material: 22K Pure Gold with a refined finish",
    },
    {
      image: ring5,
      title: "Platinum Rings",
      description:
        "Premium platinum rings crafted for a luxurious touch. Durable, elegant, and timeless, these rings offer unmatched brilliance and sophistication, perfect for any occasion.",
      features:
        "Scratch-resistant, hypoallergenic, and designed for long-lasting shine.",
      material:
        "Material: 950 Platinum with a high-polish finish for an exquisite look.",
    },
  ];
  const [activeTab, setActiveTab] = useState("features");

  const tabContent = {
    features:
      "Our diamonds are ethically sourced and crafted to perfection, offering unmatched brilliance and clarity. Choose from various cuts and settings to create your dream jewelry piece.",
    care: "Handle your diamonds with care by keeping them in a soft pouch. Clean with mild soap and a soft brush to maintain their shine. Avoid exposure to harsh chemicals.",
    shipping:
      "We offer insured worldwide shipping with secure packaging. Returns are accepted within 30 days with proof of purchase.",
  };
  // Define the slides with imported images
  const slides = [
    {
      image: EngagementRing,
      heading: "New Modern Collection",
      subheading:
        "Elegance isn't solely defined by what you wear. It's how you carry yourself, how you speak, what you read.",
    },
    {
      image: WeddingRing,
      heading: "Meet the lines of the millennium",
      subheading:
        "Fashion is to please your eye. Shapes and proportions are for your intellect. I have an obsession with details and pattern.",
    },
  ];

  // Function to go to the next slide
  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  // Function to go to the previous slide
  const goToPrevSlide = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
    );
  };
  const settings = {
    dots: true, // Enable dots
    infinite: true, // Infinite loop
    speed: 1000, // 1-second transition
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Stops for 1 sec before moving
    cssEase: "ease-in-out", // Smooth movement
    arrows: false, // Hide arrows for a clean look
    dotsClass: "slick-dots custom-dots", // Custom dots styling
  };

  const images = [model, model, model, model]; // All slides will show the model image

  // Set up auto-slide interval when the component mounts
  useEffect(() => {
    const intervalId = setInterval(goToNextSlide, 5000); // Change slide every 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Hero Section with Carousel */}
      <section className="relative w-full h-[100vh]">
        {/* Carousel */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-all duration-500 ease-in-out ${
                currentSlide === index ? "opacity-100" : "opacity-0"
              }`}
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }}
            >
              <div className="absolute inset-0 w-full h-full bg-black opacity-40"></div>
              <div className="absolute inset-0 flex items-center justify-left px-4 md:px-8">
                <div className="text-white text-left p-10">
                  <h1 className="text-4xl md:text-6xl font-bold">
                    {slide.heading}
                  </h1>
                  <p className="text-lg md:text-xl mt-4">{slide.subheading}</p>
                  {/* Shop Jewelry Button */}
                  <button className="mt-6 mr-4 px-8 py-3 bg-black text-white rounded-md text-lg font-semibold hover:bg-gray-800 border-1 border-white transition duration-300">
                    Shop Diamonds
                  </button>

                  {/* Buy Diamonds Button */}
                  <button className="mt-6 px-8 py-3 bg-white text-black text-lg rounded-md font-semibold border-1 border-black hover:bg-gray-200 transition duration-300">
                    Buy Diamonds
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 w-14 text-black bg-white m-2 hover:bg-opacity-75 rounded-full"
        >
          &#10094;
        </button>
        <button
          onClick={goToNextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 w-14 text-black bg-white m-2 hover:bg-opacity-75 rounded-full"
        >
          &#10095;
        </button>
      </section>

      <section className="px-4 sm:px-8 py-6">
        {/* Heading */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Explore Our Exclusive Ring Collection
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 mt-2 max-w-4xl mx-auto">
            Discover a wide range of elegant rings crafted to perfection. Choose
            from our exquisite collection and find the perfect piece that
            complements your style.
          </p>
        </div>

        {/* Category List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 px-2 sm:px-4">
          {rings.map((ring, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg overflow-hidden bg-white transition-transform duration-300 hover:scale-105 h-full flex flex-col"
            >
              {/* Image */}
              <img
                src={ring.image}
                alt={ring.title}
                className="w-full h-56 sm:h-64 object-cover"
              />

              {/* Content */}
              <div className="p-4 sm:p-6 text-left bg-gray-100 flex flex-col flex-grow">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                  {ring.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 flex-grow">
                  {ring.description}
                </p>
                <button className="mt-3 py-3 px-6 bg-gray-800 text-white text-sm sm:text-base font-semibold rounded-md transition-opacity duration-300 hover:bg-gray-900">
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Product Details */}
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-sm uppercase tracking-widest text-gray-400">
                Diamond Customization
              </h3>
              <button className="text-white hover:text-red-500 transition">
                <Heart size={24} />
              </button>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mt-2">
              Brilliant Diamonds
            </h2>
            <p className="mt-4 text-gray-300 text-lg">
              Create your perfect diamond jewelry. Choose your diamond,
              customize the setting, and make it truly yours.
            </p>

            <h3 className="text-2xl md:text-3xl font-semibold mt-6">
              Round Cut Diamond
            </h3>
            <p className="text-3xl md:text-4xl font-bold mt-1">$2,999.00</p>
            <p className="mt-2 text-gray-400 text-lg">
              Exquisite craftsmanship meets exceptional brilliance in this
              round-cut diamond.
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-black px-6 py-3 text-lg font-semibold rounded-md hover:bg-gray-300 transition">
                ADD TO CART
              </button>
              <button className="bg-transparent text-white border border-white px-6 py-3 text-lg font-semibold rounded-md hover:bg-gray-800 transition">
                START WITH A SETTING
              </button>
            </div>

            {/* Tabbed Content */}
            <div className="mt-8 border-t border-gray-700 pt-4">
              <div className="flex gap-6 text-gray-400 text-lg overflow-x-auto">
                {["features", "care", "shipping"].map((tab) => (
                  <span
                    key={tab}
                    className={`cursor-pointer pb-1 ${
                      activeTab === tab
                        ? "text-white font-semibold border-b-2 border-white"
                        : ""
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === "features"
                      ? "Features"
                      : tab === "care"
                      ? "Product Care"
                      : "Shipping & Returns"}
                  </span>
                ))}
              </div>
              <p className="mt-4 bg-white text-black text-lg p-4 rounded-md">
                {tabContent[activeTab]}
              </p>
            </div>
          </div>

          {/* Right Side - Image Slider */}
          <div className="w-full">
            <Slider {...settings} className="w-full">
              {images.map((src, index) => (
                <div key={index} className="w-full">
                  <img
                    src={src}
                    alt={`Diamond ${index + 1}`}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <section className="relative py-8 bg-black">
        {/* Gradient Fades for Smooth Effect */}
        <div className="absolute inset-0  pointer-events-none" />

        {/* Scrolling Text */}
        <div className="overflow-hidden whitespace-nowrap">
          <motion.div
            className="flex gap-12 text-3xl md:text-4xl font-bold uppercase text-gray-300 tracking-widest"
            animate={{ x: ["0%", "-100%"] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            whileHover={{ animationPlayState: "paused" }} // Pause on hover
          >
            {brands.concat(brands).map((brand, index) => (
              <div
                key={index}
                className="flex-none px-8 py-2 transition-transform hover:scale-110 hover:text-white"
              >
                {brand}
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-3 w-full ">
        {/* Box 1 */}
        <div className="relative group">
          <img
            src={model}
            alt="Box 1"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center ">
            <h2 className="text-white text-3xl font-bold">Wedding Rings</h2>
          </div>
        </div>

        {/* Box 2 */}
        <div className="relative group">
          <img
            src={model}
            alt="Box 2"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center ">
            <h2 className="text-white text-3xl font-bold">Fine Jewelry</h2>
          </div>
        </div>

        {/* Box 3 */}
        <div className="relative group">
          <img
            src={model}
            alt="Box 3"
            className="w-full  object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center ">
            <h2 className="text-white text-3xl font-bold">Engagement Rings</h2>
          </div>
        </div>
      </section>
      <section className="w-full bg-black  py-10">
        <div className="relative w-full px-4">
          <h2 className="text-4xl font-extrabold text-white mb-4 text-center">
            EXPERIENCE THE <br /> DIAMOND REVOLUTION
          </h2>
          <p className="text-lg text-gray-400 mb-8 text-center max-w-3xl mx-auto">
            Spin actual diamonds in 360° HD and zoom in up to 40x. One of the
            world's biggest collections of loose diamonds, at your fingertips.
          </p>

          {/* Swiper Component */}
          <div className="relative">
            {/* Left Arrow */}
            <div className="relative w-full">
              <button
                onClick={goToPrevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-4 w-14 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-75 rounded-full shadow-md transition-all"
              >
                &#10094;
              </button>

              {/* Swiper */}
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  480: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 5 },
                }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={true}
                className="relative"
              >
                {diamonds.map((diamond) => (
                  <SwiperSlide key={diamond.id} className="text-center">
                    <div className="overflow-hidden  transition-all hover:scale-105 flex flex-col items-center bg-gray-900 rounded-lg shadow-lg">
                      {/* Image */}
                      <div className="w-full">
                        <img
                          src={diamond.image}
                          alt={diamond.title}
                          className="w-full h-48 object-contain rounded-t-lg"
                        />
                      </div>

                      {/* Title, Rating, and Description */}
                      <div className="w-full py-3 px-4 bg-gray-900 text-center">
                        <p className="text-lg font-semibold text-white">
                          {diamond.title}
                        </p>

                        <p className="flex justify-center gap-1 text-yellow-500 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill="currentColor"
                              stroke="none"
                            />
                          ))}
                        </p>

                        <p className="text-sm text-gray-400 mt-2">
                          A premium, high-quality diamond with exceptional
                          clarity and brilliance.
                        </p>

                        {/* "Shop Now" Link */}
                        <a
                          href="/shop"
                          className="mt-3 inline-block text-white font-semibold text-xs hover:text-yellow-400 transition-all"
                        >
                          Buy Now
                        </a>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Right Arrow */}
              <button
                onClick={goToNextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-4 w-14 text-white bg-gray-800 bg-opacity-50 hover:bg-opacity-75 rounded-full shadow-md transition-all"
              >
                &#10095;
              </button>
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative bg-cover bg-center bg-no-repeat bg-fixed flex flex-col md:flex-row items-center justify-center "
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          minHeight: "800px",
        }}
      >
        {/* Left Container - Image with Animation */}
        <div className="md:w-1/2">
          <img
            src={leftImage}
            alt="Hero"
            className="w-full h-auto  transform transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Right Container - Text with Glassmorphism Effect */}
        <div className="md:w-1/2 w-full flex flex-col justify-center text-center md:text-left p-6 md:p-10 ">
          <h2 className="text-4xl md:text-6xl font-extrabold text-black animate-fadeIn">
            The Brilliance of Diamonds
          </h2>
          <p className="mt-4 text-gray-500 text-lg md:text-xl leading-relaxed animate-fadeIn delay-200">
            Diamonds are formed under extreme heat and pressure, creating a
            timeless symbol of luxury and beauty.
          </p>
          <p className="mt-2 text-gray-500 text-lg animate-fadeIn delay-400">
            Did you know? The largest diamond ever found, the Cullinan Diamond,
            weighed an astonishing 3,106 carats!
          </p>

          {/* Interactive Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <button className="px-8 py-2 text-white bg-gradient-to-r from-gray-900 to-black border border-gray-700 rounded-md shadow-lg hover:scale-105 transition-all duration-300">
              Learn More
            </button>
            <button className="px-8 py-2 text-black bg-gradient-to-r from-white to-gray-200 border border-gray-400 rounded-md shadow-lg hover:scale-105 transition-all duration-300">
              Shop Now
            </button>
          </div>
        </div>
      </section>

      <section className="w-full bg-white mt-2  ">
        <div className="relative w-full  px-4">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">
            EXPERIENCE THE <br /> DIAMOND REVOLUTION
          </h2>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            Spin actual diamonds in 360° HD and zoom in up to 40x. One of the
            world's biggest collections of loose diamonds, at your fingertips.
          </p>

          {/* Swiper Component */}
          <div className="relative ">
            {/* Left Arrow */}

            <div className="relative w-full">
              <button
                onClick={goToPrevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-4 w-14 text-black bg-white m-2 hover:bg-opacity-75 rounded-full shadow-md transition-all"
              >
                &#10094; {/* HTML entity for ‹ */}
              </button>

              {/* Swiper Component */}
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  480: { slidesPerView: 2 },
                  768: { slidesPerView: 3 },
                  1024: { slidesPerView: 4 },
                  1280: { slidesPerView: 5 },
                }}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                loop={true}
                className="relative"
              >
                {diamonds.map((diamond) => (
                  <SwiperSlide key={diamond.id} className="text-center">
                    <div className="overflow-hidden pt-2 transition-all hover:scale-105 flex flex-col items-center bg-white ">
                      {/* Image Container (Full display) */}
                      <div className="w-full">
                        <img
                          src={diamond.image}
                          alt={diamond.title}
                          className="w-full h-48 object-contain rounded-t-lg"
                        />
                      </div>

                      {/* Title, Rating, and Description */}
                      {/* Title, Rating, and Description */}
                      <div className="w-full py-3 px-4 bg-white text-center">
                        <p className="text-lg font-semibold text-gray-900">
                          {diamond.title}
                        </p>

                        <p className="flex justify-center gap-1 text-yellow-500 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill="currentColor"
                              stroke="none"
                            />
                          ))}
                        </p>

                        <p className="text-sm text-gray-600 mt-2">
                          A premium, high-quality diamond with exceptional
                          clarity and brilliance.
                        </p>

                        {/* "Shop Now" Link */}
                        <a
                          href="/shop"
                          className="mt-3 inline-block text-black-600 font-semibold text-xs hover:underline transition-all"
                        >
                          Buy Now
                        </a>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                onClick={goToNextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-4 w-14 text-black bg-white m-2 hover:bg-opacity-75 rounded-full shadow-md transition-all"
              >
                &#10095; {/* HTML entity for › */}
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="relative w-full bg-[#FFF5E1] py-16 overflow-hidden">
        {/* Animated Background Circles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, index) => (
            <div
              key={index}
              className="absolute bg-[#f8d49f] opacity-40 animate-move-circle"
              style={{
                width: `${Math.random() * 150 + 50}px`, // Square size
                height: `${Math.random() * 150 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: "rotate(45deg)", // Make it a diamond
                animationDuration: `${Math.random() * 4 + 3}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="relative w-full px-4">
          {/* Heading & Description */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-extrabold text-black">
              THE CROWNING JEWELS
            </h2>
            <p className="text-lg text-black mt-4 max-w-2xl mx-auto">
              Our diamond and gemstone fine jewelry collection offers
              hand-crafted pieces of unforgettable luxury that are perfect for
              any occasion.
            </p>
          </div>

          {/* Content Sections */}
          <div className="container mx-auto px-4 py-8 space-y-8">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 items-center ${
                  index % 2 === 0 ? "" : "md:flex-row-reverse"
                }`}
              >
                {index % 2 === 0 ? (
                  <>
                    <div className="relative w-full mt-24">
                      <img
                        src={model}
                        alt="Luxury Diamond Jewelry"
                        className="w-full h-auto md:h-full object-cover rounded-lg shadow-lg"
                      />
                      <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 md:translate-x-[-20%] translate-y-[50%] bg-white bg-opacity-90 p-6 md:p-8 rounded-md shadow-xl w-[85%] md:w-[75%] text-center">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                          ETERNITY RINGS
                        </h3>
                        <p className="text-sm md:text-md text-gray-700 mt-2">
                          The ultimate symbol of lifelong commitment, eternity
                          rings make for an ideal wedding or anniversary ring,
                          or can be worn alongside your engagement ring.
                        </p>
                        <button className="mt-3 font-semibold text-sm text-black underline hover:text-gray-700 transition-all">
                          EXPLORE
                        </button>
                      </div>
                    </div>
                    <div></div>
                  </>
                ) : (
                  <>
                    <div></div>
                    <div className="relative w-full mt-24">
                      <img
                        src={model}
                        alt="Luxury Diamond Jewelry"
                        className="w-full h-auto md:h-full object-cover rounded-lg shadow-lg"
                      />
                      <div className="absolute left-1/2 bottom-4 transform -translate-x-1/2 md:translate-x-[-100%] translate-y-[50%] bg-white bg-opacity-90 p-6 md:p-8 rounded-md shadow-xl w-[85%] md:w-[75%] text-center">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900">
                          ETERNITY RINGS
                        </h3>
                        <p className="text-sm md:text-md text-gray-700 mt-2">
                          The ultimate symbol of lifelong commitment, eternity
                          rings make for an ideal wedding or anniversary ring,
                          or can be worn alongside your engagement ring.
                        </p>
                        <button className="mt-3 font-semibold text-sm text-black underline hover:text-gray-700 transition-all">
                          EXPLORE
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes move-circle {
            0% {
              transform: translateY(0) translateX(0);
            }
            50% {
              transform: translateY(50px) translateX(-50px);
            }
            100% {
              transform: translateY(0) translateX(0);
            }
          }

          .animate-move-circle {
            position: absolute;
            animation: move-circle infinite alternate ease-in-out;
          }
        `}</style>
      </section>
    </div>
  );
}

export default Home;

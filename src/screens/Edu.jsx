import React, { useEffect, useRef } from "react";
import heroImage from "../../src/assets/j.jpeg"; // Import the hero image
import diamondImage from "../../src/assets/d.jpeg"; // Import the diamond image
import engagementRingImage from "../../src/assets/d.jpeg"; // Import the engagement ring image
import weddingRingImage from "../../src/assets/d.jpeg"; // Import the wedding ring image
import jewelryImage from "../../src/assets/d.jpeg"; // Import the jewelry image
import gemstoneImage from "../../src/assets/d.jpeg"; // Import the gemstone image
import Slider from "react-slick"; // Import the Slider component
import "slick-carousel/slick/slick.css"; // Import slick styles
import "slick-carousel/slick/slick-theme.css"; // Import slick theme styles
import { CheckCircle, Truck, ShieldCheck, Headphones, Gem } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles

const EducationPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration
      once: true, // Only trigger animations once
    });
  }, []);

  const guarantees = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-[#BF927F]" />,
      title: "Lifetime Warranty",
      desc: "Your diamond is protected for life with our expert care.",
    },
    {
      icon: <Truck className="w-10 h-10 text-[#BF927F]" />,
      title: "Free Shipping Worldwide",
      desc: "Enjoy fast and secure shipping, no matter where you are.",
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-[#BF927F]" />,
      title: "100% Money-Back Guarantee",
      desc: "Full refunds within 30 days for a worry-free purchase.",
    },
    {
      icon: <Headphones className="w-10 h-10 text-[#BF927F]" />,
      title: "24/7 Diamond Experts",
      desc: "Get assistance from our gem specialists anytime.",
    },
    {
      icon: <Gem className="w-10 h-10 text-[#BF927F]" />,
      title: "500,000+ Certified Conflict-Free Diamonds",
      desc: "Ethically sourced, high-quality diamonds you can trust.",
    },
  ];

  const sliderRef = useRef(null);
  const diamondData = [
    {
      id: 1,
      title: "The 4Cs of Diamonds",
      desc: "Understand the key factors: Cut, Color, Clarity, and Carat weight. Learn how these characteristics define a diamond’s value and brilliance.",
      image: diamondImage, // Replace with actual 4Cs image
    },
    {
      id: 2,
      title: "Diamond Shapes",
      desc: "Explore various diamond shapes, from classic round to elegant oval and unique marquise. Choose the perfect shape for your style.",
      image: diamondImage, // Replace with actual diamond shapes image
    },
    {
      id: 3,
      title: "Colored Diamonds",
      desc: "Discover rare and vibrant colored diamonds, including blue, pink, and yellow hues. Learn about their rarity and pricing factors.",
      image: diamondImage, // Replace with actual colored diamonds image
    },
    {
      id: 4,
      title: "Loose Diamonds",
      desc: "Find the perfect loose diamond for custom jewelry. Compare different cuts and qualities before setting your stone in a ring or pendant.",
      image: diamondImage, // Replace with actual loose diamonds image
    },
    {
      id: 5,
      title: "Diamond Certification",
      desc: "Understand diamond certification from GIA, IGI, and AGS. Ensure authenticity, grading, and quality before making a purchase.",
      image: diamondImage, // Replace with actual certification image
    },
    {
      id: 6,
      title: "Diamond Investment",
      desc: "Learn about diamonds as an investment. Understand market trends, rarity, and factors that influence long-term value which is profitable.",
      image: diamondImage, // Replace with actual diamond investment image
    },
  ];

  const settings = {
    autoplay: true,
    autoplaySpeed: 5000,
    slidesToShow: 5,
    slidesToScroll: 1,
    infinite: true,
    arrows: false,
    dots: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2, slidesToScroll: 1 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container w-full max-w-full">
          <div className="relative">
            {/* Full-width Image */}
            <img
              src={heroImage}
              alt="Jewelry Education"
              className="w-full h-auto"
            />
            {/* Overlay Text on the Left */}
            <div className="absolute top-0 left-0 w-1/2 h-full flex items-center justify-center text-black">
              <h1 className="text-4xl md:text-5xl font-bold text-center ">
                BECOME AN EXPERT WITH OUR JEWELRY EDUCATION
              </h1>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden md:py-12 lg:py-24">
        <div className="container w-full max-w-full p-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Diamond Education Box */}
            <div className="relative" data-aos="fade-right">
              <img
                src={diamondImage}
                alt="Diamond Education"
                className="w-full h-auto"
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start p-4 text-black">
                <p className="text-xl font-bold">DIAMONDS</p>
              </div>
            </div>
            {/* Engagement Ring Guide Box */}
            <div className="relative" data-aos="fade-right">
              <img
                src={engagementRingImage}
                alt="Engagement Ring Guide"
                className="w-full h-auto"
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start p-4 text-black">
                <p className="text-xl font-bold">ENGAGEMENT RINGS</p>
              </div>
            </div>
            {/* Wedding Rings Guide Box */}
            <div className="relative" data-aos="fade-right">
              <img
                src={weddingRingImage}
                alt="Wedding Rings Guide"
                className="w-full h-auto"
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start p-4 text-black">
                <p className="text-xl font-bold">WEDDING RINGS</p>
              </div>
            </div>
            {/* Jewelry Guide Box */}
            <div className="relative" data-aos="fade-right">
              <img
                src={jewelryImage}
                alt="Jewelry Guide"
                className="w-full h-auto"
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start p-4 text-black">
                <p className="text-xl font-bold">FINE JEWELRY</p>
              </div>
            </div>
            {/* Gemstone Education Box */}
            <div className="relative" data-aos="fade-right">
              <img
                src={gemstoneImage}
                alt="Gemstone Education"
                className="w-full h-auto"
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-start justify-start p-4 text-black">
                <p className="text-xl font-bold">GEMSTONES</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8" data-aos="fade-up">
            EXPLORE MORE POPULAR TOPICS
          </h2>
          <div>
            <Slider ref={sliderRef} {...settings}>
              {diamondData.map((diamond) => (
                <div key={diamond.id} className="p-2">
                  <div
                    className="bg-white rounded-md h-100 shadow-md py-8 flex flex-col items-center 
                      border-2 border-solid border-gray-300 text-center space-y-4 
                      "
                  >
                    {/* Image with Zoom Effect */}
                    <img
                      src={diamond.image}
                      alt={diamond.title}
                      className="w-36 h-36 object-cover rounded-full border-2 border-gray-300 
                     transition-transform duration-300 ease-in-out hover:scale-110"
                    />

                    {/* Title */}
                    <h3 className="text-xl font-semibold">{diamond.title}</h3>

                    {/* Description */}
                    <p className="text-gray-600 p-4">{diamond.desc}</p>

                    {/* Buttons */}
                    <div className="flex space-x-4">
                      <button
                        className="px-24 py-4 bg-black text-white rounded-md 
                             transition-all duration-300 ease-in-out 
                             hover:bg-gray-800 hover:scale-105"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>
      <div className="bg-white py-12 px-6 md:px-16 lg:px-24 text-center" data-aos="fade-up">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 tracking-wide">
          Airah Diamonds Guarantee ✨
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {guarantees.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 p-6 rounded-md shadow-md flex flex-col 
                       items-center text-center hover:shadow-lg hover:bg-gray-50 
                       transition-all duration-300 ease-in-out"
              data-aos="fade-up"
            >
              <div className="mb-4 ">{item.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EducationPage;
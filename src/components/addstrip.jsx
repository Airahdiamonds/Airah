import React, { useState, useEffect } from "react";

const AdvertisementStrip = () => {
  // Timer State for Limited Offers
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes (600 seconds)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format Time into MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="overflow-hidden bg-black py-2 border-b border-gray-700">
      <div className="w-full flex">
        {/* Text container for seamless scrolling */}
        <div className="animate-scroll whitespace-nowrap text-white text-sm font-semibold tracking-wide uppercase w-max">
          ✨ Exquisite Diamond Collection • 💎 100% Certified Diamonds • 🌟 Unparalleled Brilliance & Craftsmanship • 🎁 Special Offers on Engagement Rings • 
          🕒 Limited Time Deal: 10% Off – Ends in {formatTime(timeLeft)} ⏳ • 💍 Custom Diamond Rings Now Available • 🔥 Exclusive Discount on Wedding Bands • 
          💠 Lab-Grown & Natural Diamonds • ✨ Shop Now & Get Free Shipping • 🔷 Secure Checkout & Lifetime Warranty • 
          
          {/* Duplicate text to create seamless loop */}
          ✨ Exquisite Diamond Collection • 💎 100% Certified Diamonds • 🌟 Unparalleled Brilliance & Craftsmanship • 🎁 Special Offers on Engagement Rings • 
          🕒 Limited Time Deal: 10% Off – Ends in {formatTime(timeLeft)} ⏳ • 💍 Custom Diamond Rings Now Available • 🔥 Exclusive Discount on Wedding Bands • 
          💠 Lab-Grown & Natural Diamonds • ✨ Shop Now & Get Free Shipping • 🔷 Secure Checkout & Lifetime Warranty 
        </div>
      </div>
    </div>
  );
};

export default AdvertisementStrip;

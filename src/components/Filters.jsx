import { useState } from 'react';
import { motion } from 'framer-motion';
import princessPng from '../assets/shapes/princess.png';
import emeraldPng from '../assets/shapes/emerald.png';
import asscherPng from '../assets/shapes/asscher.png';
import ovalPng from '../assets/shapes/oval.png';
import pearPng from '../assets/shapes/pear.png';
import marquisePng from '../assets/shapes/marquise.png';
import radiantPng from '../assets/shapes/radiant.png';
import cushionPng from '../assets/shapes/cushion.png';

const Filters = ({ filters, setFilters }) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const toggleFilter = (category) => {
    setActiveFilter(prev => (prev === category ? null : category));
  };

  const handleSliderChange = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: value,
    }));
  };

  // Initial filter values (matching image defaults)
  const initialFilters = {
    shape: 'round',
    cut: 'Good',
    color: 'H',
    clarity: 'SI2',
    carat: 1.0,
    price: 200,
    type: 'Lab-Grown',
  };

  return (
    <div className="w-full flex justify-center px-4">
      <div className="w-full max-w-full">
        {/* Type Toggle (Natural vs Lab-Grown) */}
        {/* (Removed temporarily as it was empty in the provided code) */}

        {/* Filter Rows */}
        <div className="space-y-6">
          {/* Row 1: Shape & Cut */}
          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Shape</label>
              <div className="flex gap-2 mb-2">
                {[
                  { name: 'princess', image: princessPng },
                  { name: 'emerald', image: emeraldPng },
                  { name: 'asscher', image: asscherPng },
                  { name: 'oval', image: ovalPng },
                  { name: 'pear', image: pearPng },
                  { name: 'marquise', image: marquisePng },
                  { name: 'radiant', image: radiantPng },
                  { name: 'cushion', image: cushionPng },
                ].map(({ name, image }) => (
                  <div
                    key={name}
                    className={`w-10 h-10 border border-gray-300 rounded-md cursor-pointer flex items-center justify-center ${
                      filters.shape === name ? 'bg-gray-200' : ''
                    }`}
                    onClick={() => handleSliderChange('shape', name)}
                  >
                    <img src={image} alt={name} className="w-8 h-8 object-contain" />
                  </div>
                ))}
              </div>
              <div className="w-20 h-10 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 shadow-inner">
                {filters.shape || initialFilters.shape}
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Cut</label>
              <input
                type="range"
                min="0"
                max="3"
                value={filters.cut ? ['Good', 'Very Good', 'Ideal', 'True Hearts'].indexOf(filters.cut) : 0}
                onChange={(e) => handleSliderChange('cut', ['Good', 'Very Good', 'Ideal', 'True Hearts'][e.target.value])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>Good</span>
                <span>Very Good</span>
                <span>Ideal</span>
                <span>True Hearts™</span>
              </div>
              <div className="w-20 h-10 mt-2 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-xs font-medium text-gray-700 shadow-inner">
                {filters.cut || initialFilters.cut}
              </div>
            </div>
          </div>

          {/* Row 2: Color & Clarity */}
          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Color</label>
              <input
                type="range"
                min="0"
                max="9"
                value={filters.color ? ['M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D'].indexOf(filters.color) : 5}
                onChange={(e) => handleSliderChange('color', ['M', 'L', 'K', 'J', 'I', 'H', 'G', 'F', 'E', 'D'][e.target.value])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>M</span><span>L</span><span>K</span><span>J</span><span>I</span>
                <span>H</span><span>G</span><span>F</span><span>E</span><span>D</span>
              </div>
              <div className="w-20 h-10 mt-2 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 shadow-inner">
                {filters.color || initialFilters.color}
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Clarity</label>
              <input
                type="range"
                min="0"
                max="8"
                value={filters.clarity ? ['I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'].indexOf(filters.clarity) : 1}
                onChange={(e) => handleSliderChange('clarity', ['I1', 'SI2', 'SI1', 'VS2', 'VS1', 'VVS2', 'VVS1', 'IF', 'FL'][e.target.value])}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>I1</span><span>SI2</span><span>SI1</span><span>VS2</span><span>VS1</span>
                <span>VVS2</span><span>VVS1</span><span>IF</span><span>FL</span>
              </div>
              <div className="w-20 h-10 mt-2 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 shadow-inner">
                {filters.clarity || initialFilters.clarity}
              </div>
            </div>
          </div>

          {/* Row 3: Carat & Price */}
          <div className="flex justify-between gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Carat</label>
              <input
                type="range"
                min="0.5"
                max="8.0"
                step="0.1"
                value={filters.carat || initialFilters.carat}
                onChange={(e) => handleSliderChange('carat', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>0.5</span>
                <span>8.0</span>
              </div>
              <div className="w-20 h-10 mt-2 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 shadow-inner">
                {filters.carat || initialFilters.carat}
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="range"
                min="200"
                max="50000"
                value={filters.price || initialFilters.price}
                onChange={(e) => handleSliderChange('price', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
              />
              <div className="flex justify-between text-xs mt-1">
                <span>$200</span>
                <span>$50,000</span>
              </div>
              <div className="w-20 h-10 mt-2 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 shadow-inner">
                ${filters.price || initialFilters.price}
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Options */}
        {/* (Removed temporarily as it was empty in the provided code) */}

        {/* Clear Filters */}
        <div className="mt-4 text-left">
          <button
            onClick={() => setFilters(initialFilters)}
            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg border border-red-400 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
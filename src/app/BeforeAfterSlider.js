"use client";
import { useState, useRef } from "react";
import Image from 'next/image';

const BeforeAfterSlider = ({ 
  hours = 1.5,
  frequency = 2,
  courts = 15,
  beforeAlt = "Human Cleaning Capacity", 
  afterAlt = "Robot Cleaning Capacity" 
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Calculate cleaning capacity
  const humanCapacity = Math.floor((hours * frequency) / 3);
  const robotCapacity = Math.floor((hours * frequency) / 1.5);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  // Component to render court grid
  const CourtGrid = ({ cleanedCourts, totalCourts, label, labelColor }) => {
    const rows = Math.ceil(totalCourts / 6); // 6 courts per row
    const courtsArray = Array.from({ length: totalCourts }, (_, i) => i);

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
        <div className={`mb-4 px-4 py-2 rounded-full font-bold text-white ${labelColor}`}>
          {label}: {cleanedCourts}/{totalCourts} courts
        </div>
        <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}>
          {courtsArray.map((courtIndex) => (
            <div
              key={courtIndex}
              className={`w-16 h-10 rounded border-2 transition-all duration-300 ${
                courtIndex < cleanedCourts
                  ? 'bg-green-500 border-green-600 shadow-lg'
                  : 'bg-gray-300 border-gray-400 grayscale'
              }`}
              style={{
                backgroundImage: courtIndex < cleanedCourts ? 'url(/image.jpg)' : 'url(/image.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: courtIndex < cleanedCourts ? 'none' : 'grayscale(100%) brightness(0.7)'
              }}
            >
              <div className={`w-full h-full rounded ${
                courtIndex < cleanedCourts ? 'bg-green-500 bg-opacity-60' : 'bg-gray-500 bg-opacity-60'
              }`}></div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-sm text-gray-600 text-center max-w-xs">
          {label === "Human Cleaning" 
            ? `${hours} hours × ${frequency} times/week ÷ 3 hours per court`
            : `${hours} hours × ${frequency} times/week ÷ 1.5 hours per court`
          }
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Cleaning Capacity Comparison
      </h2>
      <h2 className="text-2xl font-bold text-center mb-5 text-gray-800">
        Human to Robot Comparison
      </h2>
      
      <div
        ref={containerRef}
        className="relative w-full h-96 md:h-[500px] overflow-hidden rounded-lg shadow-2xl cursor-ew-resize select-none border-2 border-gray-300"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Robot Cleaning (Background/After) */}
        <CourtGrid 
          cleanedCourts={robotCapacity}
          totalCourts={courts}
          label="CECE Robot Cleaning"
          labelColor="bg-green-600"
        />

        {/* Human Cleaning (Overlay/Before) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <CourtGrid 
            cleanedCourts={humanCapacity}
            totalCourts={courts}
            label="Human Cleaning"
            labelColor="bg-red-600"
          />
        </div>

        {/* Slider Line and Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          {/* Slider Handle */}
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg border-4 border-gray-300 cursor-ew-resize flex items-center justify-center hover:border-green-500 transition-colors z-20"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="flex space-x-1">
              <div className="w-0.5 h-6 bg-gray-400"></div>
              <div className="w-0.5 h-6 bg-gray-400"></div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm z-10">
          Drag to compare cleaning capacity
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-bold text-red-800 mb-2">Human Cleaning</h3>
          <p className="text-red-700">Can clean <span className="font-bold">{humanCapacity}</span> out of {courts} courts</p>
          <p className="text-sm text-red-600 mt-1">Efficiency: {((humanCapacity / courts) * 100).toFixed(1)}%</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-bold text-green-800 mb-2">CECE Robot</h3>
          <p className="text-green-700">Can clean <span className="font-bold">{robotCapacity}</span> out of {courts} courts</p>
          <p className="text-sm text-green-600 mt-1">Efficiency: {((robotCapacity / courts) * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;

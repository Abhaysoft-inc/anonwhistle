'use client';

import { useState } from 'react';
import { FaExclamationTriangle, FaTimes, FaShieldAlt, FaPhone, FaLock } from 'react-icons/fa';

export default function FloatingPanicButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);

  const handleMouseDown = () => {
    setIsPressed(true);
    const timer = setTimeout(() => {
      // Redirect to weather page after 2 seconds
      window.location.href = 'https://www.google.com/search?q=weather+forecast';
    }, 2000); // 2 seconds hold
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  return (
    <>
      {/* Floating Panic Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className={`w-16 h-16 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center text-white font-bold text-lg select-none ${
            isPressed 
              ? 'bg-red-600 scale-110 shadow-xl' 
              : 'bg-red-500 hover:bg-red-600 hover:scale-105'
          }`}
          title="Hold for 2 seconds to activate panic mode"
        >
          <FaExclamationTriangle className={`transition-all duration-300 ${
            isPressed ? 'text-2xl animate-pulse' : 'text-xl'
          }`} />
          
          {/* Hold indicator */}
          {isPressed && (
            <div className="absolute inset-0 rounded-full border-4 border-white animate-ping"></div>
          )}
        </button>
        
        {/* Instructions tooltip */}
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
          Hold for 2s for emergency
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </>
  );
}
'use client';

import { useState } from 'react';
import { FaExclamationTriangle, FaTimes, FaShieldAlt, FaPhone, FaLock } from 'react-icons/fa';

export default function FloatingPanicButton() {
  const [isPressed, setIsPressed] = useState(false);
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [pressTimer, setPressTimer] = useState(null);

  const handleMouseDown = () => {
    setIsPressed(true);
    const timer = setTimeout(() => {
      activatePanicMode();
    }, 3000); // 3 seconds hold
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

  const activatePanicMode = () => {
    setIsPanicMode(true);
    setIsPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }

    // Start 10-second countdown
    let timeLeft = 10;
    setCountdown(timeLeft);
    
    const countdownTimer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      
      if (timeLeft === 0) {
        clearInterval(countdownTimer);
        executeEmergencyProtocol();
      }
    }, 1000);

    // Store timer to clear if cancelled
    setPressTimer(countdownTimer);
  };

  const executeEmergencyProtocol = () => {
    // Simulate emergency protocol
    console.log('🚨 EMERGENCY PROTOCOL ACTIVATED');
    console.log('📱 Sending alert to emergency contacts...');
    console.log('📍 Location tracking activated...');
    console.log('🔒 Secure mode enabled...');
    console.log('📞 Emergency services notified...');
    
    // Reset after execution
    setTimeout(() => {
      setIsPanicMode(false);
      setCountdown(null);
      setPressTimer(null);
    }, 3000);
  };

  const cancelPanic = () => {
    if (pressTimer) {
      clearInterval(pressTimer);
      setPressTimer(null);
    }
    setIsPanicMode(false);
    setCountdown(null);
  };

  return (
    <>
      {/* Panic Mode Overlay */}
      {isPanicMode && (
        <div className="fixed inset-0 bg-red-600 bg-opacity-95 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <div className="text-red-600 text-6xl mb-4">
              <FaExclamationTriangle className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">PANIC MODE ACTIVATED</h2>
            <p className="text-gray-600 mb-6">
              Emergency protocol will execute in <span className="text-red-600 font-bold text-xl">{countdown}</span> seconds
            </p>
            
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <FaPhone className="text-red-500" />
                <span>Emergency contacts will be notified</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <FaShieldAlt className="text-red-500" />
                <span>Location tracking activated</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <FaLock className="text-red-500" />
                <span>Secure mode enabled</span>
              </div>
            </div>
            
            <button
              onClick={cancelPanic}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel Emergency Protocol
            </button>
          </div>
        </div>
      )}

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
          title="Hold for 3 seconds to activate panic mode"
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
          Hold for 3s for emergency
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </>
  );
}
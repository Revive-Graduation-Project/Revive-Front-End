// src/pages/customization/Sections/GramsCounter.jsx
import React, { useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GramsCounter = ({
  value = 50,
  onChange,
  min = 5,
  max = 1000,
  step = 5
}) => {
  const currentVal = parseInt(value, 10) || min;
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const clearTimers = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  const adjustValue = (delta) => {
    const nextVal = Math.min(max, Math.max(min, currentVal + delta));
    if (nextVal !== currentVal && onChange) {
      onChange(nextVal);
    }
  };

  const startHolding = (delta) => {
    adjustValue(delta);
    clearTimers();

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        adjustValue(delta);
      }, 80);
    }, 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      adjustValue(-step);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      adjustValue(step);
    }
  };

  const atMin = currentVal <= min;
  const atMax = currentVal >= max;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
      role="group"
      aria-label="Grams quantity selector"
      tabIndex={0}
      className="flex items-center justify-between bg-white border border-orange-200/80 rounded-xl p-1 shadow-sm hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all select-none w-full"
    >
      {/* Minus Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onMouseDown={() => startHolding(-step)}
        onMouseUp={clearTimers}
        onMouseLeave={clearTimers}
        onTouchStart={() => startHolding(-step)}
        onTouchEnd={clearTimers}
        disabled={atMin}
        aria-label="Decrease grams"
        className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center transition
          ${
            atMin
              ? "text-gray-300 cursor-not-allowed bg-transparent"
              : "text-orange-600 hover:bg-orange-50 active:bg-orange-100 cursor-pointer"
          }`}
      >
        <Minus size={14} strokeWidth={2.5} />
      </motion.button>

      {/* Value Display */}
      <div className="flex-1 flex items-center justify-center px-1 text-center min-w-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentVal}
            initial={{ opacity: 0.7, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.7, scale: 0.94 }}
            transition={{ duration: 0.12 }}
            className="text-xs sm:text-sm font-bold text-gray-900 tracking-tight whitespace-nowrap"
          >
            {currentVal}
            <span className="text-[11px] font-semibold text-gray-400 ml-0.5">
              g
            </span>
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Plus Button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onMouseDown={() => startHolding(step)}
        onMouseUp={clearTimers}
        onMouseLeave={clearTimers}
        onTouchStart={() => startHolding(step)}
        onTouchEnd={clearTimers}
        disabled={atMax}
        aria-label="Increase grams"
        className={`w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-lg flex items-center justify-center transition
          ${
            atMax
              ? "text-gray-300 cursor-not-allowed bg-transparent"
              : "text-orange-600 hover:bg-orange-50 active:bg-orange-100 cursor-pointer"
          }`}
      >
        <Plus size={14} strokeWidth={2.5} />
      </motion.button>
    </div>
  );
};

export default GramsCounter;

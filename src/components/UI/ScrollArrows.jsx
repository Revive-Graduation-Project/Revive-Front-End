import React from "react";

const ScrollArrows = ({
  onScrollLeft,
  onScrollRight,
  canScrollLeft,
  canScrollRight,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onScrollLeft}
        disabled={!canScrollLeft}
        aria-label="Scroll left"
        className="
          flex items-center justify-center
          w-9 h-9 rounded-full border border-gray-300 bg-white shadow-sm
          text-gray-600
          transition-all duration-200
          hover:bg-orange-50 hover:border-orange-400 hover:text-orange-500 hover:shadow-md
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white
          disabled:hover:border-gray-300 disabled:hover:text-gray-600 disabled:hover:shadow-sm
          cursor-pointer
        "
      >
        {/* Left chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <button
        onClick={onScrollRight}
        disabled={!canScrollRight}
        aria-label="Scroll right"
        className="
          flex items-center justify-center
          w-9 h-9 rounded-full border border-gray-300 bg-white shadow-sm
          text-gray-600
          transition-all duration-200
          hover:bg-orange-50 hover:border-orange-400 hover:text-orange-500 hover:shadow-md
          disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white
          disabled:hover:border-gray-300 disabled:hover:text-gray-600 disabled:hover:shadow-sm
          cursor-pointer
        "
      >
        {/* Right chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>
  );
};

export default ScrollArrows;

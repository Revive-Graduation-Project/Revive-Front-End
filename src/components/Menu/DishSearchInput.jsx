import { useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { FaUtensils } from "react-icons/fa";
import { useDishSearch } from "../../search/useDishSearch";

export default function DishSearchInput({ meals = [], onSelectDish }) {
  const containerRef = useRef(null);
  const {
    query,
    setQuery,
    results,
    isOpen,
    selectedIndex,
    setSelectedIndex,
    handleQueryChange,
    handleSelect,
    handleKeyDown,
    clearQuery,
    setIsOpen,
  } = useDishSearch(meals, { onSelectDish });

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isOpen && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto my-4">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <CiSearch className="absolute left-4 text-2xl text-green pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          placeholder="Search dishes (e.g. Lava Cake, Grilled Chicken...)"
          className="w-full bg-white border-2 border-green/30 focus:border-green text-gray-800 rounded-full pl-12 pr-10 py-2.5 text-sm md:text-base outline-none shadow-sm transition-all duration-200"
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            aria-label="Clear search"
            className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
          >
            <IoClose className="text-xl" />
          </button>
        )}
      </form>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No menu dishes found matching "{query}"
            </div>
          ) : (
            <ul className="py-2" role="listbox">
              {results.map((dish, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <li
                    key={dish.id}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelect(dish);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between gap-3 px-4 py-3 cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-orange-50 text-orange-900 border-l-4 border-orange"
                        : "hover:bg-gray-50 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {dish.imageUrl ? (
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange flex-shrink-0">
                          <FaUtensils />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-bold text-sm truncate">
                          {dish.name}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {dish.description || dish.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-bold text-green">
                        {dish.price} EGP
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                        {dish.category || "Dish"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

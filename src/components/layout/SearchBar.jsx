import { useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { FaUtensils } from "react-icons/fa";
import { useMenuItems, isMenuItemActive } from "../../hooks/dashboard/useMenuItems";
import { useDishSearch } from "../../search/useDishSearch";

export default function SearchBar() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { data: rawMeals = [] } = useMenuItems({});
  const meals = useMemo(() => rawMeals.filter(isMenuItemActive), [rawMeals]);

  const handleSelectDish = (dish) => {
    if (!dish) return;
    navigate(`/menu?dishId=${dish.id}`);
  };

  const {
    query,
    results,
    isOpen,
    selectedIndex,
    setSelectedIndex,
    handleQueryChange,
    handleSelect,
    handleKeyDown,
    clearQuery,
    setIsOpen,
  } = useDishSearch(meals, { onSelectDish: handleSelectDish });

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
    if (results.length > 0) {
      const targetDish = results[selectedIndex] || results[0];
      handleSelect(targetDish);
    } else if (query.trim()) {
      navigate(`/menu?search=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative grow-2 order-3 md:order-2">
      <form onSubmit={handleSubmit} className="w-full relative">
        <input
          type="text"
          name="search"
          value={query}
          onChange={handleQueryChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.trim().length > 0) setIsOpen(true);
          }}
          placeholder="Search menu dishes..."
          autoComplete="off"
          className="border px-10 py-1 rounded-3xl border-green w-full outline-none focus:ring text-sm md:text-base"
        />
        <CiSearch className="text-2xl text-green ml-2 absolute top-1/2 transform -translate-y-1/2 left-1 pointer-events-none" />
        {query && (
          <button
            type="button"
            onClick={clearQuery}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
          >
            <IoClose className="text-lg" />
          </button>
        )}
      </form>

      {/* Dish Search Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
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
                          className="w-9 h-9 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange flex-shrink-0">
                          <FaUtensils className="text-sm" />
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

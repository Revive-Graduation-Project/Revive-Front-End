import { useState, useEffect, useRef } from "react";
import { FiChevronDown, FiSearch, FiX, FiPlus } from "react-icons/fi";
import { inferIngredientUnit } from "../../../utils/stockUtils";

const scrollbarStyles = `
  .custom-slim-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(209, 213, 219, 0.8) transparent;
  }
  .custom-slim-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .custom-slim-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .custom-slim-scroll::-webkit-scrollbar-thumb {
    background: rgba(209, 213, 219, 0.8);
    border-radius: 9999px;
  }
  .custom-slim-scroll::-webkit-scrollbar-thumb:hover {
    background: rgba(156, 163, 175, 1);
  }
`;

export default function IngredientSelector({
  availableIngredients = [],
  newIngredient,
  setNewIngredient,
  isCustomName,
  setIsCustomName,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const listRef = useRef(null);
  const popoverRef = useRef(null);

  const filtered = availableIngredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.category && i.category.toLowerCase().includes(search.toLowerCase()))
  );

  useEffect(() => {
    setActiveIndex(-1);
  }, [search, isOpen]);

  // Automatically scroll the page so the opened menu is fully visible
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        if (popoverRef.current) {
          popoverRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
        }
      }, 80);
    }
  }, [isOpen]);

  // Scroll active item into view during keyboard navigation
  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[activeIndex];
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  const handleSelect = (ing) => {
    setNewIngredient((p) => ({
      ...p,
      name: ing.name,
      ingredientId: ing.id,
      unit: inferIngredientUnit(ing.name, ing.unit),
      amount: p.amount || "0",
    }));
    setIsOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filtered[activeIndex]) {
        handleSelect(filtered[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  if (isCustomName) {
    return (
      <div className="flex items-center justify-between w-full bg-[#F5F6F8] rounded-full py-1.5 px-4 shadow-inner border border-orange-300 transition-all">
        <input
          className="bg-transparent text-[12px] font-bold text-[#1a1a1a] border-none outline-none w-full text-center placeholder:text-gray-400 placeholder:font-normal"
          placeholder="Type custom name..."
          value={newIngredient.name}
          onChange={(e) => setNewIngredient((p) => ({ ...p, name: e.target.value }))}
          autoFocus
        />
        <button
          type="button"
          onClick={() => {
            setIsCustomName(false);
            setNewIngredient((p) => ({ ...p, name: "" }));
          }}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-5 h-5 flex items-center justify-center text-[11px] font-bold transition-colors shrink-0 ml-1 cursor-pointer"
          title="Back to dropdown"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <style>{scrollbarStyles}</style>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-[#F5F6F8] hover:bg-gray-100 transition-all rounded-full py-2 px-4 flex items-center justify-between gap-2 text-left cursor-pointer border ${
          isOpen ? "border-orange-400 bg-white shadow-sm ring-2 ring-orange-100" : "border-transparent"
        }`}
      >
        <span
          className={`text-[12px] truncate ${
            newIngredient.name ? "font-bold text-[#1a1a1a]" : "font-medium text-gray-400"
          }`}
        >
          {newIngredient.name || "Select ingredient from stock..."}
        </span>
        <FiChevronDown
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-orange-500" : ""
          }`}
          size={16}
        />
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          <div ref={popoverRef} className="absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-xl rounded-3xl shadow-[0_16px_48px_rgba(0,0,0,0.18)] border border-gray-100/80 p-3 z-[100] min-w-[280px] flex flex-col animate-in fade-in zoom-in-95 duration-150">
            {/* Search Bar */}
            <div className="px-3.5 py-2 mb-2 bg-gray-50/90 rounded-2xl flex items-center gap-2 border border-gray-200/60 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <FiSearch className="text-gray-400 shrink-0" size={14} />
              <input
                type="text"
                className="w-full bg-transparent border-none outline-none text-[12px] text-[#1a1a1a] placeholder:text-gray-400 font-medium"
                placeholder="Search inventory (or press down arrow)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <FiX size={13} />
                </button>
              )}
            </div>

            {/* Scrollable List */}
            <div
              ref={listRef}
              className="overflow-y-auto overscroll-contain flex-1 flex flex-col gap-1 pr-1.5 max-h-[260px] custom-slim-scroll"
            >
              {filtered.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center">
                  <p className="text-[13px] text-gray-500 font-bold mb-1">No ingredients found</p>
                  <p className="text-[11px] text-gray-400">Try searching a different name</p>
                </div>
              ) : (
                filtered.map((ing, idx) => {
                  const isSelected = newIngredient.name === ing.name;
                  const isKeyboardActive = activeIndex === idx;
                  const isOut = !ing.stock || ing.stock === 0;

                  return (
                    <div
                      key={ing.id}
                      onClick={() => handleSelect(ing)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer select-none ${
                        isSelected
                          ? "bg-linear-to-r from-orange-500 to-amber-500 text-white font-bold shadow-md shadow-orange-500/20"
                          : isKeyboardActive
                          ? "bg-orange-100/70 text-orange-950 font-bold translate-x-0.5"
                          : "hover:bg-orange-50/80 text-[#1a1a1a] font-medium"
                      }`}
                    >
                      <div className="flex flex-col truncate pr-2">
                        <span className="text-[13px] leading-tight truncate">{ing.name}</span>
                        {ing.category && ing.category !== "-" && (
                          <span
                            className={`text-[10px] leading-tight mt-0.5 ${
                              isSelected
                                ? "text-orange-100 font-normal" : isKeyboardActive ? "text-orange-700" : "text-gray-400"
                            }`}
                          >
                            {ing.category}
                          </span>
                        )}
                      </div>

                      {/* Stock Badge */}
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-1 rounded-xl shrink-0 shadow-2xs transition-colors ${
                          isSelected
                            ? "bg-white/25 text-white"
                            : isOut
                            ? "bg-red-50 text-red-600 border border-red-200/80"
                            : isKeyboardActive
                            ? "bg-white text-orange-700 border border-orange-200"
                            : "bg-green-50 text-green-700 border border-green-200/60"
                        }`}
                      >
                        {isOut ? "0 in stock" : `${ing.stock} ${inferIngredientUnit(ing.name, ing.unit)}`}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

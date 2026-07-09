// components/customize/ItemsRow.jsx

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useCustomizeStore } from "../../../store/useCustomizeStore";

const ItemsRow = ({ section, items = [], selectedItems = [], onToggle }) => {
  const scrollRef = useRef(null);
  const { updateItemGrams } = useCustomizeStore();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollAmount = 220;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [items]);

  return (
    <div className="flex items-center gap-3">
      {/* LEFT ARROW */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* SCROLL CONTAINER */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2"
      >
        {items.map((item) => {
          const activeItem = selectedItems?.find((i) => i.id === item.id);
          const active = !!activeItem;

          return (
            <div
              key={item.id}
              onClick={() => onToggle(item)}
              className={`snap-start min-w-[120px] p-2 rounded-xl border cursor-pointer flex flex-col justify-between items-center text-center transition
    ${active ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}
            >
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-400">+{item.price} EGP/g</p>
              </div>
              
              {active && (
                <div 
                  className="mt-2 flex flex-col items-center gap-1" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <label className="text-[10px] text-gray-500 font-semibold uppercase">Grams</label>
                  <input 
                    type="number" 
                    min="1"
                    className="w-16 px-1 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:border-orange-500 bg-white"
                    value={activeItem.grams || ""}
                    onChange={(e) => updateItemGrams(section.slotName, item.id, e.target.value)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT ARROW */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
        >
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
};

export default ItemsRow;

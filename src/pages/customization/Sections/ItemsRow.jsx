// components/customize/ItemsRow.jsx

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

const ItemsRow = ({ items = [], selectedItems = [], onToggle }) => {
  const scrollRef = useRef(null);

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
        className="flex gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory"
      >
        {items.map((item) => {
          const active = selectedItems?.some((i) => i.id === item.id);

          return (
            <div
              key={item.id}
              onClick={() => onToggle(item)}
              className={`snap-start min-w-[100px] p-2 rounded-xl border cursor-pointer text-center transition
    ${active ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}
            >
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-gray-400">+{item.price} EGP</p>
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

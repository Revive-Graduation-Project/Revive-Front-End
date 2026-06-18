import { useState, useRef, useEffect } from "react";
import { FiSliders, FiCheck, FiChevronUp, FiChevronDown } from "react-icons/fi";

/**
 * Dropdown menu for selecting a sort column and direction.
 * @param {Object} props
 * @param {Array<{key: string, label: string}>} [props.columns] - Sortable columns; defaults to an empty array.
 * @param {string} [props.sortKey] - Currently active sort column key.
 * @param {string} props.sortDir - Current sort direction; either "asc" or "desc".
 * @param {(key: string, dir: string) => void} props.onChange - Callback invoked with the selected column key and sort direction when a sort option is selected.
 */
function SortMenu({ columns = [], sortKey, sortDir, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (key) => {
    if (key === sortKey) {
      // Toggle direction on re-click
      onChange(key, sortDir === "asc" ? "desc" : "asc");
    } else {
      onChange(key, "asc");
    }
    setOpen(false);
  };

  const activeLabel = columns.find((c) => c.key === sortKey)?.label ?? "Sort";

  return (
    <div ref={ref} className="relative z-30">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 text-[12px] text-[#1a1a1a] font-bold px-3 py-1.5 cursor-pointer bg-white border border-gray-200 rounded-lg hover:border-orange-400 transition-colors whitespace-nowrap"
      >
        <FiSliders size={13} />
        {sortKey ? activeLabel : "Sort"}
        {sortKey && (
          sortDir === "asc" ? <FiChevronUp size={12} /> : <FiChevronDown size={12} />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 min-w-[170px] overflow-hidden">
          {/* Direction toggle */}
          <div className="flex items-center gap-1 px-3 pb-2 mb-1 border-b border-gray-100">
            <button
              type="button"
              onClick={() => sortKey && onChange(sortKey, "asc")}
              className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold py-1 rounded-lg transition-colors cursor-pointer border-none ${
                sortDir === "asc" ? "bg-orange-50 text-orange-500" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              <FiChevronUp size={12} /> Ascending
            </button>
            <button
              type="button"
              onClick={() => sortKey && onChange(sortKey, "desc")}
              className={`flex-1 flex items-center justify-center gap-1 text-[11px] font-semibold py-1 rounded-lg transition-colors cursor-pointer border-none ${
                sortDir === "desc" ? "bg-orange-50 text-orange-500" : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              <FiChevronDown size={12} /> Descending
            </button>
          </div>

          {/* Column list */}
          {columns.map(({ key, label }) => (
            <button
              type="button"
              key={key}
              onClick={() => handleSelect(key)}
              className={`w-full text-left px-4 py-2.5 text-[12px] font-medium flex items-center justify-between transition-colors cursor-pointer border-none ${
                sortKey === key
                  ? "bg-orange-50 text-orange-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {label}
              {sortKey === key && <FiCheck size={13} className="text-orange-500 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SortMenu;

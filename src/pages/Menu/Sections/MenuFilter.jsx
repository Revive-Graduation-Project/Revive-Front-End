import { useMenuStore } from "../../../store/menuStore";

const categories = ["All", "Starter", "Main", "Side", "Dessert", "Drink"];

const MenuFilter = () => {
  const { selectedCategory, setSelectedCategory } = useMenuStore();

  return (
    <div className="flex items-center gap-1 md:gap-6 pt-40 md:pt-20 pb-10">
      <div className="flex gap-1.5 md:gap-3 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-1 py-.5 md:px-4 md:py-1.5 rounded-full text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer
              ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuFilter;

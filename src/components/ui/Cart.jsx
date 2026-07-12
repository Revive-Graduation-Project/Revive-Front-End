import { FiShoppingCart } from "react-icons/fi";
import { useOrderStore } from "../../store";

function Cart() {
  const openCartDrawer = useOrderStore((state) => state.openCartDrawer);
  const totalItems = useOrderStore((state) => state.totalItems);

  return (
    <div className="relative flex items-center">
      <button
        className="flex items-center justify-center p-2 rounded-full text-2xl md:text-3xl text-green hover:bg-green/10 hover:scale-110 transition-all duration-300 cursor-pointer relative group"
        onClick={openCartDrawer}
        aria-label="Open cart"
      >
        <FiShoppingCart strokeWidth={2.5} className="group-hover:text-green-600 transition-colors" />
        {totalItems > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-orange shadow-sm text-white text-[10px] md:text-xs font-bold rounded-full min-w-[18px] md:min-w-[20px] h-[18px] md:h-[20px] flex items-center justify-center px-1 border-2 border-white">
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
}

export default Cart;

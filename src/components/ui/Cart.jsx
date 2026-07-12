import { FiShoppingCart } from "react-icons/fi";
import { useOrderStore } from "../../store";

function Cart() {
  const openCartDrawer = useOrderStore((state) => state.openCartDrawer);
  const totalItems = useOrderStore((state) => state.totalItems);

  return (
    <div className="relative">
      <button
        className="flex items-center text-3xl text-(--color-green) transition-colors cursor-pointer relative"
        onClick={openCartDrawer}
        aria-label="Open cart"
      >
        <FiShoppingCart />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
    </div>
  );
}

export default Cart;

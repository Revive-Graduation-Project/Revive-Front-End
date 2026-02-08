import { useRef } from "react";
import { FiShoppingCart } from "react-icons/fi";
function Cart() {
  const tooltip = useRef(null);
  return (
    <div className="relative">
      <button
        className="text-2xl text-green-600 hover:text-green-800 cursor-pointer align-middle"
        onClick={() => {
          tooltip.current.classList.toggle("opacity-0");
        }}
      >
        <FiShoppingCart />
      </button>

      <div
        ref={tooltip}
        className="absolute -left-2 top-full bg-white p-4 rounded-lg shadow-md max-w-sm mt-3
      before:content-[''] before:absolute before:-top-2 before:left-4 
      before:border-l-8 before:border-r-8 before:border-b-8
      before:border-l-transparent before:border-r-transparent before:border-b-white opacity-0 transition-opacity duration-300"
      >
        Cart Products will be shown here
      </div>
    </div>
  );
}

export default Cart;

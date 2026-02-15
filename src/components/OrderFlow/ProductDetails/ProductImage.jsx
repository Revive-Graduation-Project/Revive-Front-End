

const ProductImage = ({ product }) => {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-gray-50/50">
      {/* Circular Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-gray-100 rounded-full shadow-lg flex items-center justify-center overflow-hidden">
           {/* Product Image */}
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover z-10 hover:scale-105 transition-transform duration-500"
          />
      </div>
      
      {/* Product Name Below Image */}
      <div className="mt-80 md:mt-[420px] text-center z-10">
        <h2 className="text-2xl pt-10 font-bold text-gray-900 drop-shadow-sm">
          {product.name}
        </h2>
      </div>
    </div>
  );
};

export default ProductImage;

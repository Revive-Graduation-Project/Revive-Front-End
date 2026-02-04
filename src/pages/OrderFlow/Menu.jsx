import { useState } from "react";
import MenuSection from "../../components/OrderFlow/MenuSection";
import ProductDetailsSection from "../../components/OrderFlow/ProductDetailsSection";

export default function Menu() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="menu-page bg-gray-50 min-h-screen pt-24 md:pt-32">
      {selectedProduct ? (
        <ProductDetailsSection 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      ) : (
        <MenuSection onProductClick={setSelectedProduct} />
      )}
    </div>
  );
}

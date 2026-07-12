export const calculateDiscountedPrice = (price, discountPercentage) => {
  if (!price || !discountPercentage || discountPercentage <= 0) return price;
  return (price - (price * discountPercentage) / 100).toFixed(2);
};

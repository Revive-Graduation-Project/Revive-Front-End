import { CURRENCY_SYMBOL, CURRENCY_FORMAT } from "../constants";

/**
 * Formats a numeric value as a currency string based on global settings.
 * Pulls configuration (Symbol and Position) from src/constants.js.
 * 
 * @example
 * formatCurrency(19.9) // "19.90$" (assuming POST format)
 * 
 * @param {number | string} value - The numeric amount to format.
 * @returns {string} The formatted currency string.
 */
export const formatCurrency = (value) => {
  // Ensure we are working with a number and force 2 decimal places
  const amount = Number(value).toFixed(2);
  
  return CURRENCY_FORMAT === "PRE"
    ? `${CURRENCY_SYMBOL} ${amount}`
    : `${amount} ${CURRENCY_SYMBOL}`;
};

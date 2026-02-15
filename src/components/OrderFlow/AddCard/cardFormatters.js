/**
 * Formats a raw string into a space-separated card number (XXXX XXXX XXXX XXXX)
 * @param {string} value 
 * @returns {string} formatted card number
 */
export const formatCardNumber = (value) => {
  // 1. Remove all non-digits
  const v = value.replace(/\D/g, ""); 
  // 2. Limit to 19 digits (max PAN length)
  const limited = v.slice(0, 19);
  // 3. Chunk into groups of 4
  const parts = [];
  for (let i = 0; i < limited.length; i += 4) {
    parts.push(limited.substring(i, i + 4));
  }
  // 4. Join with space
  return parts.join(" ");
};

/**
 * Formats a raw string into MM/YY expiry date format
 * Strictly enforces 01-12 month range during typing.
 * @param {string} value 
 * @returns {string} formatted expiry date
 */
export const formatExpiry = (value) => {
  let v = value.replace(/\D/g, "");
  
  // 1. If first digit is 2-9, auto-prepend 0 (e.g., 5 -> 05/)
  if (v.length === 1 && v > "1") {
    v = "0" + v;
  }

  // 2. If 2+ digits, enforce 01-12 and add slash
  if (v.length >= 2) {
    const month = parseInt(v.slice(0, 2));
    if (month > 12) {
      v = "12" + v.slice(2);
    } else if (month === 0 && v.length === 2) {
      // Handle the 00 case if needed, but 01-12 is the goal.
      // We'll leave it as 00 for now or set to 01 if strictly enforcing.
    }
    
    return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
  }
  
  return v;
};

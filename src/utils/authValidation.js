export const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== "string") return false;

  // 1. Remove common formatting characters (spaces, dashes, parentheses)
  const sanitized = phoneNumber.replace(/[\s\-\(\)]/g, "");

  // 2. Check for an optional '+' followed by 7 to 15 digits (E.164 standard)
  const phoneRegex = /^\+?\d{7,15}$/;

  return phoneRegex.test(sanitized);
};

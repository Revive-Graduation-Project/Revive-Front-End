/**
 * Application-wide constants for the Order Flow and Pricing logic.
 * Centralizing these values ensures consistency and ease of configuration.
 */

// --- Pricing & Limits ---
/** @type {number} Standard delivery fee applied to all orders with items */
export const DELIVERY_FEE = 0.00; //there is no delivery fee for now

/** @type {number} Simulated network delay for order submission (ms) */
export const SUBMIT_DELAY = 2000;

/** @type {number} Maximum number of items allowed per individual product in the cart */
export const MAX_QUANTITY = 99;


// --- Geography & Localization ---
/** @type {Array<{value: string, label: string}>} Available shipping regions */
export const REGIONS = [
  { value: "cairo", label: "Cairo" },
  { value: "giza", label: "Giza" },
  { value: "alexandria", label: "Alexandria" },
];

/** @type {string} Default country for shipping summaries */
export const DEFAULT_COUNTRY = "Egypt";


// --- Currency Configuration ---
/** @type {string} Symbol used for price displays */
export const CURRENCY_SYMBOL = "EGP";

/** 
 * Determines where the currency symbol is placed.
 * 'PRE'  => $199.00
 * 'POST' => 199.00$
 * @type {'PRE' | 'POST'} 
 */
export const CURRENCY_FORMAT = "POST";

// Allergy and health condition options for user profiles
export const HEALTH_CONDITIONS = [
  { value: "DIABETES", label: "Diabetes" },
  { value: "HIGH_BLOOD_PRESSURE", label: "High Blood Pressure" },
  { value: "HIGH_CHOLESTEROL", label: "High Cholesterol" },
  { value: "GLUTEN_INTOLERANCE", label: "Gluten Intolerance" },
  { value: "LACTOSE_INTOLERANCE", label: "Lactose Intolerance" },
  { value: "THYROID_DISORDER", label: "Thyroid Disorder" },
  { value: "KIDNEY_OR_LIVER_CONDITION", label: "Kidney or Liver Condition" },
];

export const GENDER_OPTIONS = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

export const GOAL_OPTIONS = [
  { value: "LOSE_WEIGHT", label: "Lose Weight" },
  { value: "GAIN_WEIGHT", label: "Gain Weight" },
  { value: "MAINTAIN_SHAPE", label: "Maintain Shape" },
  { value: "BUILD_MUSCLE", label: "Build Muscle" },
];
export const HEIGHT_UNITS = ["m", "ft", "cm", "in"];
export const WEIGHT_UNITS = ["kg", "lb"];


export const NON_CANCELLABLE_ORDER_STATUSES = [
  "PREPARING",
  "READY",
  "CANCELED",
];

export const ACTIVE_TRACKING_ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
];
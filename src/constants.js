/**
 * Application-wide constants for the Order Flow and Pricing logic.
 * Centralizing these values ensures consistency and ease of configuration.
 */

// --- Pricing & Limits ---
/** @type {number} Standard delivery fee applied to all orders with items */
export const DELIVERY_FEE = 5.00;

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
export const CURRENCY_SYMBOL = "$";

/** 
 * Determines where the currency symbol is placed.
 * 'PRE'  => $199.00
 * 'POST' => 199.00$
 * @type {'PRE' | 'POST'} 
 */
export const CURRENCY_FORMAT = "POST";

// Allergy and health condition options for user profiles
export const HEALTH_CONDITIONS = [
    "Diabetes",
    "High blood pressure",
    "High cholesterol",
    "Kidney or liver condition",
    "Gluten intolerance / Celiac",
    "Lactose intolerance",
  ];

// --- Health Profile Options ---
export const GENDER_OPTIONS = ["MALE", "FEMALE", "OTHER"];
export const GOAL_OPTIONS = ["LOSE_WEIGHT", "MAINTAIN", "GAIN_MUSCLE"];
export const HEIGHT_UNITS = ["m", "ft", "cm", "in"];
export const WEIGHT_UNITS = ["kg", "lb"];

// --- Order history (profile) ---
export const NON_CANCELLABLE_ORDER_STATUSES = [
  "PREPARING",
  "READY",
];

export const ACTIVE_TRACKING_ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
];
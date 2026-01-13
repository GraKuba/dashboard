/**
 * Application Constants
 * Centralized location for magic numbers and configuration values
 */

// Validation thresholds
export const VALIDATION = {
  // Tolerance for box count discrepancy between total and component sum
  BOX_TOLERANCE_PERCENT: 0.05, // 5%
};

// GHG Emissions calculation factors
export const EMISSIONS = {
  // kg CO2 equivalent per liter of diesel
  DIESEL_KG_CO2_PER_LITER: 2.68,
  // kg CO2 equivalent per dollar of fertilizer (approximation)
  FERTILIZER_KG_CO2_PER_DOLLAR: 1.5,
};

// Water usage conversion factors
export const WATER = {
  // Gallons to liters conversion
  GALLONS_TO_LITERS: 3.78541,
  // Liters to cubic meters
  LITERS_TO_CUBIC_METERS: 0.001,
};

// UI Configuration
export const UI = {
  // Toast notification position
  TOAST_POSITION: "top-right",
  // Animation duration in ms
  ANIMATION_DURATION: 300,
  // Debounce delay for localStorage saves (ms)
  DRAFT_SAVE_DELAY: 500,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  MONTHLY_REPORT_DRAFT: "monthly_report_draft",
};

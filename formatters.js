/**
 * Safely formats a number to a fixed number of digits.
 * @param {number | null | undefined} v The value to format.
 * @param {number} digits The number of digits to show after the decimal.
 * @returns {string} The formatted number or '--' if the value is invalid.
 */
export const formatNum = (v, digits = 2) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "--";
  return Number(v).toFixed(digits);
};

/**
 * Formats a duration in seconds to a MM:SS string.
 * @param {number} seconds The total seconds.
 * @returns {string} The formatted time string.
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

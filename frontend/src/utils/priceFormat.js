/**
 * Formats price values consistently across the application
 * - Displays "Free" when price is 0 or 0.0
 * - Otherwise displays price with ₹ symbol
 *
 * @param {number|string} price - The price value to format
 * @return {string} Formatted price string
 */
export const formatPrice = (price) => {
	// Convert price to number if it's a string
	const numericPrice = typeof price === "string" ? parseFloat(price) : price;

	// Check if price is 0, 0.0, etc.
	if (numericPrice === 0 || Number.isNaN(numericPrice)) {
		return "Free";
	}

	// Return price with rupee symbol
	return `₹${numericPrice}`;
};

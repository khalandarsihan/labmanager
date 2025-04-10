// src/lib/arabic-utils.js

/**
 * Helper functions for Arabic text rendering on mobile devices
 */

/**
 * Properly styles Arabic text for both mobile and desktop
 * This ensures consistent rendering across different devices
 *
 * @param {string} text - The Arabic text to format
 * @param {string} baseClasses - Base Tailwind classes to apply
 * @param {string} mobileClasses - Additional classes for mobile
 * @param {string} desktopClasses - Additional classes for desktop
 * @returns {JSX.Element} - The properly formatted JSX element
 */
export const formatArabicText = (
	text,
	baseClasses = "",
	mobileClasses = "",
	desktopClasses = ""
) => {
	return (
		<span
			className={`font-arabic ${baseClasses} ${mobileClasses} sm:${desktopClasses}`}
			style={{
				direction: "rtl",
				unicodeBidi: "bidi-override",
				wordSpacing: "0.05em",
				letterSpacing: "0.02em",
				textRendering: "optimizeLegibility",
			}}
		>
			{text}
		</span>
	);
};

/**
 * Applies the proper CSS for Arabic paragraphs
 * Helps prevent text overflow issues on mobile
 *
 * @param {string} text - The Arabic paragraph text
 * @param {string} className - Additional Tailwind classes
 * @returns {JSX.Element} - The properly formatted paragraph
 */
export const ArabicParagraph = ({ text, className = "" }) => {
	return (
		<p
			className={`font-arabic ${className} break-words`}
			style={{
				direction: "rtl",
				unicodeBidi: "bidi-override",
				maxWidth: "100%",
				overflowWrap: "break-word",
				wordWrap: "break-word",
				hyphens: "auto",
			}}
		>
			{text}
		</p>
	);
};

export default {
	formatArabicText,
	ArabicParagraph,
};

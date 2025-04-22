import React from 'react';
import { useTheme } from './ThemeContext';

const Footer = () => {
  const { useLightTheme } = useTheme();
  
  const footerBgStyle = useLightTheme
    ? "bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100"
    : "bg-gradient-to-r from-[#1a1f2e]/90 via-[#131720]/90 to-[#1a1f2e]/90";

  const headingStyle = useLightTheme
    ? "text-purple-700"
    : "text-amber-400";

  const textStyle = useLightTheme
    ? "text-gray-800"
    : "text-gray-200";

  const linkHoverStyle = useLightTheme
    ? "hover:text-purple-700"
    : "hover:text-amber-400";

  const socialIconStyle = useLightTheme
    ? "text-purple-700 hover:text-purple-900"
    : "text-amber-400 hover:text-amber-200";

  const copyrightBgStyle = useLightTheme
    ? "bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 hover:from-purple-100 hover:via-purple-200 hover:to-purple-100"
    : "bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444] hover:from-[#222222] hover:via-[#333333] hover:to-amber-100";

  const copyrightTextStyle = useLightTheme
    ? "text-gray-700"
    : "text-gray-200";

  const highlightStyle = useLightTheme
    ? "text-purple-700 hover:text-purple-900"
    : "text-amber-400 hover:text-amber-200";

  return (
    <footer className={`${footerBgStyle} ${textStyle} pt-6 font-sans`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Company Info Section */}
          <div className="transform transition duration-300 hover:scale-105">
            <h3 className={`text-lg font-bold ${headingStyle} mb-3`}>TechEthica</h3>
            <p className={`${textStyle} text-sm mb-3`}>Empowering learning through technology and faith.</p>
            <div className="flex flex-col space-y-2">
              <a href="/about-us" className={`${textStyle} text-sm ${linkHoverStyle} transition-all duration-200 hover:translate-x-1`}>About Us</a>
              <a href="/careers" className={`${textStyle} text-sm ${linkHoverStyle} transition-all duration-200 hover:translate-x-1`}>Careers</a>
              <a href="/privacy" className={`${textStyle} text-sm ${linkHoverStyle} transition-all duration-200 hover:translate-x-1`}>Privacy Policy</a>
            </div>
          </div>

          {/* Resources Section */}
          <div className="transform transition duration-300 hover:scale-105">
            <h4 className={`text-lg font-bold ${headingStyle} mb-3`}>Resources</h4>
            <div className="flex flex-col space-y-2">
              <a href="/courses/catalog" className={`${textStyle} text-sm ${linkHoverStyle} transition-all duration-200 hover:translate-x-1`}>All Courses</a>
              <a href="/blog" className={`${textStyle} text-sm ${linkHoverStyle} transition-all duration-200 hover:translate-x-1`}>Blog</a>
              <a href="/faq" className={`${textStyle} text-sm ${linkHoverStyle} transition-all duration-200 hover:translate-x-1`}>FAQ</a>
              <a href="/support" className={`${textStyle} text-sm ${linkHoverStyle} transition-all duration-200 hover:translate-x-1`}>Student Support</a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="transform transition duration-300 hover:scale-105">
            <h4 className={`text-lg font-bold ${headingStyle} mb-3`}>Contact Us</h4>
            <address className="not-italic text-sm leading-relaxed">
              <p className={textStyle}>#272 TechEthica Islamic Tech Academy,<br />Bidarahalli, Bengaluru, 560049</p>
              <a href="mailto:info@techethica.in" className={`${textStyle} ${linkHoverStyle} transition-colors duration-200 flex items-center gap-2 mt-2`}>
                <i className={`far fa-envelope ${headingStyle} w-4`} /> info@techethica.in
              </a>
              <a href="tel:+919876543210" className={`${textStyle} ${linkHoverStyle} transition-colors duration-200 flex items-center gap-2 mt-2`}>
                <i className={`fas fa-phone ${headingStyle} w-4`} /> +91 90745 91600
              </a>
            </address>
          </div>

          {/* Social Media Section */}
          <div className="transform transition duration-300 hover:scale-105">
            <h4 className={`text-lg font-bold ${headingStyle} mb-3`}>Follow Us</h4>
            <div className="flex gap-3 mt-2">
              <a href="#" className={`${socialIconStyle} text-xl transform transition duration-200 hover:-translate-y-1`}>
                <i className="fab fa-facebook" />
              </a>
              <a href="#" className={`${socialIconStyle} text-xl transform transition duration-200 hover:-translate-y-1`}>
                <i className="fab fa-twitter" />
              </a>
              <a href="#" className={`${socialIconStyle} text-xl transform transition duration-200 hover:-translate-y-1`}>
                <i className="fab fa-instagram" />
              </a>
              <a href="#" className={`${socialIconStyle} text-xl transform transition duration-200 hover:-translate-y-1`}>
                <i className="fab fa-linkedin" />
              </a>
              <a href="#" className={`${socialIconStyle} text-xl transform transition duration-200 hover:-translate-y-1`}>
                <i className="fab fa-youtube" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className={`mt-6 ${copyrightBgStyle} transition-all duration-700`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <p className={`${copyrightTextStyle} text-sm text-center`}>
            Copyright © 2017–{new Date().getFullYear()} - <span className={`${highlightStyle} transition-colors duration-200`}>TechEthica</span> |
            Powered by <span className={`${highlightStyle} transition-colors duration-200`}>TechEthica</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444] text-white pt-6 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Company Info Section */}
          <div className="transform transition duration-300 hover:scale-105">
            <h3 className="text-lg font-bold text-amber-400 mb-3">TechEthica</h3>
            <p className="text-gray-200 text-sm mb-3">Empowering learning through technology and faith.</p>
            <div className="flex flex-col space-y-2">
              <a href="/about" className="text-gray-200 text-sm hover:text-amber-400 transition-all duration-200 hover:translate-x-1">About Us</a>
              <a href="/careers" className="text-gray-200 text-sm hover:text-amber-400 transition-all duration-200 hover:translate-x-1">Careers</a>
              <a href="/privacy" className="text-gray-200 text-sm hover:text-amber-400 transition-all duration-200 hover:translate-x-1">Privacy Policy</a>
            </div>
          </div>

          {/* Resources Section */}
          <div className="transform transition duration-300 hover:scale-105">
            <h4 className="text-lg font-bold text-amber-400 mb-3">Resources</h4>
            <div className="flex flex-col space-y-2">
              <a href="/courses" className="text-gray-200 text-sm hover:text-amber-400 transition-all duration-200 hover:translate-x-1">All Courses</a>
              <a href="/blog" className="text-gray-200 text-sm hover:text-amber-400 transition-all duration-200 hover:translate-x-1">Blog</a>
              <a href="/faq" className="text-gray-200 text-sm hover:text-amber-400 transition-all duration-200 hover:translate-x-1">FAQ</a>
              <a href="/support" className="text-gray-200 text-sm hover:text-amber-400 transition-all duration-200 hover:translate-x-1">Student Support</a>
            </div>
          </div>

          {/* Contact Section */}
          <div className="transform transition duration-300 hover:scale-105">
            <h4 className="text-lg font-bold text-amber-400 mb-3">Contact Us</h4>
            <address className="not-italic text-sm leading-relaxed">
              <p className="text-gray-200">#272 AhluSsunna Online Academy,<br />BSK-3, Bengaluru, 676500</p>
              <a href="mailto:info@techethica.com" className="text-gray-200 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 mt-2">
                <i className="far fa-envelope text-amber-400 w-4" /> info@techethica.com
              </a>
              <a href="tel:+919876543210" className="text-gray-200 hover:text-amber-400 transition-colors duration-200 flex items-center gap-2 mt-2">
                <i className="fas fa-phone text-amber-400 w-4" /> +91 98765 43210
              </a>
            </address>
          </div>

          {/* Social Media Section */}
          <div className="transform transition duration-300 hover:scale-105">
            <h4 className="text-lg font-bold text-amber-400 mb-3">Follow Us</h4>
            <div className="flex gap-3 mt-2">
              <a href="#" className="text-amber-400 text-xl hover:text-amber-200 transform transition duration-200 hover:-translate-y-1">
                <i className="fab fa-facebook" />
              </a>
              <a href="#" className="text-amber-400 text-xl hover:text-amber-200 transform transition duration-200 hover:-translate-y-1">
                <i className="fab fa-twitter" />
              </a>
              <a href="#" className="text-amber-400 text-xl hover:text-amber-200 transform transition duration-200 hover:-translate-y-1">
                <i className="fab fa-instagram" />
              </a>
              <a href="#" className="text-amber-400 text-xl hover:text-amber-200 transform transition duration-200 hover:-translate-y-1">
                <i className="fab fa-linkedin" />
              </a>
              <a href="#" className="text-amber-400 text-xl hover:text-amber-200 transform transition duration-200 hover:-translate-y-1">
                <i className="fab fa-youtube" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-6 bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444] hover:from-[#222222] hover:via-[#333333] hover:to-amber-100 transition-all duration-700">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p className="text-gray-200 text-sm text-center">
            Copyright © 2017–2025 - <span className="text-amber-400 hover:text-amber-200 transition-colors duration-200">TechEthica</span> |
            Powered by <span className="text-amber-400 hover:text-amber-200 transition-colors duration-200">TechEthica</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react';

const ContactBar = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-[#444444] text-gray-200 text-center py-4 px-6 transition-all duration-700 ease-in-out hover:from-[#222222] hover:via-[#333333] hover:to-amber-100 shadow-lg">
      <h1 className="text-4xl sm:text-3xl font-bold tracking-wide text-amber-300 drop-shadow-lg">
        Let's Connect
      </h1>
      <div className="contact-info mt-4 text-lg sm:text-base flex justify-center gap-6 flex-wrap">
        <a
          href="tel:9074591600"
          className="inline-flex items-center text-gray-200 font-semibold transition duration-300 ease-in-out hover:text-amber-300 hover:scale-110 focus:ring-0 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          907-459-1600
        </a>
        <span className="text-gray-400">|</span>
        <a
          href="mailto:khasihan@asoa.com"
          className="inline-flex items-center text-gray-200 font-semibold transition duration-300 ease-in-out hover:text-amber-300 hover:scale-110 focus:ring-0 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          khasihan@asoa.com
        </a>
      </div>
    </div>
  );
};

export default ContactBar;
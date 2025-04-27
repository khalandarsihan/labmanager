import React, { useState } from 'react';
import { useTheme } from '../../../components/ui/ThemeContext';

const NewsletterSignup = () => {
  const { useLightTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Here you would typically make an API call to your backend
    // For now, we'll just simulate a successful submission
    setTimeout(() => {
      setSubmitted(true);
      setError('');
    }, 500);
  };

  return (
    <div className="bg-gradient-to-r from-teal-800 to-green-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-teal-100 mb-8">Subscribe to our newsletter to receive notifications about upcoming events and latest news</p>
          
          {submitted ? (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg max-w-md mx-auto">
              <p className="font-medium">Thank you for subscribing!</p>
              <p className="text-sm mt-1">We'll keep you updated with the latest events and news.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row sm:items-center max-w-md mx-auto gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-800"
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-amber-500 text-gray-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
                >
                  Subscribe
                </button>
              </div>
              
              {error && (
                <p className="text-red-300 text-sm mt-2">{error}</p>
              )}
              
              <p className="text-teal-200 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
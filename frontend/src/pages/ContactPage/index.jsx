import React, { useState, useEffect } from 'react';
import { MapPin, Mail, Phone, Send, Clock } from 'lucide-react';
import { useTheme } from '../../components/ui/ThemeContext';
import BackgroundPattern from '../../components/ui/BackgroundPattern';

const ContactPage = () => {
  const { useLightTheme, themeStyles } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [contactInfo, setContactInfo] = useState({
    address: "Bidarahalli, Bengaluru, KA, India",
    email: "info@techethica.in",
    phone: "+91 95913 82400",
    office_hours: "Monday - Friday: 9AM - 5PM",
    about: "TechEthica is a pioneering research laboratory dedicated to exploring the intersection of Sunnah and Science."
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState({ text: '', isError: false });

  // Fetch contact information on component mount
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/method/labmanager.api.api.get_contact_info');
        
        if (!response.ok) {
          throw new Error('Failed to fetch contact info');
        }
        
        const data = await response.json();
        
        if (data.message) {
          setContactInfo(data.message);
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
        // Using default values from state initialization if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ text: '', isError: false });
    
    try {
      // Use our custom API endpoint
      const response = await fetch('/api/method/labmanager.api.api.save_contact_message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Frappe-CSRF-Token': window.frappe?.csrf_token || ''
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit message');
      }

      const data = await response.json();
      const result = data.message || {};
      
      if (result.success === false) {
        throw new Error(result.message || 'Failed to submit message');
      }

      setSubmitMessage({ 
        text: result.message || 'Your message has been sent successfully! We will get back to you soon.',
        isError: false 
      });
      
      // Clear form on success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitMessage({ 
        text: error.message || 'There was an error sending your message. Please try again later.',
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen ${themeStyles.text.primary}`}>
      {/* Background Pattern */}
      <BackgroundPattern />
      
      {/* Enhanced Hero Section with gradients and patterns */}
      <div className="relative overflow-hidden">
        {/* Base gradient background */}
        <div className={`absolute inset-0 ${
          useLightTheme 
            ? 'bg-gradient-to-br from-green-500 to-green-700' 
            : 'bg-gradient-to-br from-green-600 to-green-900'
        }`}></div>
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="small-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
              <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="url(#small-grid)"/>
                <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Light beam effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        
        {/* Content */}
        <div className="relative z-10 text-white py-16">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Get in Touch</h1>
            <p className="text-xl max-w-3xl mx-auto text-center text-white">
              We'd love to hear from you. Reach out to TechEthica for inquiries, collaborations, or just to say hello.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className={`${themeStyles.card.bg} ${themeStyles.card.border} rounded-lg shadow-md p-6 mb-6 border`}>
              <h2 className={`text-2xl font-semibold ${themeStyles.subheading} mb-6`}>Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={`${useLightTheme ? 'bg-purple-100' : 'bg-amber-900/30'} p-3 rounded-full mr-4`}>
                    <MapPin className={`h-6 w-6 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${themeStyles.text.primary}`}>Location</h3>
                    <p className={`${themeStyles.text.light} mt-1`}>{contactInfo.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`${useLightTheme ? 'bg-purple-100' : 'bg-amber-900/30'} p-3 rounded-full mr-4`}>
                    <Mail className={`h-6 w-6 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${themeStyles.text.primary}`}>Email</h3>
                    <a 
                      href={`mailto:${contactInfo.email}`} 
                      className={`${useLightTheme ? 'text-purple-600 hover:text-purple-700' : 'text-amber-400 hover:text-amber-300'} mt-1 block`}
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`${useLightTheme ? 'bg-purple-100' : 'bg-amber-900/30'} p-3 rounded-full mr-4`}>
                    <Phone className={`h-6 w-6 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${themeStyles.text.primary}`}>Phone</h3>
                    <a 
                      href={`tel:${contactInfo.phone}`} 
                      className={`${useLightTheme ? 'text-purple-600 hover:text-purple-700' : 'text-amber-400 hover:text-amber-300'} mt-1 block`}
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`${useLightTheme ? 'bg-purple-100' : 'bg-amber-900/30'} p-3 rounded-full mr-4`}>
                    <Clock className={`h-6 w-6 ${useLightTheme ? 'text-purple-600' : 'text-amber-400'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${themeStyles.text.primary}`}>Office Hours</h3>
                    <p className={`${themeStyles.text.light} mt-1`}>{contactInfo.office_hours}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`${themeStyles.card.bg} ${themeStyles.card.border} rounded-lg shadow-md p-6 border`}>
              <h2 className={`text-2xl font-semibold ${themeStyles.subheading} mb-4`}>About Us</h2>
              <p className={`${themeStyles.text.secondary} mb-4`}>
                {contactInfo.about}
              </p>
              <div className="flex items-center space-x-2">
                <span className={`font-medium ${themeStyles.text.primary}`}>Visit our website:</span>
                <a 
                  href="https://www.techethica.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`${useLightTheme ? 'text-purple-600 hover:text-purple-700' : 'text-amber-400 hover:text-amber-300'}`}
                >
                  www.techethica.in
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            {/* <div className={`${themeStyles.card.bg} ${themeStyles.card.border} rounded-lg shadow-md p-6 border`}> */}
            <div className={`${themeStyles.card.bg} ${themeStyles.card.border} rounded-lg shadow-md p-6 border min-h-[600px]`}>
              <h2 className={`text-2xl font-semibold ${themeStyles.subheading} mb-6`}>Send Us a Message</h2>
              
              {submitMessage.text && (
                <div className={`p-4 mb-6 rounded-md ${
                  submitMessage.isError 
                    ? useLightTheme ? 'bg-red-50 text-red-700' : 'bg-red-900/30 text-red-300' 
                    : useLightTheme ? 'bg-green-50 text-green-700' : 'bg-green-900/30 text-green-300'
                }`}>
                  {submitMessage.text}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className={`block ${themeStyles.text.secondary} font-medium mb-2`}>
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 ${useLightTheme ? 'border-gray-300 focus:ring-purple-500' : 'border-gray-600 bg-gray-700/50 text-white focus:ring-amber-400'} rounded-md focus:outline-none focus:ring-2 border`}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className={`block ${themeStyles.text.secondary} font-medium mb-2`}>
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 ${useLightTheme ? 'border-gray-300 focus:ring-purple-500' : 'border-gray-600 bg-gray-700/50 text-white focus:ring-amber-400'} rounded-md focus:outline-none focus:ring-2 border`}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-7">
                  <label htmlFor="subject" className={`block ${themeStyles.text.secondary} font-medium mb-2`}>
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 ${useLightTheme ? 'border-gray-300 focus:ring-purple-500' : 'border-gray-600 bg-gray-700/50 text-white focus:ring-amber-400'} rounded-md focus:outline-none focus:ring-2 border`}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className={`block ${themeStyles.text.secondary} font-medium mb-2`}>
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="8"
                    className={`w-full px-4 py-2 ${useLightTheme ? 'border-gray-300 focus:ring-purple-500' : 'border-gray-600 bg-gray-700/50 text-white focus:ring-amber-400'} rounded-md focus:outline-none focus:ring-2 border`}
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-flex items-center ${
                    useLightTheme 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-amber-600 hover:bg-amber-500'
                  } text-white font-medium py-2 px-6 rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 ${useLightTheme ? 'focus:ring-purple-500' : 'focus:ring-amber-500'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
        
        {/* Map Section */}

<div className="mt-12">
  <div className={`${themeStyles.card.bg} ${themeStyles.card.border} rounded-lg shadow-md p-4 border`}>
    <div className="overflow-hidden rounded-md h-64">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.6810839214486!2d77.7145663!3d13.055960500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae11348aaf9813%3A0xa6be079ccf160503!2sTechEthica%20%7C%20Sunnah%20%26%20Science%20Research%20Labs!5e0!3m2!1sen!2sin!4v1772536779686!5m2!1sen!2sin" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen="" 
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="TechEthica Location"
      ></iframe>
    </div>
  </div>
</div>
        

      </div>
    </div>
  );
};

export default ContactPage;
import React from 'react';
import Navbar from './ui/Navbar';
import ContactBar from './ui/ContactBar';
import Footer from './ui/Footer';

const AppWrapper = ({ children }) => {
  return (
    <>
      <ContactBar />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default AppWrapper;
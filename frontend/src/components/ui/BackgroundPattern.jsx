import React from 'react';
import { useTheme } from './ThemeContext';

const BackgroundPattern = () => {
  const { useLightTheme } = useTheme();
  
  // Define colors based on theme
  const bgGradient = useLightTheme
    ? "bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50"
    : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700";
    
  const lineColor = useLightTheme 
    ? "bg-purple-500" // Darker purple for better visibility
    : "bg-amber-300";
    
  const borderColor = useLightTheme 
    ? "border-purple-600" // Darker purple for better visibility
    : "border-amber-300";
    
  // Different opacity for different themes
  const linesOpacity = useLightTheme ? "opacity-30" : "opacity-10";
  const elementsOpacity = useLightTheme ? "/60" : "/20"; // For the fractional opacities in tailwind

  return (
    <>
      {/* Full page background gradient */}
      <div className={`fixed inset-0 -z-10 ${bgGradient} pointer-events-none`}></div>
      
      {/* Abstract Lines - with adjusted opacity for light theme */}
      <div className={`fixed inset-0 -z-5 ${linesOpacity} pointer-events-none`}>
        <div className={`absolute h-full w-px ${lineColor}/70 left-1/4 transform -skew-x-12`} style={{zIndex: '0 !important'}} />
        <div className={`absolute h-full w-px ${lineColor}/60 left-1/2 transform skew-x-12`} style={{zIndex: '0 !important'}} />
        <div className={`absolute h-full w-px ${lineColor}/70 left-3/4 transform -skew-x-12`} style={{zIndex: '0 !important'}} />
        <div className={`absolute w-full h-px ${lineColor}/60 top-1/4 transform -skew-y-12`} style={{zIndex: '0 !important'}} />
        <div className={`absolute w-full h-px ${lineColor}/70 top-1/2 transform skew-y-12`} style={{zIndex: '0 !important'}} />
        <div className={`absolute w-full h-px ${lineColor}/60 top-3/4 transform -skew-y-12`} style={{zIndex: '0 !important'}} />
      </div>
      
      {/* Floating Elements - with adjusted opacity and color intensity for light theme */}
      <div className="fixed inset-0 -z-5 overflow-visible pointer-events-none">
        {/* Top Group */}
        <div className={`absolute top-20 left-1/3 w-14 h-14 border-2 ${borderColor}${elementsOpacity} rounded-lg backdrop-blur-sm transform rotate-45 animate-float-diagonal delay-300`} style={{zIndex: '0 !important'}} />
        <div className={`absolute top-24 right-1/3 w-10 h-10 border-2 ${borderColor}${elementsOpacity} transform -rotate-12 backdrop-blur-sm animate-float-up delay-700`} style={{zIndex: '0 !important'}} />
        
        {/* Left Side Elements */}
        <div className={`absolute top-1/2 left-20 w-16 h-16 border-2 ${borderColor}${elementsOpacity} rounded-full backdrop-blur-sm animate-float-circle delay-1000`} style={{zIndex: '0 !important'}} />
        <div className={`absolute bottom-1/3 left-1/4 w-12 h-12 border-2 ${borderColor}${elementsOpacity} transform rotate-12 backdrop-blur-sm animate-float-diagonal-reverse delay-500`} style={{zIndex: '0 !important'}} />
        
        {/* Right Side Elements */}
        <div className={`absolute top-1/2 right-20 w-12 h-12 border-2 ${borderColor}${elementsOpacity} rounded-lg transform rotate-45 backdrop-blur-sm animate-float-up-slow delay-200`} style={{zIndex: '0 !important'}} />
        <div className={`absolute bottom-1/3 right-1/4 w-14 h-14 border-2 ${borderColor}${elementsOpacity} rounded-full backdrop-blur-sm animate-float-side delay-900`} style={{zIndex: '0 !important'}} />
        
        {/* Additional Elements */}
        <div className={`absolute top-2/3 right-24 w-10 h-10 border-2 ${borderColor}${elementsOpacity} transform rotate-30 backdrop-blur-sm animate-float-diagonal delay-600`} style={{zIndex: '0 !important'}} />
        <div className={`absolute bottom-1/4 right-20 w-8 h-8 border-2 ${borderColor}${elementsOpacity} rounded-lg backdrop-blur-sm animate-float-circle delay-800`} style={{zIndex: '0 !important'}} />
      </div>
    </>
  );
};

export default BackgroundPattern;
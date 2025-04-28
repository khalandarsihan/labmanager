import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../../components/ui/ThemeContext';

const EventGallery = ({ gallery, currentImageIndex = 0, setCurrentImageIndex, galleryRef }) => {
  const { useLightTheme, themeStyles } = useTheme();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoSlideTimerRef = useRef(null);

  // Open image modal
  const openModal = (image) => {
    setSelectedImage(image);
    setIsPaused(true); // Pause auto-sliding when modal is open
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close image modal
  const closeModal = () => {
    setSelectedImage(null);
    setIsPaused(false); // Resume auto-sliding when modal is closed
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Navigate images
  const handlePrevImage = () => {
    if (!gallery || gallery.length === 0) return;
    setCurrentImageIndex(prev => (prev === 0 ? gallery.length - 1 : prev - 1));
  };
  
  const handleNextImage = () => {
    if (!gallery || gallery.length === 0) return;
    setCurrentImageIndex(prev => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  // Auto slide timer setup
  useEffect(() => {
    // Only setup the timer if we have multiple images and not paused
    if (gallery && gallery.length > 1 && !isPaused) {
      autoSlideTimerRef.current = setInterval(() => {
        handleNextImage();
      }, 3000); // Change slide every 5 seconds
    }

    // Cleanup function
    return () => {
      if (autoSlideTimerRef.current) {
        clearInterval(autoSlideTimerRef.current);
      }
    };
  }, [gallery, isPaused, currentImageIndex]); // Reset timer when these dependencies change

  // Pause auto-sliding when hovering over the gallery
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (!selectedImage) { // Only resume if modal is closed
      setIsPaused(false);
    }
  };

  // Scroll gallery to thumbnail
  useEffect(() => {
    if (gallery && gallery.length > 0 && galleryRef && galleryRef.current) {
      const thumbnailWidth = 100; // Approximate width + margins
      galleryRef.current.scrollLeft = currentImageIndex * thumbnailWidth - (galleryRef.current.clientWidth / 2) + (thumbnailWidth / 2);
    }
  }, [currentImageIndex, gallery, galleryRef]);

  if (!gallery || gallery.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Main image display with navigation */}
      <div 
        className="relative rounded-lg overflow-hidden mb-4" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="w-full relative" style={{ height: "500px" }}> {/* Fixed height container */}
          <img 
            src={gallery[currentImageIndex]?.image || '/api/placeholder/800/500'} 
            alt={gallery[currentImageIndex]?.caption || `Gallery image`}
            className="w-full h-full object-contain" // Changed from object-cover to object-contain
          />
          
          {/* Progress indicator for auto-sliding */}
          {gallery.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
              {gallery.map((_, index) => (
                <div 
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full cursor-pointer transition-all ${
                    currentImageIndex === index 
                      ? `w-8 ${useLightTheme ? 'bg-purple-500' : 'bg-amber-500'}`
                      : 'w-2 bg-white/60 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        
        {gallery.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
        
        {gallery[currentImageIndex]?.caption && (
          <div className="absolute inset-x-0 bottom-0 bg-gray-900/70 text-white p-3">
            {gallery[currentImageIndex].caption}
          </div>
        )}
      </div>
      
      {/* Thumbnails */}
      {gallery.length > 1 && (
        <div 
          ref={galleryRef}
          className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {gallery.map((item, index) => (
            <div 
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 cursor-pointer relative ${
                currentImageIndex === index 
                  ? useLightTheme ? 'ring-2 ring-purple-500' : 'ring-2 ring-amber-500'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="w-24 h-16 overflow-hidden rounded">
                <img 
                  src={item.image || '/api/placeholder/100/100'} 
                  alt={item.caption || `Thumbnail ${index + 1}`}
                  className="w-full h-full object-contain" // Changed from object-cover to object-contain
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={closeModal}>
          <div className="relative max-w-4xl max-h-full p-4">
            <button 
              className="absolute -top-2 -right-2 p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                closeModal();
              }}
            >
              <X size={20} />
            </button>
            <img 
              src={selectedImage.image} 
              alt={selectedImage.caption || "Gallery image"} 
              className="max-w-full max-h-[80vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {selectedImage.caption && (
              <div className="bg-white/80 backdrop-blur-sm p-3 text-center mt-2 text-gray-800 rounded">
                {selectedImage.caption}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventGallery;
import React, { useState } from 'react';
import { X } from 'lucide-react';

const EventGallery = ({ gallery }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Open image modal
  const openModal = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Close image modal
  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {gallery.map((item, index) => (
          <div 
            key={index} 
            className="relative rounded-lg overflow-hidden group cursor-pointer"
            onClick={() => openModal(item)}
          >
            <img 
              src={item.image} 
              alt={item.caption || `Gallery image ${index + 1}`}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {item.caption && (
              <div className="absolute inset-x-0 bottom-0 bg-gray-900/70 text-white p-2 text-sm">
                {item.caption}
              </div>
            )}
          </div>
        ))}
      </div>

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
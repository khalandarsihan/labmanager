import React from 'react';
import { Share2 } from 'lucide-react';

const ShareThisEvent = ({ eventId, eventTitle }) => {
  // Prepare share content
  const title = encodeURIComponent(eventTitle || 'Event');
  const url = encodeURIComponent(window.location.href);
  
  // Handle share click
  const handleShare = (platform) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${title}%20-%20${url}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${title}&body=Check out this event: ${url}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct sharing URL like other platforms
        // Usually shared via Stories or copying the link
        alert('To share on Instagram, please copy the URL and share it manually in the Instagram app.');
        navigator.clipboard.writeText(decodeURIComponent(url));
        return;
      default:
        return;
    }
    
    // Open share URL in a new window
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mb-6">
      <h2 className="flex items-center text-lg font-medium mb-3">
        <Share2 size={18} className="mr-2" />
        Share This Event
      </h2>
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => handleShare('facebook')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          aria-label="Share on Facebook"
        >
          Facebook
        </button>
        
        <button 
          onClick={() => handleShare('twitter')}
          className="px-4 py-2 bg-sky-500 text-white rounded-md hover:bg-sky-600 transition-colors"
          aria-label="Share on Twitter"
        >
          Twitter
        </button>
        
        <button 
          onClick={() => handleShare('whatsapp')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          aria-label="Share on WhatsApp"
        >
          WhatsApp
        </button>
        
        <button 
          onClick={() => handleShare('email')}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          aria-label="Share via Email"
        >
          Email
        </button>
        
        {/* Instagram Button - Uncomment if needed */}
{/*         
        <button 
          onClick={() => handleShare('instagram')}
          className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
          aria-label="Share on Instagram"
        >
          Instagram
        </button>
        */}
      </div>
    </div>
  );
};

export default ShareThisEvent;
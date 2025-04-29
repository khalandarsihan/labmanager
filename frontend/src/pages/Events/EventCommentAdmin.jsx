// New component: frontend/src/pages/Events/components/EventCommentAdmin.jsx

import React, { useState, useEffect } from 'react';
import { Check, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { useTheme } from '../../../components/ui/ThemeContext';

const EventCommentAdmin = ({ eventId }) => {
  const { useLightTheme, themeStyles } = useTheme();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionStatus, setActionStatus] = useState({ id: null, message: '', type: '' });

  // Fetch all comments including pending ones
  const fetchComments = async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/method/labmanager.api.events.get_event_comments?event_id=${eventId}&include_pending=1`);
      const data = await response.json();
      
      if (data.message && data.message.status === 'success') {
        setComments(data.message.comments || []);
      } else {
        setError(data.message?.message || 'Failed to load comments');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Error fetching comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [eventId]);

  // Update comment status
  const updateCommentStatus = async (commentId, status) => {
    try {
      setActionStatus({ id: commentId, message: 'Processing...', type: 'info' });
      
      const response = await fetch('/api/method/labmanager.api.events.update_comment_status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment_id: commentId,
          status: status
        }),
      });
      
      const data = await response.json();
      
      if (data.message && data.message.status === 'success') {
        setActionStatus({ 
          id: commentId, 
          message: `Comment ${status.toLowerCase()} successfully`, 
          type: 'success' 
        });
        
        // Update local state
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.name === commentId 
              ? { ...comment, status: status } 
              : comment
          )
        );
        
        // Clear message after 3 seconds
        setTimeout(() => {
          setActionStatus({ id: null, message: '', type: '' });
        }, 3000);
      } else {
        setActionStatus({ 
          id: commentId, 
          message: data.message?.message || `Failed to ${status.toLowerCase()} comment`, 
          type: 'error' 
        });
      }
    } catch (err) {
      console.error(`Error ${status.toLowerCase()}ing comment:`, err);
      setActionStatus({ 
        id: commentId, 
        message: `Error ${status.toLowerCase()}ing comment`, 
        type: 'error' 
      });
    }
  };

  // Group comments by status
  const pendingComments = comments.filter(comment => comment.status === 'Pending');
  const approvedComments = comments.filter(comment => comment.status === 'Approved');
  const rejectedComments = comments.filter(comment => comment.status === 'Rejected');

  if (!eventId) {
    return null;
  }

  return (
    <div className={`${themeStyles.card.bg} rounded-lg shadow-md p-6 mb-8 ${themeStyles.card.border} border`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold ${themeStyles.subheading}`}>
          Manage Comments
        </h2>
        <button 
          onClick={fetchComments}
          className={`p-2 rounded-full ${
            useLightTheme 
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
          }`}
          title="Refresh comments"
        >
          <RefreshCw size={18} />
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
            useLightTheme ? 'border-teal-600' : 'border-amber-500'
          } mx-auto`}></div>
          <p className={`mt-4 ${themeStyles.text.secondary}`}>Loading comments...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <AlertTriangle size={48} className={`mx-auto mb-4 ${
            
            useLightTheme ? 'text-red-500' : 'text-red-400'
          }`} />
          <p className={`text-lg font-medium mb-2 ${themeStyles.text.primary}`}>Error Loading Comments</p>
          <p className={themeStyles.text.secondary}>{error}</p>
          <button
            onClick={fetchComments}
            className={`mt-4 px-4 py-2 ${
              useLightTheme 
                ? 'bg-teal-600 hover:bg-teal-700' 
                : 'bg-amber-600 hover:bg-amber-500'
            } text-white rounded-md transition-colors`}
          >
            Try Again
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8">
          <p className={themeStyles.text.secondary}>No comments found for this event.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pending Comments Section */}
          {pendingComments.length > 0 && (
            <div>
              <h3 className={`text-lg font-medium mb-3 ${useLightTheme ? 'text-amber-600' : 'text-amber-400'} border-b pb-2`}>
                Pending Review ({pendingComments.length})
              </h3>
              <div className="space-y-4">
                {pendingComments.map(comment => (
                  <div 
                    key={comment.name} 
                    className={`p-4 rounded-lg ${
                      useLightTheme 
                        ? 'bg-amber-50 border border-amber-100' 
                        : 'bg-amber-900/20 border border-amber-800/30'
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className={`font-medium ${themeStyles.text.primary}`}>{comment.name1}</span>
                        <span className={`text-sm ml-2 ${themeStyles.text.light}`}>{comment.email}</span>
                      </div>
                      <span className={`text-sm ${themeStyles.text.light}`}>
                        {new Date(comment.comment_date).toLocaleString()}
                      </span>
                    </div>
                    <p className={`mb-4 ${themeStyles.text.secondary}`}>{comment.comment}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => updateCommentStatus(comment.name, 'Approved')}
                          className={`px-3 py-1 rounded-md flex items-center ${
                            useLightTheme 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-green-600 hover:bg-green-500'
                          } text-white`}
                          disabled={actionStatus.id === comment.name}
                        >
                          <Check size={16} className="mr-1" />
                          Approve
                        </button>
                        <button 
                          onClick={() => updateCommentStatus(comment.name, 'Rejected')}
                          className={`px-3 py-1 rounded-md flex items-center ${
                            useLightTheme 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-red-600 hover:bg-red-500'
                          } text-white`}
                          disabled={actionStatus.id === comment.name}
                        >
                          <X size={16} className="mr-1" />
                          Reject
                        </button>
                      </div>
                      
                      {actionStatus.id === comment.name && (
                        <span className={`text-sm ${
                          actionStatus.type === 'success' 
                            ? useLightTheme ? 'text-green-600' : 'text-green-400'
                            : actionStatus.type === 'error'
                              ? useLightTheme ? 'text-red-600' : 'text-red-400'
                              : themeStyles.text.secondary
                        }`}>
                          {actionStatus.message}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Approved Comments Section */}
          {approvedComments.length > 0 && (
            <div>
              <h3 className={`text-lg font-medium mb-3 ${useLightTheme ? 'text-green-600' : 'text-green-400'} border-b pb-2`}>
                Approved ({approvedComments.length})
              </h3>
              <div className="space-y-4">
                {approvedComments.map(comment => (
                  <div 
                    key={comment.name} 
                    className={`p-4 rounded-lg ${
                      useLightTheme 
                        ? 'bg-green-50 border border-green-100' 
                        : 'bg-green-900/20 border border-green-800/30'
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className={`font-medium ${themeStyles.text.primary}`}>{comment.name1}</span>
                        <span className={`text-sm ml-2 ${themeStyles.text.light}`}>{comment.email}</span>
                      </div>
                      <span className={`text-sm ${themeStyles.text.light}`}>
                        {new Date(comment.comment_date).toLocaleString()}
                      </span>
                    </div>
                    <p className={`mb-4 ${themeStyles.text.secondary}`}>{comment.comment}</p>
                    
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => updateCommentStatus(comment.name, 'Rejected')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          useLightTheme 
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        }`}
                      >
                        Change to Rejected
                      </button>
                      
                      {actionStatus.id === comment.name && (
                        <span className={`text-sm ${
                          actionStatus.type === 'success' 
                            ? useLightTheme ? 'text-green-600' : 'text-green-400'
                            : actionStatus.type === 'error'
                              ? useLightTheme ? 'text-red-600' : 'text-red-400'
                              : themeStyles.text.secondary
                        }`}>
                          {actionStatus.message}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Rejected Comments Section */}
          {rejectedComments.length > 0 && (
            <div>
              <h3 className={`text-lg font-medium mb-3 ${useLightTheme ? 'text-red-600' : 'text-red-400'} border-b pb-2`}>
                Rejected ({rejectedComments.length})
              </h3>
              <div className="space-y-4">
                {rejectedComments.map(comment => (
                  <div 
                    key={comment.name} 
                    className={`p-4 rounded-lg ${
                      useLightTheme 
                        ? 'bg-red-50 border border-red-100' 
                        : 'bg-red-900/20 border border-red-800/30'
                    }`}
                  >
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className={`font-medium ${themeStyles.text.primary}`}>{comment.name1}</span>
                        <span className={`text-sm ml-2 ${themeStyles.text.light}`}>{comment.email}</span>
                      </div>
                      <span className={`text-sm ${themeStyles.text.light}`}>
                        {new Date(comment.comment_date).toLocaleString()}
                      </span>
                    </div>
                    <p className={`mb-4 ${themeStyles.text.secondary}`}>{comment.comment}</p>
                    
                    <div className="flex items-center justify-between">
                      <button 
                        onClick={() => updateCommentStatus(comment.name, 'Approved')}
                        className={`px-3 py-1 rounded-md text-sm ${
                          useLightTheme 
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' 
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        }`}
                      >
                        Change to Approved
                      </button>
                      
                      {actionStatus.id === comment.name && (
                        <span className={`text-sm ${
                          actionStatus.type === 'success' 
                            ? useLightTheme ? 'text-green-600' : 'text-green-400'
                            : actionStatus.type === 'error'
                              ? useLightTheme ? 'text-red-600' : 'text-red-400'
                              : themeStyles.text.secondary
                        }`}>
                          {actionStatus.message}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCommentAdmin;
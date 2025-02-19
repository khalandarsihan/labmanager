// src/pages/StudentDashboard/components/Notifications.jsx
import React, { useState } from 'react';

export const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'deadline',
      title: 'Science Project Due Soon',
      message: 'Your Plant Cell Diagram is due in 2 days',
      date: '02/21/2025',
      isRead: false
    },
    {
      id: 2,
      type: 'announcement',
      title: 'Parent-Teacher Conference',
      message: 'Don\'t forget to remind your parents about the upcoming conferences',
      date: '03/05/2025',
      isRead: false
    },
    {
      id: 3,
      type: 'achievement',
      title: 'Perfect Score!',
      message: 'Congratulations on your perfect score in the recent English quiz',
      date: '02/15/2025',
      isRead: true
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? {...notification, isRead: true} : notification
    ));
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'deadline': return '⏰';
      case 'announcement': return '📢';
      case 'achievement': return '🏆';
      default: return '📌';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Notifications & Reminders</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {notifications.filter(n => !n.isRead).length} new
        </span>
      </div>
      
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No notifications at this time</p>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`p-3 rounded-lg border-l-4 ${
                notification.isRead 
                  ? 'bg-gray-50 border-gray-300' 
                  : 'bg-blue-50 border-blue-500'
              }`}
            >
              <div className="flex">
                <span className="text-2xl mr-3 mt-1">{getIconForType(notification.type)}</span>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-medium text-gray-800">{notification.title}</h4>
                    <span className="text-xs text-gray-500">{notification.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  {!notification.isRead && (
                    <button 
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-blue-600 mt-2 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <button className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800 flex justify-center items-center">
        View all notifications
        <span className="ml-1">→</span>
      </button>
    </div>
  );
};
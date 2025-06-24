import React, { useState, useEffect } from 'react';

const Notification = ({ message, type = 'info', duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        {message}
      </div>
      <button className="notification-close" onClick={() => {
        setVisible(false);
        if (onClose) onClose();
      }}>
        &times;
      </button>
    </div>
  );
};

export default Notification;

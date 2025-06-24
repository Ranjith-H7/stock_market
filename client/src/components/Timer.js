import React from 'react';

const Timer = ({ seconds }) => {
  // Format seconds into MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <span className="timer-label">Next Update:</span>
      <span className="timer-value">{formatTime(seconds)}</span>
    </div>
  );
};

export default Timer;

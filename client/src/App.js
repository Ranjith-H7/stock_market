import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import io from 'socket.io-client';

// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import UserSelector from './pages/UserSelector';
import PortfolioDetails from './pages/PortfolioDetails';
import Timer from './components/Timer';
import Notification from './components/Notification';

// API and context
import { UsersProvider } from './context/UsersContext';
import { PortfoliosProvider } from './context/PortfoliosContext';
import { AssetsProvider } from './context/AssetsContext';

function App() {
  const [socket, setSocket] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(600); // 10 minutes in seconds
  const [notification, setNotification] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_URL || '');
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });
    
    newSocket.on('priceUpdate', (data) => {
      console.log('Price update received:', data);
      // Reset the timer to 10 minutes (600 seconds)
      setNextUpdate(600);
      
      // Show notification
      setNotification({
        message: `Prices updated at ${new Date().toLocaleTimeString()}`,
        type: 'success'
      });
    });
    
    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
    
    setSocket(socket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);
  
  // Subscribe to updates for the selected user
  useEffect(() => {
    if (socket && selectedUser) {
      socket.emit('subscribe', selectedUser._id);
    }
  }, [socket, selectedUser]);
  
  // Timer effect
  useEffect(() => {
    if (nextUpdate <= 0) return;
    
    const timer = setInterval(() => {
      setNextUpdate(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [nextUpdate]);

  return (
    <Router>
      <UsersProvider>
        <PortfoliosProvider>
          <AssetsProvider>
            <div className="app">
              <Navbar />
              {/* Timer display in top-right corner */}
              <Timer seconds={nextUpdate} />
              
              {/* Notification component */}
              {notification && (
                <Notification 
                  message={notification.message}
                  type={notification.type}
                  onClose={() => setNotification(null)}
                />
              )}
              
              <Routes>
                <Route 
                  path="/" 
                  element={selectedUser ? <Navigate to="/dashboard" /> : <UserSelector onUserSelect={setSelectedUser} />} 
                />
                <Route 
                  path="/dashboard" 
                  element={selectedUser ? <Dashboard userId={selectedUser._id} /> : <Navigate to="/" />} 
                />
                <Route 
                  path="/portfolio/:portfolioId" 
                  element={selectedUser ? <PortfolioDetails /> : <Navigate to="/" />} 
                />
              </Routes>
            </div>
          </AssetsProvider>
        </PortfoliosProvider>
      </UsersProvider>
    </Router>
  );
}

export default App;

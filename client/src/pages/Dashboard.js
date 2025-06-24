import React, { useContext, useEffect, useState } from 'react';
import { PortfoliosContext } from '../context/PortfoliosContext';
import { AssetsContext } from '../context/AssetsContext';
import PortfolioCard from '../components/PortfolioCard';
import io from 'socket.io-client';

const Dashboard = ({ userId }) => {
  const { portfolios, loading, error, fetchUserPortfolios, updatePortfolioValues } = useContext(PortfoliosContext);
  const { assets } = useContext(AssetsContext);
  const [socket, setSocket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [assetFilter, setAssetFilter] = useState('all');

  // Fetch user portfolios when component mounts
  useEffect(() => {
    if (userId) {
      fetchUserPortfolios(userId);
    }
  }, [userId, fetchUserPortfolios]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5001');
    
    newSocket.on('connect', () => {
      console.log('Connected to server from dashboard');
      
      // Subscribe to updates for this user
      if (userId) {
        newSocket.emit('subscribe', userId);
      }
    });
    
    newSocket.on('portfolioUpdate', (data) => {
      console.log('Portfolio update received:', data);
      updatePortfolioValues(data);
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, [userId, updatePortfolioValues]);

  if (loading) {
    return (
      <div className="container">
        <h1 className="page-title">Loading portfolios...</h1>
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  // Filter portfolios based on search term and asset filter
  const filteredPortfolios = portfolios.filter(portfolio => {
    // Search term filter (portfolio name)
    const nameMatch = portfolio.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Asset filter
    if (assetFilter === 'all') return nameMatch;
    
    if (assetFilter === 'stocks') {
      return nameMatch && portfolio.holdings.some(h => h.assetId.type === 'stock');
    }
    
    if (assetFilter === 'mutual_funds') {
      return nameMatch && portfolio.holdings.some(h => h.assetId.type === 'mutual_fund');
    }
    
    return nameMatch;
  });

  return (
    <div className="container">
      <h1 className="page-title">Your Portfolios</h1>
      
      <div className="search-filters">
        <div className="card">
          <div className="filter-row">
            <div className="search-input-container">
              <input 
                type="text" 
                placeholder="Search portfolios..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-select-container">
              <select 
                value={assetFilter}
                onChange={(e) => setAssetFilter(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Assets</option>
                <option value="stocks">Stocks Only</option>
                <option value="mutual_funds">Mutual Funds Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {portfolios.length === 0 ? (
        <div className="card">
          <p>No portfolios found for this user.</p>
        </div>
      ) : filteredPortfolios.length === 0 ? (
        <div className="card">
          <p>No portfolios match your search criteria.</p>
        </div>
      ) : (
        <div className="grid">
          {filteredPortfolios.map(portfolio => (
            <PortfolioCard key={portfolio._id} portfolio={portfolio} />
          ))}
        </div>
      )}
      
      <div className="portfolio-summary-card card">
        <h2 className="card-title">Portfolio Summary</h2>
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-label">Total Portfolios:</div>
            <div className="stat-value">{portfolios.length}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Total Value:</div>
            <div className="stat-value">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(portfolios.reduce((sum, p) => sum + p.totalValue, 0))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

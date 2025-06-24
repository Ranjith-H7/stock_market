import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PortfoliosContext } from '../context/PortfoliosContext';
import AssetChart from '../components/AssetChart';
import AssetPriceHistory from '../components/AssetPriceHistory';
import PortfolioAllocation from '../components/PortfolioAllocation';
import io from 'socket.io-client';

const PortfolioDetails = () => {
  const { portfolioId } = useParams();
  const { getPortfolio } = useContext(PortfoliosContext);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Calculate profit/loss
  const calculateProfitLoss = (holding) => {
    const currentValue = holding.quantity * holding.assetId.currentPrice;
    const purchaseValue = holding.quantity * holding.purchasePrice;
    return currentValue - purchaseValue;
  };

  // Calculate profit/loss percentage
  const calculateProfitLossPercentage = (holding) => {
    const currentValue = holding.quantity * holding.assetId.currentPrice;
    const purchaseValue = holding.quantity * holding.purchasePrice;
    return ((currentValue - purchaseValue) / purchaseValue) * 100;
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Fetch portfolio details
  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      try {
        const data = await getPortfolio(portfolioId);
        setPortfolio(data);
        
        // If portfolio has holdings, select the first one by default for the chart
        if (data && data.holdings && data.holdings.length > 0) {
          setSelectedAsset(data.holdings[0].assetId);
        }
      } catch (err) {
        setError('Error loading portfolio');
        console.error('Error loading portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (portfolioId) {
      loadPortfolio();
    }
  }, [portfolioId, getPortfolio]);

  // Initialize socket connection
  useEffect(() => {
    if (!portfolio) return;
    
    const newSocket = io(process.env.REACT_APP_API_URL || '');
    
    newSocket.on('connect', () => {
      console.log('Connected to server from portfolio details');
      
      // Subscribe to updates for this user
      if (portfolio.userId) {
        newSocket.emit('subscribe', portfolio.userId);
      }
    });
    
    newSocket.on('portfolioUpdate', async (data) => {
      if (data.portfolioId === portfolioId) {
        console.log('Portfolio update received in details page:', data);
        
        // Refresh the portfolio data
        const refreshedData = await getPortfolio(portfolioId);
        setPortfolio(refreshedData);
      }
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, [portfolio, portfolioId, getPortfolio]);

  if (loading) {
    return (
      <div className="container">
        <h1 className="page-title">Loading portfolio details...</h1>
        <div className="loader"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error || 'Portfolio not found'}</div>
        <Link to="/dashboard" className="btn">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1 className="page-title">{portfolio.name}</h1>
        <div className="portfolio-summary">
          <h2>Total Value: {formatCurrency(portfolio.totalValue)}</h2>
          <p>Last Updated: {formatDate(portfolio.lastUpdated)}</p>
        </div>
      </div>
      
      <div className="card">
        <h2 className="card-title">Holdings</h2>
        
        <div className="responsive-table">
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Purchase Price</th>
                <th>Current Price</th>
                <th>Purchase Value</th>
                <th>Current Value</th>
                <th>Profit/Loss</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((holding) => (
                <tr key={holding._id}>
                  <td data-label="Asset">{holding.assetId.name}</td>
                  <td data-label="Type">{holding.assetId.type === 'stock' ? 'Stock' : 'Mutual Fund'}</td>
                  <td data-label="Quantity">{holding.quantity}</td>
                  <td data-label="Purchase Price">{formatCurrency(holding.purchasePrice)}</td>
                  <td data-label="Current Price">{formatCurrency(holding.assetId.currentPrice)}</td>
                  <td data-label="Purchase Value">{formatCurrency(holding.quantity * holding.purchasePrice)}</td>
                  <td data-label="Current Value">{formatCurrency(holding.quantity * holding.assetId.currentPrice)}</td>
                  <td data-label="Profit/Loss" className={calculateProfitLoss(holding) >= 0 ? 'change-positive' : 'change-negative'}>
                    {formatCurrency(calculateProfitLoss(holding))}
                    <br />
                    ({calculateProfitLossPercentage(holding).toFixed(2)}%)
                  </td>
                  <td data-label="Action">
                    <button 
                      className={`btn ${selectedAsset?._id === holding.assetId._id ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => setSelectedAsset(holding.assetId)}
                    >
                      Chart
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="details-grid">
        {/* Portfolio Allocation Chart */}
        <div className="card">
          <PortfolioAllocation portfolio={portfolio} />
        </div>

        {/* Selected Asset Chart */}
        {selectedAsset && (
          <div className="card">
            <h2 className="card-title">Price History - {selectedAsset.name}</h2>
            <AssetChart asset={selectedAsset} />
          </div>
        )}
      </div>
      
      {/* Price History Table */}
      {selectedAsset && (
        <div className="card">
          <AssetPriceHistory asset={selectedAsset} />
        </div>
      )}
      
      <div className="text-right">
        <Link to="/dashboard" className="btn">Back to Dashboard</Link>
      </div>
    </div>
  );
};

export default PortfolioDetails;

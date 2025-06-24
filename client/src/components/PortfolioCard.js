import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PortfolioCard = ({ portfolio }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate total portfolio value
  const totalValue = portfolio.totalValue.toFixed(2);
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="card portfolio-card">
      <div className="portfolio-header">
        <h2 className="card-title">{portfolio.name}</h2>
        <div className="portfolio-value">
          {formatCurrency(totalValue)}
        </div>
      </div>
      
      <div className="portfolio-actions">
        <button 
          className="btn btn-secondary" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
        <Link to={`/portfolio/${portfolio._id}`} className="btn">
          View Details
        </Link>
      </div>
      
      {isExpanded && portfolio.holdings.length > 0 && (
        <div className="asset-table">
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Quantity</th>
                <th>Current Value</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.holdings.map((holding) => (
                <tr key={holding._id}>
                  <td>{holding.assetId.name}</td>
                  <td>{holding.quantity}</td>
                  <td>
                    {formatCurrency(holding.quantity * holding.assetId.currentPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PortfolioCard;

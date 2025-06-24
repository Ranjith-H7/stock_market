import React from 'react';

const AssetPriceHistory = ({ asset }) => {
  // Extract price history from the asset
  const priceHistory = asset.priceHistory || [];
  
  // Sort price history by timestamp in descending order (newest first)
  const sortedHistory = [...priceHistory].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );
  
  // Format date and time
  const formatDateTime = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  // Calculate price change percentage compared to previous price
  const calculatePriceChange = (currentIndex) => {
    if (currentIndex === sortedHistory.length - 1) return null; // No previous price for first entry
    
    const currentPrice = sortedHistory[currentIndex].price;
    const previousPrice = sortedHistory[currentIndex + 1].price;
    
    const changePercent = ((currentPrice - previousPrice) / previousPrice) * 100;
    return changePercent;
  };

  return (
    <div className="asset-price-history">
      <h3>Price History - {asset.name} ({asset.symbol})</h3>
      
      <table>
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Price</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {sortedHistory.map((record, index) => {
            const priceChange = calculatePriceChange(index);
            
            return (
              <tr key={record._id || index}>
                <td>{formatDateTime(record.timestamp)}</td>
                <td>{formatCurrency(record.price)}</td>
                <td className={priceChange > 0 ? 'change-positive' : 
                               priceChange < 0 ? 'change-negative' : ''}>
                  {priceChange !== null ? (
                    <>
                      {priceChange > 0 ? '↑' : priceChange < 0 ? '↓' : ''}
                      {` ${Math.abs(priceChange).toFixed(2)}%`}
                    </>
                  ) : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssetPriceHistory;

import React, { useMemo } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const PortfolioAllocation = ({ portfolio }) => {
  // Calculate allocation data
  const allocationData = useMemo(() => {
    if (!portfolio || !portfolio.holdings) return null;
    
    // Initialize allocation categories
    const allocation = {
      stocks: 0,
      mutualFunds: 0
    };
    
    // Calculate total value by asset type
    portfolio.holdings.forEach(holding => {
      const currentValue = holding.quantity * holding.assetId.currentPrice;
      
      if (holding.assetId.type === 'stock') {
        allocation.stocks += currentValue;
      } else if (holding.assetId.type === 'mutual_fund') {
        allocation.mutualFunds += currentValue;
      }
    });
    
    return allocation;
  }, [portfolio]);
  
  // Format data for pie chart
  const chartData = {
    labels: ['Stocks', 'Mutual Funds'],
    datasets: [
      {
        data: [allocationData?.stocks || 0, allocationData?.mutualFunds || 0],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
            const formattedValue = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(value);
            
            return `${context.label}: ${formattedValue} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  // Calculate total value
  const totalValue = allocationData ? 
    allocationData.stocks + allocationData.mutualFunds : 0;
  
  if (!allocationData || totalValue === 0) {
    return <div>No allocation data available</div>;
  }

  return (
    <div className="portfolio-allocation">
      <h3 className="card-title">Portfolio Allocation</h3>
      
      <div className="allocation-chart">
        <Pie data={chartData} options={chartOptions} />
      </div>
      
      <div className="allocation-summary">
        <div className="allocation-item">
          <div className="allocation-label">
            <span className="color-box" style={{ backgroundColor: 'rgba(54, 162, 235, 0.6)' }}></span>
            <span>Stocks:</span>
          </div>
          <div className="allocation-value">
            {formatCurrency(allocationData.stocks)} 
            ({((allocationData.stocks / totalValue) * 100).toFixed(2)}%)
          </div>
        </div>
        
        <div className="allocation-item">
          <div className="allocation-label">
            <span className="color-box" style={{ backgroundColor: 'rgba(255, 99, 132, 0.6)' }}></span>
            <span>Mutual Funds:</span>
          </div>
          <div className="allocation-value">
            {formatCurrency(allocationData.mutualFunds)}
            ({((allocationData.mutualFunds / totalValue) * 100).toFixed(2)}%)
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAllocation;

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AssetChart = ({ asset }) => {
  // Extract price history data from the asset
  const priceHistory = asset.priceHistory || [];
  
  // Get last 10 data points or less if not available
  const dataPoints = priceHistory.slice(-10);
  
  // Format dates for x-axis labels
  const labels = dataPoints.map(point => {
    const date = new Date(point.timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });
  
  // Get price data
  const prices = dataPoints.map(point => point.price);
  
  // Chart data
  const data = {
    labels,
    datasets: [
      {
        label: `${asset.name} Price`,
        data: prices,
        borderColor: 'rgb(52, 152, 219)',
        backgroundColor: 'rgba(52, 152, 219, 0.2)',
        tension: 0.2
      }
    ]
  };
  
  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.raw.toFixed(2)}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => `$${value}`
        }
      }
    }
  };

  return (
    <div className="asset-chart">
      <Line data={data} options={options} />
    </div>
  );
};

export default AssetChart;

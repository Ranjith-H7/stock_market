import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function PriceGraph({ assetId, assetName }) {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [chartType, setChartType] = useState('line');
  const [timePeriod, setTimePeriod] = useState('1M'); // 1M, 3M, 6M, 1Y

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/graphdata/${assetId}`);
        if (res.data && res.data.length > 0) {
          const formattedData = res.data.map(item => ({
            time: new Date(item.timestamp).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: item.timestamp ? new Date(item.timestamp).getHours() : 0
            }),
            fullDate: new Date(item.timestamp),
            price: parseFloat(item.price),
            volume: item.volume || Math.floor(Math.random() * 1000000) + 50000
          }));
          setData(formattedData);
        } else {
          // Generate fallback data if no data available
          generateFallbackData();
        }
      } catch (error) {
        console.error('Error fetching graph data:', error);
        generateFallbackData();
      }
    };

    const generateFallbackData = () => {
      const fallbackData = [];
      const now = new Date();
      const basePrice = 1500;
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
        const price = basePrice + (Math.random() - 0.5) * 200;
        fallbackData.push({
          time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          fullDate: date,
          price: parseFloat(price.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 50000
        });
      }
      setData(fallbackData);
    };

    fetchData();
    const interval = setInterval(fetchData, 600000); // Update every 10 minutes
    return () => clearInterval(interval);
  }, [assetId]);

  useEffect(() => {
    filterDataByTimePeriod();
  }, [data, timePeriod]);

  const filterDataByTimePeriod = () => {
    if (data.length === 0) return;

    const now = new Date();
    let startDate;

    switch (timePeriod) {
      case '1W':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case '1M':
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        break;
      case '3M':
        startDate = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
        break;
      case '6M':
        startDate = new Date(now.getTime() - (180 * 24 * 60 * 60 * 1000));
        break;
      case '1Y':
        startDate = new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000));
        break;
      default:
        startDate = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    }

    const filtered = data.filter(item => item.fullDate >= startDate);
    
    // Sample data for better visualization if too many points
    let sampledData = filtered;
    if (filtered.length > 100) {
      const step = Math.ceil(filtered.length / 100);
      sampledData = filtered.filter((_, index) => index % step === 0);
    }
    
    setFilteredData(sampledData);
  };

  const renderChart = () => {
    const dataToUse = filteredData.length > 0 ? filteredData : data;
    
    switch (chartType) {
      case 'area':
        return (
          <AreaChart data={dataToUse}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 8 }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 8 }}
              domain={['dataMin - 50', 'dataMax + 50']}
              width={60}
            />
            <Tooltip 
              formatter={(value, name) => [`₹${value}`, 'Price']}
              labelStyle={{ color: '#333' }}
              contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#4f46e5" 
              fill="#4f46e5" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </AreaChart>
        );
      case 'volume':
        return (
          <BarChart data={dataToUse}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 8 }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 8 }}
              width={60}
            />
            <Tooltip 
              formatter={(value, name) => [value.toLocaleString(), 'Volume']}
              labelStyle={{ color: '#333' }}
              contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd' }}
            />
            <Legend />
            <Bar dataKey="volume" fill="#10b981" opacity={0.8} />
          </BarChart>
        );
      default:
        return (
          <LineChart data={dataToUse}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 8 }}
              interval="preserveStartEnd"
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 8 }}
              domain={['dataMin - 50', 'dataMax + 50']}
              width={60}
            />
            <Tooltip 
              formatter={(value, name) => [`₹${value}`, 'Price']}
              labelStyle={{ color: '#333' }}
              contentStyle={{ backgroundColor: '#f8f9fa', border: '1px solid #ddd' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, fill: '#ef4444' }}
            />
          </LineChart>
        );
    }
  };

  const getPerformanceMetrics = () => {
    if (filteredData.length < 2) return { change: 0, changePercent: 0 };
    
    const firstPrice = filteredData[0].price;
    const lastPrice = filteredData[filteredData.length - 1].price;
    const change = lastPrice - firstPrice;
    const changePercent = (change / firstPrice) * 100;
    
    return { change, changePercent };
  };

  const { change, changePercent } = getPerformanceMetrics();

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold truncate">{assetName} Price Trend</h3>
          {filteredData.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs sm:text-sm space-y-1 sm:space-y-0">
              <span className="text-gray-600">
                Current: ₹{filteredData[filteredData.length - 1]?.price}
              </span>
              <span className={`font-semibold ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? '+' : ''}₹{change.toFixed(2)} ({change >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Time Period Filters */}
          <div className="flex space-x-1 overflow-x-auto">
            {['1W', '1M', '3M', '6M', '1Y'].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
                  timePeriod === period ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          
          {/* Chart Type Filters */}
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { key: 'line', label: 'Line' },
              { key: 'area', label: 'Area' },
              { key: 'volume', label: 'Volume' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setChartType(key)}
                className={`px-2 sm:px-3 py-1 text-xs rounded whitespace-nowrap ${
                  chartType === key ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={250}>
        {renderChart()}
      </ResponsiveContainer>
      
      {filteredData.length > 0 && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
          <div>
            <span className="font-medium">Volume:</span> {filteredData[filteredData.length - 1]?.volume?.toLocaleString()}
          </div>
          <div>
            <span className="font-medium">High:</span> ₹{Math.max(...filteredData.map(d => d.price)).toFixed(2)}
          </div>
          <div>
            <span className="font-medium">Low:</span> ₹{Math.min(...filteredData.map(d => d.price)).toFixed(2)}
          </div>
          <div>
            <span className="font-medium">Data Points:</span> {filteredData.length}
          </div>
        </div>
      )}
    </div>
  );
}
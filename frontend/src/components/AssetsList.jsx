import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AssetsList() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/assets');
        setAssets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching assets:', error);
        setLoading(false);
      }
    };

    fetchAssets();
    const interval = setInterval(fetchAssets, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-sm sm:text-base">Loading assets...</div>;
  }

  const stocks = assets.filter(asset => asset.type === 'stock');
  const mutualFunds = assets.filter(asset => asset.type === 'mutualFund');

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Market Overview</h2>
      
      {/* Stocks Section */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-blue-600">📈 Stocks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {stocks.map((asset) => (
            <div key={asset._id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">{asset.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{asset.symbol}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2 shrink-0">
                  Stock
                </span>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                    ₹{asset.price}
                  </span>
                  <span className="text-xs text-gray-500">per share</span>
                </div>
                
                {asset.volume && (
                  <div className="flex justify-between items-center mt-2 text-xs sm:text-sm text-gray-600">
                    <span>Volume:</span>
                    <span>{asset.volume.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mutual Funds Section */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-purple-600">📊 Mutual Funds</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {mutualFunds.map((asset) => (
            <div key={asset._id} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">{asset.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{asset.symbol}</p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded ml-2 shrink-0">
                  MF
                </span>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                    ₹{asset.price}
                  </span>
                  <span className="text-xs text-gray-500">per unit</span>
                </div>
                
                {asset.volume && (
                  <div className="flex justify-between items-center mt-2 text-xs sm:text-sm text-gray-600">
                    <span>Volume:</span>
                    <span>{asset.volume.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2 text-sm sm:text-base">💡 How to Read Prices:</h4>
        <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
          <li>• <strong>Stocks:</strong> Price shown is per 1 share</li>
          <li>• <strong>Mutual Funds:</strong> Price shown is per 1 unit</li>
          <li>• <strong>Volume:</strong> Total trading volume for the asset</li>
          <li>• <strong>Example:</strong> If SBI is ₹500, buying 10 shares costs ₹5,000</li>
        </ul>
      </div>
    </div>
  );
}

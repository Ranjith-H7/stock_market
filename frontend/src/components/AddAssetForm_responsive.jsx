import { useState } from 'react';
import axios from 'axios';

export default function AddAssetForm({ assets }) {
  const [assetId, setAssetId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [type, setType] = useState('buy');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.post(`http://localhost:5001/api/${type}`, { userId, assetId, quantity: parseInt(quantity) });
      window.location.reload();
    } catch (err) {
      setError(err.response.data.error);
    }
  };

  const selectedAsset = assets.find(asset => asset._id === assetId);
  const totalCost = selectedAsset && quantity ? selectedAsset.price * parseInt(quantity) : 0;

  return (
    <div className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg shadow-md mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Trade Assets</h2>
      {error && <p className="text-red-500 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>}
      
      {/* Available Assets Display */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Available Assets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          {assets.map((asset) => (
            <div 
              key={asset._id} 
              className={`p-2 sm:p-3 border rounded-lg cursor-pointer transition-all ${
                assetId === asset._id 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setAssetId(asset._id)}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-2 sm:mb-0">
                  <h4 className="font-medium text-sm sm:text-base">{asset.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-600">{asset.symbol} • {asset.type}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-base sm:text-lg font-bold text-green-600">₹{asset.price}</p>
                  <p className="text-xs text-gray-500">per {asset.type === 'stock' ? 'share' : 'unit'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Form */}
      <div className="border-t pt-3 sm:pt-4">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Make Transaction</h3>
        <div className="flex flex-col space-y-3 sm:space-y-4">
          {/* Action Type Selection */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="buy"
                checked={type === 'buy'}
                onChange={(e) => setType(e.target.value)}
                className="text-green-500"
              />
              <span className="text-sm sm:text-base">Buy</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                value="sell"
                checked={type === 'sell'}
                onChange={(e) => setType(e.target.value)}
                className="text-red-500"
              />
              <span className="text-sm sm:text-base">Sell</span>
            </label>
          </div>

          {/* Quantity Input */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Enter quantity"
                min="1"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!assetId || !quantity}
              className={`px-4 py-2 rounded-md font-medium text-sm sm:text-base transition-colors ${
                !assetId || !quantity
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : type === 'buy'
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {type === 'buy' ? 'Buy' : 'Sell'}
            </button>
          </div>

          {/* Transaction Summary */}
          {selectedAsset && quantity && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-medium text-sm sm:text-base mb-2">Transaction Summary:</h4>
              <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                <p><span className="font-medium">Asset:</span> {selectedAsset.name} ({selectedAsset.symbol})</p>
                <p><span className="font-medium">Type:</span> {selectedAsset.type === 'stock' ? 'Stock' : 'Mutual Fund'}</p>
                <p><span className="font-medium">Price per {selectedAsset.type === 'stock' ? 'share' : 'unit'}:</span> ₹{selectedAsset.price}</p>
                <p><span className="font-medium">Quantity:</span> {quantity}</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  <span className="font-medium">Total: ₹{totalCost.toLocaleString()}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

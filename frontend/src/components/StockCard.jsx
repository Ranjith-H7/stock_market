export default function StockCard({ asset, quantity, purchasePrice }) {
  const currentValue = asset.price * quantity;
  const investedValue = purchasePrice * quantity;
  const profitLoss = currentValue - investedValue;
  const profitLossPercent = (profitLoss / investedValue) * 100;

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border-l-4 border-blue-500">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-3 space-y-2 sm:space-y-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate">{asset.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{asset.symbol} • {asset.type}</p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
            {quantity} {asset.type === 'stock' ? 'shares' : 'units'}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0">
          <span className="text-xs sm:text-sm text-gray-600">Current Price:</span>
          <span className="font-semibold text-sm sm:text-base">
            ₹{asset.price.toFixed(2)} 
            <span className="text-xs text-gray-500 ml-1">per {asset.type === 'stock' ? 'share' : 'unit'}</span>
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-1 sm:space-y-0">
          <span className="text-xs sm:text-sm text-gray-600">Purchase Price:</span>
          <span className="font-semibold text-sm sm:text-base">
            ₹{purchasePrice.toFixed(2)} 
            <span className="text-xs text-gray-500 ml-1">per {asset.type === 'stock' ? 'share' : 'unit'}</span>
          </span>
        </div>
        
        <hr className="my-2" />
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Value:</span>
          <span className="font-semibold">₹{currentValue.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Invested:</span>
          <span className="font-semibold">₹{investedValue.toLocaleString()}</span>
        </div>
        
        <div className={`flex justify-between items-center p-2 rounded ${
          profitLoss >= 0 ? 'bg-green-50' : 'bg-red-50'
        }`}>
          <span className="text-sm font-medium">P&L:</span>
          <div className="text-right">
            <span className={`font-bold ${
              profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {profitLoss >= 0 ? '+' : ''}₹{profitLoss.toLocaleString()}
            </span>
            <br />
            <span className={`text-xs ${
              profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {profitLoss >= 0 ? '+' : ''}{profitLossPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile({ userId, onBalanceUpdate }) {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [addBalanceAmount, setAddBalanceAmount] = useState('');
  const [showAddBalance, setShowAddBalance] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, transactionsRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/portfolio/${userId}`),
          axios.get(`http://localhost:5001/api/transactions/${userId}`)
        ]);
        setUser(userRes.data);
        setTransactions(transactionsRes.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const handleAddBalance = async () => {
    try {
      setError('');
      setMessage('');
      
      const amount = parseFloat(addBalanceAmount);
      if (!amount || amount <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      
      if (amount > 1000000) {
        setError('Maximum addition limit is ₹10,00,000');
        return;
      }
      
      const response = await axios.post('http://localhost:5001/api/add-balance', {
        userId,
        amount
      });
      
      setMessage(response.data.message);
      setAddBalanceAmount('');
      setShowAddBalance(false);
      
      // Refresh user data using the callback from Dashboard
      if (onBalanceUpdate) {
        await onBalanceUpdate();
      } else {
        // Fallback to local refresh if callback not provided
        await fetchUserData();
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add balance');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 lg:p-6">
      {/* Success/Error Messages */}
      {message && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm sm:text-base">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm sm:text-base">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row border-b mb-4 sm:mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'profile' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base whitespace-nowrap ${
            activeTab === 'history' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Transaction History
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <p className="text-base sm:text-lg">{user.username || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-base sm:text-lg break-words">{user.email}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Financial Summary</h3>
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <span className="text-gray-600 text-sm sm:text-base">Available Balance:</span>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <span className="font-semibold text-green-600 text-base sm:text-lg">₹{user.balance?.toLocaleString()}</span>
                    <button
                      onClick={() => setShowAddBalance(!showAddBalance)}
                      className="px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm rounded hover:bg-blue-600 transition-colors self-start sm:self-auto"
                    >
                      Add Money
                    </button>
                  </div>
                </div>
                
                {/* Add Balance Form */}
                {showAddBalance && (
                  <div className="mt-3 p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3 text-sm sm:text-base">Add Money to Balance</h4>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={addBalanceAmount}
                        onChange={(e) => setAddBalanceAmount(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                        min="1"
                        max="1000000"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={handleAddBalance}
                          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm sm:text-base"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowAddBalance(false);
                            setAddBalanceAmount('');
                            setError('');
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm sm:text-base"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Maximum addition limit: ₹10,00,000</p>
                  </div>
                )}
                
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Total Invested:</span>
                  <span className="font-semibold">₹{user.totalInvested?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-600">Current Value:</span>
                  <span className="font-semibold">₹{user.currentValue?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t pt-2 text-sm sm:text-base">
                  <span className="text-gray-600">Profit/Loss:</span>
                  <span className={`font-semibold ${
                    user.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {user.profitLoss >= 0 ? '+' : ''}₹{user.profitLoss?.toLocaleString()} 
                    ({user.profitLoss >= 0 ? '+' : ''}{user.profitLossPercentage?.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Portfolio Holdings</h3>
            {user.portfolio?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Asset</th>
                      <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Qty</th>
                      <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Buy Price</th>
                      <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Current</th>
                      <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.portfolio.map((item, index) => {
                      const currentValue = item.quantity * item.assetId.price;
                      const investedValue = item.quantity * item.purchasePrice;
                      const pnl = currentValue - investedValue;
                      const pnlPercentage = (pnl / investedValue) * 100;
                      
                      return (
                        <tr key={index} className="border-b">
                          <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                            <div>
                              <div className="font-medium">{item.assetId.name}</div>
                              <div className="text-gray-500 text-xs">{item.assetId.symbol}</div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{item.quantity}</td>
                          <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">₹{item.purchasePrice?.toFixed(2)}</td>
                          <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">₹{item.assetId.price?.toFixed(2)}</td>
                          <td className={`px-2 sm:px-4 py-2 text-xs sm:text-sm ${pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            <div>
                              <div>{pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}</div>
                              <div className="text-xs">({pnl >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%)</div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base">No holdings in portfolio</p>
            )}
          </div>


        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Transactions</h3>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Date</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Asset</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Type</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Qty</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Price</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs sm:text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction._id} className="border-b">
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                        <div>
                          <div className="font-medium">{transaction.assetId?.name}</div>
                          <div className="text-gray-500 text-xs">{transaction.assetId?.symbol}</div>
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-2">
                        <span className={`px-1 sm:px-2 py-1 rounded text-xs ${
                          transaction.type === 'buy' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">{transaction.quantity}</td>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">₹{transaction.price?.toFixed(2)}</td>
                      <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold">₹{(transaction.quantity * transaction.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-sm sm:text-base">No transactions found</p>
          )}
        </div>
      )}
    </div>
  );
}

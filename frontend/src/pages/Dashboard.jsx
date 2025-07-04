import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import AddAssetForm from '../components/AddAssetForm';
import StockCard from '../components/StockCard';
import PriceGraph from '../components/PriceGraph';
import Profile from '../components/Profile';
import AssetsList from '../components/AssetsList';

export default function Dashboard() {
  const [user, setUser] = useState({ balance: 0, portfolio: [] });
  const [assets, setAssets] = useState([]);
  const [countdown, setCountdown] = useState(600);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const fetchData = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/');
      return;
    }
    try {
      const [userRes, assetsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.PORTFOLIO(userId)),
        axios.get(API_ENDPOINTS.ASSETS)
      ]);
      setUser(userRes.data);
      setAssets(assetsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchData();
          return 600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const getUserInfo = () => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    return { username, email };
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    navigate('/');
  };

  const { username, email } = getUserInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 sm:py-4 space-y-3 sm:space-y-0">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 truncate">
                Welcome, {username || 'User'}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600 truncate">{email}</p>
            </div>
            
            {/* Navigation and Logout */}
            <div className="w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex overflow-x-auto space-x-1 sm:space-x-2">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-2 text-xs sm:text-sm rounded whitespace-nowrap transition-colors ${
                      activeTab === 'dashboard' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setActiveTab('assets')}
                    className={`px-3 py-2 text-xs sm:text-sm rounded whitespace-nowrap transition-colors ${
                      activeTab === 'assets' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Market
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-3 py-2 text-xs sm:text-sm rounded whitespace-nowrap transition-colors ${
                      activeTab === 'profile' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Profile
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-xs sm:text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {activeTab === 'profile' ? (
          <Profile userId={localStorage.getItem('userId')} onBalanceUpdate={fetchData} />
        ) : activeTab === 'assets' ? (
          <AssetsList />
        ) : (
          <>
            {/* Financial Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Balance</h3>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">₹{user.balance?.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Invested</h3>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">₹{user.totalInvested?.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">Current Value</h3>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">₹{user.currentValue?.toLocaleString()}</p>
              </div>
              <div className="bg-white p-3 sm:p-4 rounded-lg shadow">
                <h3 className="text-xs sm:text-sm font-medium text-gray-500">P&L</h3>
                <p className={`text-lg sm:text-xl lg:text-2xl font-bold ${user.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {user.profitLoss >= 0 ? '+' : ''}₹{user.profitLoss?.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Timer and Refresh */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-3 rounded mb-4 space-y-2 sm:space-y-0">
              <p className="text-xs sm:text-sm text-center sm:text-left">
                Next update in: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
              </p>
              <button
                onClick={fetchData}
                className="px-3 py-1 bg-green-500 text-white text-xs sm:text-sm rounded hover:bg-green-600 transition-colors"
              >
                Refresh Now
              </button>
            </div>
            
            <AddAssetForm assets={assets} />
            
            {/* Portfolio */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Your Portfolio</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {user.portfolio && user.portfolio.length > 0 ? (
                  user.portfolio.map((item) => (
                    <StockCard 
                      key={item.assetId._id} 
                      asset={item.assetId} 
                      quantity={item.quantity} 
                      purchasePrice={item.purchasePrice} 
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <p className="text-sm sm:text-base">No assets in portfolio. Start by buying some assets!</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Price Trends */}
            <div className="mt-4 sm:mt-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Price Trends</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {assets.map((asset) => (
                  <PriceGraph key={asset._id} assetId={asset._id} assetName={asset.name} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

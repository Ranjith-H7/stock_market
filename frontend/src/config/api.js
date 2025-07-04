// API Configuration
const isDevelopment = import.meta.env.MODE === 'development';
const isProduction = import.meta.env.PROD;

// API Base URL
export const API_BASE_URL = isDevelopment 
  ? 'http://localhost:5001' 
  : import.meta.env.VITE_API_URL || window.location.origin;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  
  // Portfolio
  PORTFOLIO: (userId) => `${API_BASE_URL}/api/portfolio/${userId}`,
  BUY: `${API_BASE_URL}/api/buy`,
  SELL: `${API_BASE_URL}/api/sell`,
  ADD_BALANCE: `${API_BASE_URL}/api/add-balance`,
  
  // Assets
  ASSETS: `${API_BASE_URL}/api/assets`,
  GRAPH_DATA: (assetId) => `${API_BASE_URL}/api/graphdata/${assetId}`,
  TRANSACTIONS: (userId) => `${API_BASE_URL}/api/transactions/${userId}`,
  NEXT_UPDATE: `${API_BASE_URL}/api/next-update`,
  
  // Health
  HEALTH: `${API_BASE_URL}/api/health`
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  isDevelopment,
  isProduction
};

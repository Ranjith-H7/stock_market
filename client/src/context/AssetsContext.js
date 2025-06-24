import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const AssetsContext = createContext();

export const AssetsProvider = ({ children }) => {
  const [assets, setAssets] = useState({
    stocks: [],
    mutualFunds: [],
    allAssets: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all assets
  const fetchAssets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/assets');
      
      // Separate assets by type
      const stocks = response.data.filter(asset => asset.type === 'stock');
      const mutualFunds = response.data.filter(asset => asset.type === 'mutual_fund');
      
      setAssets({
        stocks,
        mutualFunds,
        allAssets: response.data
      });
      
      setError(null);
    } catch (err) {
      setError('Error fetching assets');
      console.error('Error fetching assets:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fetch specific asset details
  const getAsset = useCallback(async (assetId) => {
    if (!assetId) return null;
    
    try {
      const response = await axios.get(`http://localhost:5001/api/assets/${assetId}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching asset details:', err);
      return null;
    }
  }, []);
  
  // Update asset data when prices change
  const updateAssetPrice = useCallback((assetId, newPrice) => {
    setAssets(current => {
      const updatedAllAssets = current.allAssets.map(asset => 
        asset._id === assetId ? { ...asset, currentPrice: newPrice } : asset
      );
      
      const updatedStocks = current.stocks.map(asset => 
        asset._id === assetId ? { ...asset, currentPrice: newPrice } : asset
      );
      
      const updatedMutualFunds = current.mutualFunds.map(asset => 
        asset._id === assetId ? { ...asset, currentPrice: newPrice } : asset
      );
      
      return {
        stocks: updatedStocks,
        mutualFunds: updatedMutualFunds,
        allAssets: updatedAllAssets
      };
    });
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  return (
    <AssetsContext.Provider 
      value={{ 
        assets, 
        loading, 
        error, 
        fetchAssets,
        getAsset,
        updateAssetPrice
      }}
    >
      {children}
    </AssetsContext.Provider>
  );
};

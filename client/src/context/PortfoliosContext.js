import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const PortfoliosContext = createContext();

export const PortfoliosProvider = ({ children }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserPortfolios = useCallback(async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5001/api/portfolios/user/${userId}`);
      setPortfolios(response.data);
      setError(null);
    } catch (err) {
      setError('Error fetching portfolios');
      console.error('Error fetching portfolios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPortfolio = useCallback(async (portfolioId) => {
    if (!portfolioId) return null;
    
    try {
      const response = await axios.get(`http://localhost:5001/api/portfolios/${portfolioId}`);
      
      // Update the portfolio in our local state
      setPortfolios(current => {
        const index = current.findIndex(p => p._id === portfolioId);
        if (index >= 0) {
          const updated = [...current];
          updated[index] = response.data;
          return updated;
        } else {
          return [...current, response.data];
        }
      });
      
      return response.data;
    } catch (err) {
      console.error('Error fetching portfolio details:', err);
      return null;
    }
  }, []);

  const updatePortfolioValues = useCallback((updatedPortfolio) => {
    setPortfolios(current => 
      current.map(portfolio => 
        portfolio._id === updatedPortfolio.portfolioId 
          ? { ...portfolio, totalValue: updatedPortfolio.totalValue } 
          : portfolio
      )
    );
  }, []);

  return (
    <PortfoliosContext.Provider 
      value={{ 
        portfolios, 
        loading, 
        error, 
        fetchUserPortfolios, 
        getPortfolio,
        updatePortfolioValues 
      }}
    >
      {children}
    </PortfoliosContext.Provider>
  );
};

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching users');
        setLoading(false);
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <UsersContext.Provider value={{ users, loading, error }}>
      {children}
    </UsersContext.Provider>
  );
};

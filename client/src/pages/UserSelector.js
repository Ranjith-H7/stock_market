import React, { useContext, useEffect, useState } from 'react';
import { UsersContext } from '../context/UsersContext';

const UserSelector = ({ onUserSelect }) => {
  const { users, loading, error } = useContext(UsersContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (users) {
      setFilteredUsers(
        users.filter(user => 
          `${user.firstName} ${user.lastName} ${user.username}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [users, searchTerm]);

  if (loading) {
    return (
      <div className="container">
        <h1 className="page-title">Loading users...</h1>
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">Select a User</h1>
      
      <div className="card">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search by name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="user-list">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.firstName} {user.lastName}</td>
                  <td>{user.email}</td>
                  <td>
                    <button 
                      className="btn"
                      onClick={() => onUserSelect(user)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center">
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSelector;

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Basic persistent login logic
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token) {
      setUser({ userId, token, role: 'user' });
    }
    setLoading(false);
  }, []);

  const login = (userId, token) => {
    localStorage.setItem('userId', userId);
    localStorage.setItem('token', token);
    setUser({ userId, token });
  };

  const logout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};

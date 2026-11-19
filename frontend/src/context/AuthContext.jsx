import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Setting withCredentials so backend cookies are included in requests
axios.defaults.withCredentials = true;

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login status on page refresh
  useEffect(() => {
    axios.get('http://localhost:7777/auth/check')
      .then((res) => {
        if (res.data && res.data.isLoggedIn) {
          setUser(res.data.data);
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    axios.post('http://localhost:7777/auth/logout')
      .then(() => {
        setUser(null);
      })
      .catch((err) => {
        console.log(err);
        setUser(null);
      });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

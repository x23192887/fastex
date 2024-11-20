import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuthToken, removeAuthToken } from '../utils/cookies';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const validateToken = () => {
      const token = getAuthToken();
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token has expired
            removeAuthToken();
            setUser(null);
          } else {
            setUser({ username: decodedToken.sub });
          }
        } catch (error) {
          // Invalid token
          removeAuthToken();
          setUser(null);
        }
      }
    };

    validateToken();
    // Check token validity every minute
    const interval = setInterval(validateToken, 60000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  }, []);

  const login = useCallback(
    async (token, userData) => {
      try {
        // Validate inputs
        if (!token || !userData) {
          throw new Error("Token and user data are required");
        }

        // Verify token structure
        if (typeof token !== "string") {
          throw new Error("Invalid token format");
        }

        // Verify user data structure
        if (!userData.email || !userData.role) {
          throw new Error("Invalid user data format");
        }

        // Set auth state
        setToken(token);
        setUser(userData);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        return true;
      } catch (error) {
        console.error("Login error:", error);
        logout();
        throw error;
      }
    },
    [logout]
  );

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        // Verify token with backend
        const response = await axios.get("http://localhost:8000/auth/verify", {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (response.data.valid) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Refresh token if needed
          if (response.data.newToken) {
            await login(response.data.newToken, JSON.parse(storedUser));
          }
        } else {
          logout();
        }
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [login, logout]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Auto-logout when token expires
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      // You could decode the JWT here to check expiration
      // Or rely on backend verification via API calls
    };

    const interval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(interval);
  }, [token, logout]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

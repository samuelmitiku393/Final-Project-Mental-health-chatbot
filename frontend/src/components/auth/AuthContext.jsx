import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";

const decodeToken = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const login = useCallback(
    (token, userData) => {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      } else {
        logout(); // invalid or expired token
      }
    },
    [logout]
  );

  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    const decoded = decodeToken(token);
    return decoded && decoded.exp * 1000 > Date.now();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(userData);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeToken(token);
        if (!decoded || decoded.exp * 1000 <= Date.now()) {
          logout();
        }
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

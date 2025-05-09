import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("authUser");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setAuthUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (user, token) => {
    localStorage.setItem("authUser", JSON.stringify(user));
    localStorage.setItem("token", token);
    setAuthUser(user);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    setAuthUser(null);
    setToken(null);
  };

 return (
  <AuthContext.Provider value={{ authUser, token, login, logout, setAuthUser }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authenticateUser, MOCK_AUTH_USERS } from '../mock/authUsers';
import { ROLES } from '../constants/roles';

const AUTH_STORAGE_KEY = 'buildops_auth_session';

const AuthContext = createContext({
  user: null,
  role: ROLES.ADMIN,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(ROLES.ADMIN);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from local or session storage
  useEffect(() => {
    try {
      const storedLocal = localStorage.getItem(AUTH_STORAGE_KEY);
      const storedSession = sessionStorage.getItem(AUTH_STORAGE_KEY);
      const rawData = storedLocal || storedSession;

      if (rawData) {
        const parsed = JSON.parse(rawData);
        if (parsed && parsed.user && parsed.token) {
          setUser(parsed.user);
          setRole(parsed.user.role || ROLES.ADMIN);
          setIsAuthenticated(true);
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored authentication session:', err);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password, rememberMe = false) => {
    // Simulate slight authentication latency for realistic UX feel
    await new Promise((resolve) => setTimeout(resolve, 600));

    const result = authenticateUser(email, password);

    if (result.success && result.user) {
      const authData = {
        user: result.user,
        token: result.user.token,
        loginAt: new Date().toISOString(),
      };

      setUser(result.user);
      setRole(result.user.role);
      setIsAuthenticated(true);

      const storage = rememberMe ? localStorage : sessionStorage;
      // Clear previous sessions in alternate storage
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);

      storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));

      return { success: true, user: result.user };
    }

    return { success: false, error: result.error || 'Unable to sign in. Please check your credentials.' };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setRole, // Support role override for testing if needed
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

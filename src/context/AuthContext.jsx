import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { clearAuthToken, getAuthToken, setAuthToken, subscribeToAuthFailures } from "../services/api";
import { isTokenExpired, sanitizeSessionUser } from "../utils/security";

const AuthContext = createContext(null);
const SESSION_KEY = "itsupport.auth.session";

function getStoredUser() {
  try {
    const token = getAuthToken();
    if (!token || isTokenExpired(token)) {
      window.sessionStorage.removeItem(SESSION_KEY);
      clearAuthToken();
      return null;
    }

    const rawSession = window.sessionStorage.getItem(SESSION_KEY);
    if (!rawSession) return null;

    return sanitizeSessionUser(JSON.parse(rawSession));
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const hasRedirectedForExpiredSession = useRef(false);
  const role = user?.rol ?? null;

  const login = (userData, token) => {
    const safeUser = sanitizeSessionUser(userData);
    setUser(safeUser);
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    setAuthToken(token);
  };

  const logout = () => {
    setUser(null);
    window.sessionStorage.removeItem(SESSION_KEY);
    clearAuthToken();
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuthFailures(({ status }) => {
      if (status !== 401 && status !== 403) return;

      if (!user || hasRedirectedForExpiredSession.current) return;

      hasRedirectedForExpiredSession.current = true;
      window.sessionStorage.removeItem(SESSION_KEY);
      clearAuthToken();
      setUser(null);
      window.location.replace("/sesion-expirada");
    });

    return unsubscribe;
  }, [user]);

  const isAuthenticated = user !== null;
  const value = useMemo(() => ({ user, role, isAuthenticated, login, logout }), [user, role, isAuthenticated]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
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
  const hasShownSessionToast = useRef(false);
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
      if (status !== 401) return;

      setUser((currentUser) => {
        if (!currentUser) return currentUser;

        window.sessionStorage.removeItem(SESSION_KEY);
        clearAuthToken();

        if (!hasShownSessionToast.current) {
          hasShownSessionToast.current = true;
          toast.error("Tu sesion expiro", {
            description: "Inicia sesion nuevamente para continuar.",
            id: "auth:expired-session",
          });

          window.setTimeout(() => {
            hasShownSessionToast.current = false;
          }, 2500);
        }

        return null;
      });
    });

    return unsubscribe;
  }, []);

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

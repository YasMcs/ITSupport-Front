import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppLayout } from "../components/layout/AppLayout";

export function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}

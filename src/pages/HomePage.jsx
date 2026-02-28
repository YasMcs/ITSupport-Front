import { useAuth } from "../hooks/useAuth";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark-purple-900 p-6">
      <div className="bg-dark-purple-800 border border-dark-purple-700 rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Bienvenido
        </h1>
        <p className="text-text-secondary mb-6">{user?.email}</p>
        <Button variant="secondary" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}

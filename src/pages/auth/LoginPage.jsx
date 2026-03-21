import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { ROLES } from "../../constants/roles";
import { getUserDisplayName } from "../../utils/userDisplay";
import "../../styles/LoginPage.css";
import logoIcono from "../../assets/logo_icono.png";
import logo from "../../assets/logo.png";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authService.login({ email, password });
      const nextUser = data.user ?? { email, rol: ROLES.TECNICO, nombre: "Tecnico", apellido: "Demo", nombre_usuario: "tecnico.demo" };
      login(nextUser);
      toast.success(`¡Bienvenido de nuevo, ${getUserDisplayName(nextUser)}!`);
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.message ?? err.message ?? "Credenciales incorrectas";
      setError(message);
      toast.error("Credenciales incorrectas", {
        description: "Verifica tu email y contrasena para continuar.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-gradient-layer" />
        <div className="login-gradient-layer-2" />
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
        <div className="login-orb login-orb-4" />
        <div className="login-orb login-orb-5" />
        <div className="login-gradient-line login-gradient-line-top" />
        <div className="login-gradient-line login-gradient-line-bottom" />
        <div className="login-gradient-line login-gradient-line-middle" />
        <div className="login-noise" />
      </div>

      <form onSubmit={handleSubmit} className="login-card">
        <div className="login-card-header" />

        <div className="login-content">
          <div className="login-title">
            <div className="flex flex-col items-center justify-center gap-6">
              <img src={logoIcono} alt="Logo Icono" className="h-20 w-auto" />
              <img src={logo} alt="Logo" className="h-12 w-auto" />
            </div>
            <p className="mt-4">Inicia sesion para continuar</p>
          </div>

          <div className="login-form">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <Input
              label="Contrasena"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="login-error">
              <p>{error}</p>
            </div>
          )}

          <Button type="submit" variant="primary" className="login-button" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </form>
    </div>
  );
}

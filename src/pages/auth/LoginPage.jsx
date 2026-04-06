import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormField } from "../../components/ui/FormField";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";
import { containsForbiddenInput, validateEmail, validateRequiredText } from "../../utils/security";
import { getFeedbackMessage, feedbackText } from "../../utils/feedback";
import "../../styles/LoginPage.css";
import logoIcono from "../../assets/logo_icono.png";
import logo from "../../assets/logo.png";

export function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (containsForbiddenInput(formData.email) || containsForbiddenInput(formData.password)) {
      newErrors.email = feedbackText.invalidContent;
    } else {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError;
      }

      const passwordError = validateRequiredText(formData.password, { min: 6, max: 100 });
      if (passwordError) {
        newErrors.password =
          passwordError === "Este campo es obligatorio" ? "La contrasena es obligatoria" : passwordError;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!validate()) return;

    setLoading(true);

    try {
      const safeEmail = formData.email.trim().toLowerCase();
      const safePassword = formData.password.trim();
      const data = await authService.login({ email: safeEmail, password: safePassword });
      const nextUser = data.user;

      login(nextUser, data.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (err.response?.status === 401) {
        setErrors({
          email: "Correo o contrasena incorrectos. Por favor, verifica tus datos.",
          password: "",
        });
      } else {
        toast.error(getFeedbackMessage(err, "No pudimos iniciar sesion. Revisa tus datos e intenta nuevamente."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-gradient-layer" />
        <div className="login-gradient-layer-2" />
        <div className="login-grid-pattern" />
        <div className="login-orb login-orb-1" />
        <div className="login-orb login-orb-2" />
        <div className="login-orb login-orb-3" />
        <div className="login-orb login-orb-4" />
        <div className="login-orb login-orb-5" />
        <div className="login-orb login-orb-6" />
        <div className="login-gradient-line login-gradient-line-top" />
        <div className="login-gradient-line login-gradient-line-bottom" />
        <div className="login-noise" />
      </div>

      <div className="login-shell">
        <section className="login-intro">
          <div className="login-brand-block">
            <img src={logoIcono} alt="Logo Icono" className="login-brand-icon" />
            <img src={logo} alt="Logo" className="login-brand-logo" />
          </div>

          <div className="login-copy">
            <h1>Gestiona incidencias con una experiencia clara, segura y profesional.</h1>
            <p>
              Centraliza tickets, seguimiento y operacion interna en una plataforma pensada para equipos de soporte modernos.
            </p>
          </div>

          <div className="login-highlight-card">
            <span className="login-highlight-dot" />
            <div>
              <h2>Seguimiento centralizado y acceso ordenado</h2>
              <p>Controla incidencias, responsables y avances desde una sola plataforma con contexto claro para cada rol.</p>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="login-card">
          <div className="login-card-header" />

          <div className="login-content">
            <div className="login-title">
              <span className="login-card-tag">Acceso seguro</span>
              <h2>Inicia sesion</h2>
              <p>Accede a tu panel para continuar con la operacion del dia.</p>
            </div>

            <div className="login-form">
              <FormField label="Email" error={errors.email} required>
                <Input
                  type="email"
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  autoComplete="username"
                />
              </FormField>
              <FormField label="Contrasena" error={errors.password} required>
                <Input
                  type="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                  autoComplete="current-password"
                />
              </FormField>
            </div>

            <Button type="submit" variant="primary" className="login-button" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

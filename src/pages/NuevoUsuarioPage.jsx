import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UsuarioForm } from "../components/usuarios/UsuarioForm";
import { areaService } from "../services/areaService";
import { userService } from "../services/userService";
import { getFeedbackMessage } from "../utils/feedback";

export function NuevoUsuarioPage() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadAreas() {
      try {
        const data = await areaService.getAll();
        if (!cancelled) setAreas(data);
      } catch {
        if (!cancelled) setAreas([]);
      }
    }

    loadAreas();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (payload) => {
    try {
      await userService.create(payload);
      navigate("/usuarios");
    } catch (error) {
      toast.error("No pudimos guardar el usuario", {
        description: getFeedbackMessage(error, "Revisa los datos e intenta nuevamente."),
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate("/usuarios")}
          className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Nuevo Usuario</h1>
          <p className="text-text-secondary mt-1">Registra un nuevo usuario y define su acceso a la plataforma.</p>
        </div>
      </div>

      <UsuarioForm onSubmit={handleSubmit} onCancel={() => navigate("/usuarios")} areaOptions={areas} />
    </div>
  );
}

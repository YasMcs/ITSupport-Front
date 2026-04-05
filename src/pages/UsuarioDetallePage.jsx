import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UsuarioForm } from "../components/usuarios/UsuarioForm";
import { areaService } from "../services/areaService";
import { userService } from "../services/userService";
import { getFeedbackMessage } from "../utils/feedback";

export function UsuarioDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [userData, areaData] = await Promise.all([userService.getById(id), areaService.getAll()]);

        if (!cancelled) {
          setUsuario(userData);
          setAreas(areaData);
          setLoadError("");
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(getFeedbackMessage(error, "No pudimos abrir el usuario seleccionado."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-secondary">Cargando usuario...</p>
      </div>
    );
  }

  if (loadError || !usuario) {
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
            <h1 className="text-3xl font-bold text-text-primary">Visualizar Usuario</h1>
            <p className="text-text-secondary mt-1">No fue posible recuperar el registro solicitado.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-accent-pink">{loadError || "No encontramos informacion para este usuario."}</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-text-primary">Visualizar Usuario</h1>
          <p className="text-text-secondary mt-1">Consulta la informacion del usuario antes de editarla.</p>
        </div>
      </div>

      <UsuarioForm
        usuario={usuario}
        onCancel={() => navigate("/usuarios")}
        isEditing
        areaOptions={areas}
        readOnly
        primaryActionLabel="Editar Usuario"
        onPrimaryAction={() => navigate(`/usuarios/editar/${id}`)}
      />
    </div>
  );
}

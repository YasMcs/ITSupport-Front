import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SucursalForm } from "../components/sucursales/SucursalForm";
import { sucursalService } from "../services/sucursalService";
import { getFeedbackMessage } from "../utils/feedback";

export function SucursalDetallePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sucursalData, setSucursalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadSucursal() {
      try {
        const data = await sucursalService.getById(id);
        if (!cancelled) {
          setSucursalData(data);
          setLoadError("");
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(getFeedbackMessage(error, "No pudimos abrir la sucursal seleccionada."));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSucursal();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-text-secondary">Cargando sucursal...</p>
      </div>
    );
  }

  if (loadError || !sucursalData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/sucursales")}
            className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Visualizar Sucursal</h1>
            <p className="text-text-secondary mt-1">No fue posible recuperar la sucursal solicitada.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-accent-pink">{loadError || "No encontramos informacion para esta sucursal."}</p>
        </div>
      </div>
    );
  }

  return (
    <SucursalForm
      initialData={sucursalData}
      readOnly
      primaryActionLabel="Editar Sucursal"
      onPrimaryAction={() => navigate(`/sucursales/editar/${id}`)}
    />
  );
}

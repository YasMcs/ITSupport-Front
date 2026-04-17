import { useEffect, useState } from "react";
import { decodeId } from "../utils/cryptoUtils";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AreaForm } from "../components/areas/AreaForm";
import { areaService } from "../services/areaService";
import { sucursalService } from "../services/sucursalService";
import { getFeedbackMessage } from "../utils/feedback";

export function AreaDetallePage() {
  const { id: encodedId } = useParams();
  const id = decodeId(encodedId);
  const navigate = useNavigate();
  const [areaExistente, setAreaExistente] = useState(null);
  const [sucursalOptions, setSucursalOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    // Guardia: Validar que el ID sea válido
    if (!id || id === "null" || id === "undefined") {
      toast.error("El ID del área no es válido o ha expirado.");
      navigate("/areas");
      return;
    }

    async function loadData() {
      try {
        const [areaData, sucursales] = await Promise.all([areaService.getById(id), sucursalService.getAll()]);

        if (!cancelled) {
          setAreaExistente(areaData);
          setSucursalOptions(
            sucursales.map((sucursal) => ({
              value: String(sucursal.id),
              label: sucursal.nombre,
            }))
          );
          setLoadError("");
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(getFeedbackMessage(error, "No pudimos abrir el area seleccionada."));
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
        <p className="text-text-secondary">Cargando area...</p>
      </div>
    );
  }

  if (loadError || !areaExistente) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => navigate("/areas")}
            className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Visualizar Area</h1>
            <p className="text-text-secondary mt-1">No fue posible recuperar el area solicitada.</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6">
          <p className="text-accent-pink">{loadError || "No encontramos informacion para esta area."}</p>
        </div>
      </div>
    );
  }

  return (
    <AreaForm
      initialData={areaExistente}
      sucursalOptions={sucursalOptions}
      readOnly
      primaryActionLabel="Editar Area"
      onPrimaryAction={() => navigate(`/areas/editar/${id}`)}
    />
  );
}

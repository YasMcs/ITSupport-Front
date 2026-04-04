import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AreaForm } from "../components/areas/AreaForm";
import { areaService } from "../services/areaService";
import { sucursalService } from "../services/sucursalService";
import { getFeedbackMessage } from "../utils/feedback";

export function NuevaAreaPage() {
  const navigate = useNavigate();
  const [sucursalOptions, setSucursalOptions] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadSucursales() {
      try {
        const sucursales = await sucursalService.getAll();
        if (!cancelled) {
          setSucursalOptions(
            sucursales.map((sucursal) => ({
              value: String(sucursal.id),
              label: sucursal.nombre,
            }))
          );
        }
      } catch {
        if (!cancelled) setSucursalOptions([]);
      }
    }

    loadSucursales();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (payload) => {
    try {
      await areaService.create(payload);
      navigate("/areas");
    } catch (error) {
      toast.error("No pudimos guardar el area", {
        description: getFeedbackMessage(error, "Revisa los datos e intenta nuevamente."),
      });
      throw error;
    }
  };

  return <AreaForm onSubmit={handleSubmit} sucursalOptions={sucursalOptions} />;
}

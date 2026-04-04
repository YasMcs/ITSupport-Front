import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SucursalForm } from "../components/sucursales/SucursalForm";
import { sucursalService } from "../services/sucursalService";
import { getFeedbackMessage } from "../utils/feedback";

export function NuevaSucursalPage() {
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      await sucursalService.create(payload);
      navigate("/sucursales");
    } catch (error) {
      toast.error("No pudimos guardar la sucursal", {
        description: getFeedbackMessage(error, "Revisa los datos e intenta nuevamente."),
      });
      throw error;
    }
  };

  return <SucursalForm onSubmit={handleSubmit} />;
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { TicketForm } from "../components/tickets/TicketForm";
import { containsForbiddenInput } from "../utils/security";
import { feedbackText, getFeedbackMessage } from "../utils/feedback";
import { areaService } from "../services/areaService";
import { ticketService } from "../services/ticketService";

export function NuevoTicketPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [areas, setAreas] = useState(user?.area_id ? [{
    id: user.area_id,
    nombreArea: user.area,
    nombreSucursal: user.sucursal,
    estado: "Activa",
  }] : []);

  useEffect(() => {
    if (role !== ROLES.ADMIN) return undefined;

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
  }, [role]);

  if (role !== ROLES.ENCARGADO) {
    navigate("/tickets");
    return null;
  }

  const handleSubmit = async (payload) => {
    if (containsForbiddenInput(payload.titulo) || containsForbiddenInput(payload.descripcion)) {
      toast.error("No pudimos guardar el ticket", {
        description: feedbackText.invalidContent,
      });
      return;
    }

    try {
      await ticketService.create(payload);
      toast.success("Registro creado exitosamente", {
        description: "El ticket ya esta disponible en tu bandeja.",
      });
      navigate("/tickets");
    } catch (error) {
      toast.error("No pudimos registrar el ticket", {
        description: getFeedbackMessage(error, "Revisa los datos e intenta nuevamente."),
      });
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/tickets")}
          className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div>
          <h1 className="text-3xl font-bold text-text-primary">Nuevo Ticket</h1>
          <p className="text-text-secondary mt-1">Registra una nueva solicitud para que el equipo de soporte pueda atenderla.</p>
        </div>
      </div>

      <TicketForm
        onSubmit={handleSubmit}
        layout="split"
        areaOptions={areas}
        user={{
          id: user?.id,
          nombre: user?.nombre,
          apellido_paterno: user?.apellido_paterno,
          apellido_materno: user?.apellido_materno,
          nombre_usuario: user?.nombre_usuario || "",
          area_id: user?.area_id,
          area: user?.area,
          sucursal: user?.sucursal,
        }}
      />
    </div>
  );
}

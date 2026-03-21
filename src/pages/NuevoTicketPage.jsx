import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { TicketForm } from "../components/tickets/TicketForm";
import { mockTickets } from "../utils/mockTickets";

export function NuevoTicketPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  if (role !== ROLES.ENCARGADO) {
    navigate("/tickets");
    return null;
  }

  const handleSubmit = (payload) => {
    const newId = String(1029 + mockTickets.length);

    mockTickets.push({
      id: newId,
      titulo: payload.titulo,
      descripcion: payload.descripcion,
      prioridad: payload.prioridad,
      estado: "abierto",
      encargado_id: payload.encargado_id,
      tecnico_id: null,
      area_id: payload.area_id,
      fecha_creacion: new Date().toISOString().split("T")[0],
      historial: [{ fecha: new Date().toISOString().split("T")[0], accion: "Ticket creado", tecnico_id: null }],
      comentarios: [],
    });
    toast.success("Registro creado exitosamente", {
      description: "El ticket ya esta disponible en tu bandeja.",
    });
    navigate("/tickets");
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
          <p className="text-text-secondary mt-1">Crea un ticket usando el contrato exacto del backend</p>
        </div>
      </div>

      <TicketForm
        onSubmit={handleSubmit}
        layout="split"
        user={{
          id: user?.id,
          nombre: user?.nombre,
          apellido_paterno: user?.apellido_paterno,
          apellido_materno: user?.apellido_materno,
          nombre_usuario: user?.nombre_usuario || "",
          area_id: user?.area_id,
        }}
      />
    </div>
  );
}

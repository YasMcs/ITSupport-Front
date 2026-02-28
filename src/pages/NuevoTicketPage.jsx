import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { TicketForm } from "../components/tickets/TicketForm";
import { mockTickets } from "../utils/mockTickets";

export function NuevoTicketPage() {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  if (role !== ROLES.RESPONSABLE) {
    navigate("/tickets");
    return null;
  }

  const handleSubmit = (formData) => {
    const newId = String(1029 + mockTickets.length);
    
    const newTicket = {
      id: newId,
      titulo: formData.titulo || formData.descripcion.substring(0, 30) + "...",
      descripcion: formData.descripcion,
      area: formData.area || "General",
      sucursal: formData.sucursal,
      prioridad: formData.prioridad,
      estado: "abierto",
      tecnicoAsignado: null,
      responsable: formData.responsable,
      contacto: user?.email || "",
      fechaCreacion: new Date().toISOString().split("T")[0],
      historial: [
        { fecha: new Date().toISOString().split("T")[0], accion: "Ticket creado", tecnico: null },
      ],
      comentarios: [],
    };

    mockTickets.push(newTicket);
    
    navigate("/tickets");
  };

  return (
    <div className="space-y-6">
      {/* Header con título y botón de regresar alineados en la misma línea */}
      <div className="flex items-center gap-4 mb-8">
        {/* Botón Regresar */}
        <button
          onClick={() => navigate("/tickets")}
          className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Título y Subtítulo */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Nuevo Ticket</h1>
          <p className="text-text-secondary mt-1">
            Completa los datos para reportar tu problema
          </p>
        </div>
      </div>

      {/* TicketForm con layout split (dos columnas) */}
      <TicketForm 
        onSubmit={handleSubmit} 
        layout="split"
        user={{
          nombre: user?.nombre || "",
          area: user?.area || "Recursos Humanos",
          sucursal: user?.sucursal || "Sucursal Norte"
        }}
      />
    </div>
  );
}

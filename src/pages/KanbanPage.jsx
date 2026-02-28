import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { TICKET_STATUS } from "../constants/ticketStatus";
import { mockTickets } from "../utils/mockTickets";
import { KanbanBoard } from "../components/tickets/KanbanBoard";
import { Button } from "../components/ui/Button";

export function KanbanPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();

  // Estado local de tickets para el Drag and Drop
  const [tickets, setTickets] = useState(() => {
    let filteredTickets = [];

    if (role === ROLES.ADMIN) {
      filteredTickets = [...mockTickets];
    } else if (role === ROLES.SOPORTE) {
      filteredTickets = mockTickets.filter(
        (t) => t.tecnicoAsignado === user?.nombre
      );
    } else if (role === ROLES.RESPONSABLE) {
      filteredTickets = mockTickets.filter(
        (t) => t.responsable === user?.nombre
      );
    }

    return filteredTickets;
  });

  // Función para mover ticket entre columnas
  const handleTicketMove = (ticketId, newStatus) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, estado: newStatus }
          : ticket
      )
    );
  };

  // Obtener mensaje según el rol y si hay tickets
  const getEmptyMessage = () => {
    if (role === ROLES.SOPORTE) return "No tienes tickets asignados";
    if (role === ROLES.RESPONSABLE) return "Aún no tienes tickets registrados";
    return "No hay tickets disponibles";
  };

  // Renderizado del título según rol
  const getTitle = () => {
    switch (role) {
      case ROLES.ADMIN:
        return "Gestión de Tickets - Vista Kanban";
      case ROLES.SOPORTE:
        return "Mis Tickets - Vista Kanban";
      case ROLES.RESPONSABLE:
        return "Mis Tickets - Vista Kanban";
      default:
        return "Vista Kanban";
    }
  };

  // Renderizado de la descripción según rol
  const getDescription = () => {
    switch (role) {
      case ROLES.ADMIN:
        return "Arrastra los tickets entre columnas para actualizar su estado";
      case ROLES.SOPORTE:
        return "Tus tickets asignados";
      case ROLES.RESPONSABLE:
        return "Tus tickets registrados";
      default:
        return "Vista Kanban";
    }
  };

  const hasTickets = tickets && tickets.length > 0;

  if (!hasTickets) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="w-16 h-16 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            <p className="text-text-secondary text-lg">{getEmptyMessage()}</p>
            {role === ROLES.RESPONSABLE && (
              <Button onClick={() => navigate("/tickets/nuevo")}>
                Crear Ticket
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <h1 className="text-3xl font-bold text-text-primary">
            {getTitle()}
          </h1>
          <p className="text-text-secondary mt-1">{getDescription()}</p>
        </div>

        {/* Botones */}
        <div className="flex items-center gap-3">
          {/* Cambiar vista */}
          {(role === ROLES.ADMIN ||
            role === ROLES.SOPORTE ||
            role === ROLES.RESPONSABLE) && (
            <>
              <Button onClick={() => navigate("/tickets")} variant="secondary">
                Vista Tabla
              </Button>
              {role === ROLES.RESPONSABLE && (
                <Button onClick={() => navigate("/tickets/nuevo")}>
                  Nuevo Ticket
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Tablero Kanban */}
      <KanbanBoard tickets={tickets} onTicketMove={handleTicketMove} />
    </div>
  );
}

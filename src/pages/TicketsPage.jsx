import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { mockTickets } from "../utils/mockTickets";
import { TicketTable, COLUMN_KEYS } from "../components/tickets/TicketTable";
import { KanbanBoard } from "../components/tickets/KanbanBoard";
import { Button } from "../components/ui/Button";
import { FilterBar } from "../components/ui/FilterBar";

export function TicketsPage() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "",
    prioridad: "",
    area: "",
    sucursal: "",
    tecnico: "",
  });

  // Estado local de tickets para el Drag and Drop (solo para SOPORTE)
  const [tickets, setTickets] = useState(() => {
    if (role !== ROLES.SOPORTE) return [];
    return mockTickets.filter((t) => t.tecnicoAsignado === user?.nombre);
  });

  // Función para mover ticket entre columnas (solo para SOPORTE)
  const handleTicketMove = (ticketId, newStatus) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId
          ? { ...ticket, estado: newStatus }
          : ticket
      )
    );
  };

  const filteredTickets = useMemo(() => {
    let tickets = [];

    if (role === ROLES.ADMIN) {
      tickets = [...mockTickets];
    } else if (role === ROLES.SOPORTE) {
      tickets = mockTickets.filter(
        (t) => t.tecnicoAsignado === user?.nombre
      );
    } else if (role === ROLES.RESPONSABLE) {
      tickets = mockTickets.filter(
        (t) => t.responsable === user?.nombre
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tickets = tickets.filter(ticket => 
        ticket.id.toLowerCase().includes(query) ||
        ticket.titulo?.toLowerCase().includes(query) ||
        ticket.descripcion?.toLowerCase().includes(query) ||
        ticket.responsable?.toLowerCase().includes(query) ||
        ticket.tecnicoAsignado?.toLowerCase().includes(query) ||
        ticket.area?.toLowerCase().includes(query)
      );
    }

    return tickets.filter((ticket) => {
      // No aplicar filtro de estado en vista Kanban (rol SOPORTE)
      if (role !== ROLES.SOPORTE && filters.estado && ticket.estado !== filters.estado) return false;
      if (filters.prioridad && ticket.prioridad !== filters.prioridad) return false;
      if (filters.area && ticket.area !== filters.area) return false;
      if (filters.sucursal && ticket.sucursal !== filters.sucursal) return false;
      if (filters.tecnico && ticket.tecnicoAsignado !== filters.tecnico) return false;
      return true;
    });
  }, [role, user, filters, searchQuery]);

  const getColumns = () => {
    if (role === ROLES.ADMIN) {
      return [
        COLUMN_KEYS.NUMERO,
        COLUMN_KEYS.PRIORIDAD,
        COLUMN_KEYS.ESTADO,
        COLUMN_KEYS.RESPONSABLE,
        COLUMN_KEYS.TECNICO,
        COLUMN_KEYS.FECHA,
        COLUMN_KEYS.ACCIONES,
      ];
    } else if (role === ROLES.SOPORTE) {
      return [
        COLUMN_KEYS.NUMERO,
        COLUMN_KEYS.PRIORIDAD,
        COLUMN_KEYS.ESTADO,
        COLUMN_KEYS.RESPONSABLE,
        COLUMN_KEYS.FECHA,
        COLUMN_KEYS.ACCIONES,
      ];
    } else if (role === ROLES.RESPONSABLE) {
      return [
        COLUMN_KEYS.NUMERO,
        COLUMN_KEYS.FECHA,
        COLUMN_KEYS.PRIORIDAD,
        COLUMN_KEYS.ESTADO,
        COLUMN_KEYS.TECNICO,
        COLUMN_KEYS.ACCIONES,
      ];
    }
    return [];
  };

  const handleVerDetalle = (id) => {
    navigate(`/tickets/${id}`);
  };

  const handleGenerarReporte = () => {
    alert("Reporte generado");
  };

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      estado: "",
      prioridad: "",
      area: "",
      sucursal: "",
      tecnico: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "");

  const renderFilters = () => {
    return (
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        hideStatus={role === ROLES.SOPORTE}
        role={role}
      />
    );
  };

  const getEmptyMessage = () => {
    if (role === ROLES.SOPORTE) return "No tienes tickets asignados";
    if (role === ROLES.RESPONSABLE) return "Aún no tienes tickets registrados";
    return "No hay tickets registrados";
  };

  return (
    <div className="space-y-6">
      {/* Header - Distribuido con titulo, buscador y botones */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <h1 className="text-3xl font-bold text-text-primary">Tickets</h1>
          <p className="text-text-secondary mt-1">
            {role === ROLES.ADMIN && "Gestiona todos los tickets del sistema"}
            {role === ROLES.SOPORTE && "Tickets asignados a ti"}
            {role === ROLES.RESPONSABLE && "Tus tickets registrados"}
          </p>
        </div>
        
        {/* Buscador - Solo en vista de tablas */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar tickets..."
              className="w-full bg-dark-purple-800 border border-dark-purple-700 text-text-primary rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-purple-electric focus:border-purple-electric transition-all"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {role === ROLES.ADMIN && (
            <Button onClick={handleGenerarReporte} variant="secondary">
              Generar reporte
            </Button>
          )}
          {role === ROLES.RESPONSABLE && (
            <Button onClick={() => navigate("/tickets/nuevo")}>
              Nuevo Ticket
            </Button>
          )}
        </div>
      </div>

      {renderFilters()}

      {filteredTickets.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-16 h-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-text-secondary text-lg">{getEmptyMessage()}</p>
          </div>
        </div>
      ) : role === ROLES.SOPORTE ? (
        <KanbanBoard tickets={tickets} onTicketMove={handleTicketMove} />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <TicketTable
            tickets={filteredTickets}
            columnas={getColumns()}
            onVerDetalle={handleVerDetalle}
          />
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { TicketTable, COLUMN_KEYS } from "../components/tickets/TicketTable";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { FilterBar } from "../components/ui/FilterBar";
import { ticketService } from "../services/ticketService";
import { getFeedbackMessage } from "../utils/feedback";

export function TicketsPage() {
  const { user, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [takingTicketId, setTakingTicketId] = useState(null);
  const [showAllTechnicianTickets, setShowAllTechnicianTickets] = useState(false);
  const [filters, setFilters] = useState({
    estado: "",
    prioridad: "",
    area: "",
    sucursal: "",
    tecnico: "",
  });
  const [tickets, setTickets] = useState([]);
  const [availableTickets, setAvailableTickets] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function loadTickets() {
      setLoading(true);

      try {
        if (role === ROLES.TECNICO) {
          const [assignedData, availableData] = await Promise.all([
            ticketService.getMineAssigned(),
            ticketService.getAvailable(),
          ]);

          if (!cancelled) {
            setTickets(filterTicketsByRole(assignedData, role, user));
            setAvailableTickets(availableData);
          }
          return;
        }

        const data = await ticketService.getScoped(role);
        if (!cancelled) {
          setTickets(filterTicketsByRole(data, role, user));
          setAvailableTickets([]);
        }
      } catch (error) {
        if (!cancelled) {
          setTickets([]);
          setAvailableTickets([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTickets();
    return () => {
      cancelled = true;
    };
  }, [role, user]);

  const filteredTickets = useMemo(
    () => applyTicketFilters(
      [...tickets].sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)),
      { filters, role, searchQuery }
    ),
    [filters, role, searchQuery, tickets]
  );

  const filteredAvailableTickets = useMemo(
    () => applyTicketFilters(
      [...availableTickets].sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion)),
      { filters, role, searchQuery }
    ),
    [availableTickets, filters, role, searchQuery]
  );

  const visibleTechnicianTickets = useMemo(() => {
    if (role !== ROLES.TECNICO) return [];

    const scopedTickets = showAllTechnicianTickets
      ? filteredTickets
      : filteredTickets.filter((ticket) => ticket.estado !== "cerrado");

    return [...scopedTickets].sort(sortTechnicianWorkQueue);
  }, [filteredTickets, role, showAllTechnicianTickets]);

  const technicianClosedCount = useMemo(
    () => filteredTickets.filter((ticket) => ticket.estado === "cerrado").length,
    [filteredTickets]
  );

  const technicianActiveCount = useMemo(
    () => filteredTickets.filter((ticket) => ticket.estado !== "cerrado").length,
    [filteredTickets]
  );

  const getColumns = () => {
    if (role === ROLES.ADMIN) {
      return [
        COLUMN_KEYS.NUMERO,
        COLUMN_KEYS.TITULO,
        COLUMN_KEYS.AREA,
        COLUMN_KEYS.PRIORIDAD,
        COLUMN_KEYS.ESTADO,
        COLUMN_KEYS.RESPONSABLE,
        COLUMN_KEYS.TECNICO,
        COLUMN_KEYS.FECHA,
        COLUMN_KEYS.ACCIONES,
      ];
    }
    if (role === ROLES.TECNICO) {
      return [COLUMN_KEYS.NUMERO, COLUMN_KEYS.TITULO, COLUMN_KEYS.AREA, COLUMN_KEYS.PRIORIDAD, COLUMN_KEYS.ESTADO, COLUMN_KEYS.FECHA, COLUMN_KEYS.ACCIONES];
    }
    if (role === ROLES.ENCARGADO) {
      return [COLUMN_KEYS.NUMERO, COLUMN_KEYS.FECHA, COLUMN_KEYS.PRIORIDAD, COLUMN_KEYS.ESTADO, COLUMN_KEYS.TECNICO, COLUMN_KEYS.ACCIONES];
    }
    return [];
  };

  const clearFilters = () => setFilters({ estado: "", prioridad: "", area: "", sucursal: "", tecnico: "" });
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");
  const areaOptions = [...new Set(tickets.map((ticket) => ticket.area).filter(Boolean))];
  const sucursalOptions = [...new Set(tickets.map((ticket) => ticket.sucursal).filter(Boolean))];
  const tecnicoOptions = [...new Set(tickets.map((ticket) => ticket.tecnicoAsignado || ticket.tecnico).filter(Boolean))];

  const getEmptyMessage = () => {
    if (role === ROLES.TECNICO) return "No tienes tickets asignados";
    if (role === ROLES.ENCARGADO) return "Aun no tienes tickets registrados";
    return "No hay tickets registrados";
  };

  const handleTakeTicket = async (ticketId) => {
    if (!user?.id || takingTicketId) return;

    try {
      setTakingTicketId(ticketId);
      const assignedTicket = await ticketService.assign({
        ticketId: Number(ticketId),
        tecnicoId: Number(user.id),
      });

      setAvailableTickets((prev) => prev.filter((ticket) => String(ticket.id) !== String(ticketId)));
      setTickets((prev) => {
        const withoutDuplicate = prev.filter((ticket) => String(ticket.id) !== String(assignedTicket.id));
        return [assignedTicket, ...withoutDuplicate];
      });

      toast.success("Ticket asignado", {
        description: "El ticket ya forma parte de tu bandeja de trabajo.",
      });
    } catch (error) {
      toast.error("No pudimos tomar el ticket", {
        description: getFeedbackMessage(error, "Intenta nuevamente."),
      });
    } finally {
      setTakingTicketId(null);
    }
  };

  const tecnicoView = role === ROLES.TECNICO && location.pathname === "/tickets/disponibles"
    ? "available"
    : "assigned";

  const headerTitle =
    role === ROLES.TECNICO
      ? tecnicoView === "available"
        ? "Tickets Disponibles"
        : "Mis Tickets"
      : "Tickets";

  const headerDescription =
    role === ROLES.ADMIN
      ? "Gestiona todos los tickets del sistema"
      : role === ROLES.ENCARGADO
        ? "Tus tickets registrados"
        : tecnicoView === "available"
          ? "Explora la bandeja abierta y toma un ticket cuando tengas capacidad."
          : "Consulta y organiza los tickets que ya forman parte de tu flujo de trabajo.";

  return (
      <div className="space-y-4"> 
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">  

        <div className="flex-1 max-w-md">
          <h1 className="text-3xl font-bold text-text-primary">{headerTitle}</h1>
          <p className="text-text-secondary mt-1">{headerDescription}</p>
        </div>

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
          {role === ROLES.TECNICO && tecnicoView === "assigned" && (
            <Button onClick={() => navigate("/tickets/disponibles")} variant="secondary">
              Ver disponibles
            </Button>
          )}
          {role === ROLES.TECNICO && tecnicoView === "available" && (
            <Button onClick={() => navigate("/tickets")} variant="secondary">
              Volver a mis tickets
            </Button>
          )}
          {role === ROLES.ENCARGADO && <Button onClick={() => navigate("/tickets/nuevo")}>Nuevo Ticket</Button>}
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((current) => !current)}
        hideStatus={role === ROLES.TECNICO}
        role={role}
        areaOptions={areaOptions}
        sucursalOptions={sucursalOptions}
        tecnicoOptions={tecnicoOptions}
      />

      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-text-secondary text-lg">Cargando tickets...</p>
        </div>
      ) : role === ROLES.TECNICO ? (
<div className="space-y-4 pt-2">

          {tecnicoView === "available" ? (
            <section className="rounded-3xl bg-white/[0.03] p-6 backdrop-blur-sm">
              {filteredAvailableTickets.length === 0 ? (
                <div className="rounded-2xl bg-dark-purple-900/20 px-6 py-10 text-center">
                  <p className="text-text-secondary">No hay tickets disponibles por tomar en este momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                  {filteredAvailableTickets.map((ticket) => (
                    <article key={ticket.id} className="rounded-2xl bg-dark-purple-900/30 p-5 backdrop-blur-sm">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-mono text-text-muted">#{ticket.id}</p>
                          <h3 className="mt-1 text-base font-semibold text-text-primary">{ticket.titulo}</h3>
                        </div>
                        <Badge priority={ticket.prioridad} />
                      </div>

                      <p className="line-clamp-2 text-sm text-text-secondary">{ticket.descripcion}</p>

                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-text-muted">
                        <span className="rounded-full bg-dark-purple-800/55 px-3 py-1">
                          {ticket.area || "Sin area"}
                        </span>
                        <span className="rounded-full bg-dark-purple-800/55 px-3 py-1">
                          {ticket.sucursal || "Sin sucursal"}
                        </span>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="text-xs text-text-muted">
                          Creado el {ticket.fechaCreacion ? new Date(ticket.fechaCreacion).toLocaleDateString("es-MX") : "sin fecha"}
                        </span>
                        <Button
                          type="button"
                          onClick={() => handleTakeTicket(ticket.id)}
                          disabled={takingTicketId === ticket.id}
                          className="w-auto px-5 py-2.5"
                        >
                          {takingTicketId === ticket.id ? "Tomando..." : "Tomar ticket"}
                        </Button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <>
              {filteredTickets.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-16 h-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-text-secondary text-lg">{getEmptyMessage()}</p>
                  </div>
                </div>
              ) : (
                <section className="space-y-5">
                  <div className="flex flex-col gap-4 rounded-3xl bg-white/[0.03] p-5 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-text-primary">Bandeja de trabajo</h2>
                      <p className="mt-1 text-sm text-text-secondary">
                        Se muestran primero los tickets que requieren atencion. Los cerrados quedan fuera del foco por defecto.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="inline-flex rounded-2xl bg-dark-purple-900/45 p-1">
                        <button
                          type="button"
                          onClick={() => setShowAllTechnicianTickets(false)}
                          className={`rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
                            !showAllTechnicianTickets
                              ? "bg-purple-electric/90 text-white shadow-[0_10px_25px_rgba(139,92,246,0.24)]"
                              : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          Activos
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAllTechnicianTickets(true)}
                          className={`rounded-2xl px-4 py-2 text-sm font-medium transition-all ${
                            showAllTechnicianTickets
                              ? "bg-purple-electric/90 text-white shadow-[0_10px_25px_rgba(139,92,246,0.24)]"
                              : "text-text-secondary hover:text-text-primary"
                          }`}
                        >
                          Todos
                        </button>
                      </div>

                      <div className="text-right text-xs text-text-muted">
                        <p>{technicianActiveCount} activos</p>
                        <p>{technicianClosedCount} cerrados</p>
                      </div>
                    </div>
                  </div>

                  {visibleTechnicianTickets.length === 0 ? (
                    <div className="rounded-2xl bg-dark-purple-900/20 px-6 py-10 text-center">
                      <p className="text-text-secondary">
                        {showAllTechnicianTickets
                          ? "No hay tickets para mostrar con los filtros actuales."
                          : "No tienes tickets activos en este momento."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                      {visibleTechnicianTickets.map((ticket) => (
                        <article key={ticket.id} className="rounded-2xl bg-dark-purple-900/30 p-5 backdrop-blur-sm">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-xs font-mono text-text-muted">#{ticket.id}</p>
                              <h3 className="mt-1 line-clamp-2 text-base font-semibold text-text-primary">
                                {ticket.titulo}
                              </h3>
                            </div>
                            <div className="flex shrink-0 flex-col items-end gap-2">
                              <Badge priority={ticket.prioridad} />
                              <Badge status={ticket.estado} />
                            </div>
                          </div>

                          <p className="mt-3 line-clamp-2 text-sm text-text-secondary">{ticket.descripcion}</p>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs text-text-muted">
                            <span className="rounded-full bg-dark-purple-800/55 px-3 py-1">
                              {ticket.area || "Sin area"}
                            </span>
                            {ticket.encargado && (
                              <span className="rounded-full bg-dark-purple-800/55 px-3 py-1">
                                {ticket.encargado}
                              </span>
                            )}
                          </div>

                          <div className="mt-5 flex items-end justify-between gap-4">
                            <div className="space-y-1 text-xs text-text-muted">
                              <p>
                                Creado el{" "}
                                {ticket.fechaCreacion
                                  ? new Date(ticket.fechaCreacion).toLocaleDateString("es-MX")
                                  : "sin fecha"}
                              </p>
                              {ticket.fechaCierre && (
                                <p>
                                  Cerrado el {new Date(ticket.fechaCierre).toLocaleDateString("es-MX")}
                                </p>
                              )}
                            </div>

                            <Button
                              type="button"
                              variant={ticket.estado === "cerrado" ? "secondary" : "primary"}
                              className="w-auto px-5 py-2.5"
                              onClick={() => navigate(`/tickets/${ticket.id}`, { state: { ticket } })}
                            >
                              Ver detalle
                            </Button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-16 h-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-text-secondary text-lg">{getEmptyMessage()}</p>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <TicketTable tickets={filteredTickets} columnas={getColumns()} />
        </div>
      )}
    </div>
  );
}

function sortTechnicianWorkQueue(a, b) {
  const stateWeight = {
    abierto: 0,
    en_proceso: 1,
    cerrado: 2,
  };

  const priorityWeight = {
    alta: 0,
    media: 1,
    baja: 2,
  };

  const stateDiff = (stateWeight[a.estado] ?? 99) - (stateWeight[b.estado] ?? 99);
  if (stateDiff !== 0) return stateDiff;

  const priorityDiff = (priorityWeight[a.prioridad] ?? 99) - (priorityWeight[b.prioridad] ?? 99);
  if (priorityDiff !== 0) return priorityDiff;

  return new Date(a.fechaCreacion) - new Date(b.fechaCreacion);
}

function filterTicketsByRole(tickets, role, user) {
  if (role === ROLES.ADMIN) return tickets;
  if (role === ROLES.TECNICO) return tickets.filter((ticket) => Number(ticket.tecnico_id) === Number(user?.id));
  if (role === ROLES.ENCARGADO) return tickets.filter((ticket) => Number(ticket.encargado_id) === Number(user?.id));
  return [];
}

function applyTicketFilters(tickets, { filters, role, searchQuery }) {
  let currentTickets = [...tickets];

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    currentTickets = currentTickets.filter((ticket) =>
      [ticket.id, ticket.titulo, ticket.descripcion, ticket.encargado, ticket.tecnico, ticket.area]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))
    );
  }

  return currentTickets.filter((ticket) => {
    if (role !== ROLES.TECNICO && filters.estado && ticket.estado !== filters.estado) return false;
    if (filters.prioridad && ticket.prioridad !== filters.prioridad) return false;
    if (filters.area && ticket.area !== filters.area) return false;
    if (filters.sucursal && ticket.sucursal !== filters.sucursal) return false;
    if (filters.tecnico && ticket.tecnico !== filters.tecnico) return false;
    return true;
  });
}

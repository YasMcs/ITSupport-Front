import { useEffect, useMemo, useState } from "react";
import { TICKET_STATUS } from "../constants/ticketStatus";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { Badge } from "../components/ui/Badge";
import { PRIORIDAD } from "../constants/ticketPrioridad";
import { getUserDisplayName } from "../utils/userDisplay";
import { ticketService } from "../services/ticketService";
import { formatDate } from "../utils/formatDate";

export function DashboardPage() {
  const { user, role } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);

      try {
        const data = await ticketService.getScoped(role);
        if (!cancelled) {
          const finalTickets = Array.isArray(data) ? data : [];
          setTickets(finalTickets);
          console.log('[DASHBOARD DEBUG Backend]', { role, totalTickets: finalTickets.length, sample: finalTickets.slice(0,3).map(t => ({id: t.id, estado: t.estado, titulo: t.titulo?.slice(0,50) })) });
        }
      } catch (error) {
        if (!cancelled) {
          setTickets([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [role]);

  const stats = useMemo(() => buildDashboardStats(tickets, role), [tickets, role]);
  const recentTickets = useMemo(
    () => [...tickets].sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion)).slice(0, 4),
    [tickets]
  );
  const criticalTickets = useMemo(
    () => recentTickets.filter((ticket) => ticket.prioridad === PRIORIDAD.ALTA).slice(0, 3),
    [recentTickets]
  );

  const getTrendIcon = (trend) => {
    if (trend === "up") {
      return (
        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      );
    }

    return (
      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
      </svg>
    );
  };

  const getStatIcon = () => (
    <svg className="h-5 w-5 text-purple-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m5-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className="space-y-8">
      <div className="mb-8 flex flex-col gap-1">
        <span className="text-sm font-medium text-purple-electric">Hola, {getUserDisplayName(user)}</span>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="glass-card rounded-xl p-4 transition-all duration-200 hover:border-purple-electric/20"
          >
            <div className="flex flex-col">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatIcon()}
                  <p className="text-xs text-text-secondary">{stat.label}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs ${stat.trend === "up" ? "text-purple-electric" : "text-text-muted"}`}>
                  {getTrendIcon(stat.trend)}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary">{loading ? "..." : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xl font-bold text-text-primary">
              <svg className="h-5 w-5 text-purple-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Tickets recientes
            </h2>
            <Link to="/tickets" className="text-sm font-medium text-purple-electric transition-colors hover:text-purple-electric-hover">
              Ver todos
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-sm text-text-muted">Cargando tickets...</p>
            ) : recentTickets.length === 0 ? (
              <p className="text-sm text-text-muted">No hay tickets recientes</p>
            ) : recentTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] p-4 transition-colors duration-200 hover:bg-white/5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-text-primary">
                    #{ticket.id} - {ticket.titulo}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    {ticket.area || "Sin area"} - {formatDate(ticket.fechaCreacion)}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-2">
                  <Badge priority={ticket.prioridad} />
                  <Badge status={ticket.estado} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="glass-card rounded-2xl p-5">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-text-primary">
              <svg className="h-5 w-5 text-purple-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Tickets criticos
            </h2>
            <div className="space-y-3">
              {loading ? (
                <p className="text-sm text-text-muted">Cargando tickets criticos...</p>
              ) : criticalTickets.length > 0 ? (
                criticalTickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/5 p-3 transition-colors duration-200 hover:bg-white/5"
                  >
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-purple-electric/80"></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary">#{ticket.id}</p>
                      <p className="truncate text-xs text-text-secondary">{ticket.titulo}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-text-muted">No hay tickets criticos</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildDashboardStats(tickets, role) {
const abiertos = tickets.filter((ticket) => ticket.estado === TICKET_STATUS.ABIERTO).length;
const enProceso = tickets.filter((ticket) => ticket.estado === TICKET_STATUS.EN_PROCESO).length;
const cerrados = tickets.filter((ticket) => ticket.estado === TICKET_STATUS.CERRADO).length;
  const vencidos = tickets.filter((ticket) => ticket.esVencido).length;

  if (role === "tecnico") {
    return [
      { id: "assigned", label: "Asignados", value: tickets.length, trend: "up", change: `${enProceso} en proceso` },
{ id: "en-proceso", label: "En Proceso", value: enProceso, trend: enProceso > 0 ? "up" : "down", change: `${enProceso} con tecnico` },
      { id: "closed", label: "Cerrados", value: cerrados, trend: "up", change: "Historial personal" },
    ];
  }

  if (role === "encargado") {
    return [
      { id: "created", label: "Creados", value: tickets.length, trend: "up", change: "Tus solicitudes" },
      { id: "en-proceso", label: "En Proceso", value: enProceso, trend: enProceso > 0 ? "up" : "down", change: `${enProceso} con tecnico` },
      { id: "closed", label: "Resueltos", value: cerrados, trend: "up", change: `${vencidos} vencidos` },
    ];
  }

  return [
    { id: "total", label: "Total tickets", value: tickets.length, trend: "up", change: "Vision global" },
    { id: "en-proceso", label: "En Proceso", value: enProceso, trend: enProceso > 0 ? "up" : "down", change: `${enProceso} con tecnico` },
    { id: "closed", label: "Cerrados", value: cerrados, trend: "up", change: `${vencidos} vencidos` },
  ];

}

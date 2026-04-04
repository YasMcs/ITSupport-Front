import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { TICKET_STATUS } from "../constants/ticketStatus";
import { Badge } from "../components/ui/Badge";
import { ticketService } from "../services/ticketService";

function filterTicketsByRole(tickets, role, user) {
  if (role === ROLES.ADMIN) return tickets;
  if (role === ROLES.TECNICO) return tickets.filter((ticket) => ticket.tecnico_id === user?.id);
  if (role === ROLES.ENCARGADO) return tickets.filter((ticket) => ticket.encargado_id === user?.id);
  return [];
}

function calculateKPIs(tickets) {
  const abiertos = tickets.filter((ticket) => ticket.estado === "abierto" || ticket.estado === "en_proceso").length;
  const enProceso = tickets.filter((ticket) => ticket.estado === "en_proceso").length;
  const resueltos = tickets.filter((ticket) => ticket.estado === "cerrado").length;
  const anulado = tickets.filter((ticket) => ticket.estado === "anulado").length;
  return { abiertos, enProceso, resueltos, anulado, total: tickets.length };
}

function getTicketsByPriority(tickets) {
  const counts = { alta: 0, media: 0, baja: 0 };
  tickets.forEach((ticket) => {
    if (ticket.prioridad === "alta") counts.alta += 1;
    if (ticket.prioridad === "media") counts.media += 1;
    if (ticket.prioridad === "baja") counts.baja += 1;
  });

  const max = Math.max(counts.alta, counts.media, counts.baja) || 1;
  return [
    { label: "Alta", count: counts.alta, percentage: (counts.alta / max) * 100, barClass: "bg-gradient-to-r from-purple-electric/90 to-transparent" },
    { label: "Media", count: counts.media, percentage: (counts.media / max) * 100, barClass: "bg-gradient-to-r from-purple-electric/70 to-transparent" },
    { label: "Baja", count: counts.baja, percentage: (counts.baja / max) * 100, barClass: "bg-gradient-to-r from-purple-electric/50 to-transparent" },
  ];
}

function getTopAreas(tickets) {
  const areaCount = {};
  tickets.forEach((ticket) => {
    areaCount[ticket.area] = (areaCount[ticket.area] || 0) + 1;
  });
  return Object.entries(areaCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([area, count]) => ({ area, count }));
}

function getStagnantTickets(tickets) {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  return tickets
    .filter((ticket) => {
      if (ticket.estado === TICKET_STATUS.CERRADO) return false;
      if (!ticket.comentarios?.length) return new Date(ticket.fechaCreacion) < cutoff;
      return new Date(ticket.comentarios[ticket.comentarios.length - 1].fecha) < cutoff;
    })
    .slice(0, 5);
}

function KPICard({ title, value, subtitle }) {
  return (
    <div className="glass-card rounded-xl p-4 shadow-none">
      <p className="mb-1 text-xs font-medium text-text-secondary">{title}</p>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-text-muted">{subtitle}</p>}
    </div>
  );
}

function BarChart({ data }) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-12 text-xs text-text-secondary">{item.label}</span>
          <div className="h-6 flex-1 overflow-hidden rounded-xl border border-dark-purple-700/90 bg-dark-purple-800/60 backdrop-blur-xl">
            <div className={`h-full rounded-xl ${item.barClass}`} style={{ width: `${item.percentage}%` }} />
          </div>
          <span className="w-8 text-right text-xs font-medium text-text-primary">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

export function EstadisticasPage() {
  const { user, role } = useAuth();
  const [sourceTickets, setSourceTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadTickets() {
      setLoading(true);

      try {
        const data = await ticketService.getScoped(role);
        if (!cancelled) setSourceTickets(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled) {
          setSourceTickets([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTickets();
    return () => {
      cancelled = true;
    };
  }, [role]);

  const tickets = useMemo(() => filterTicketsByRole(sourceTickets, role, user), [sourceTickets, role, user]);
  const kpis = useMemo(() => calculateKPIs(tickets), [tickets]);
  const priorityData = useMemo(() => getTicketsByPriority(tickets), [tickets]);
  const topAreas = useMemo(() => getTopAreas(tickets), [tickets]);
  const stagnantTickets = useMemo(() => getStagnantTickets(tickets), [tickets]);
  const pendientes = kpis.abiertos;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-text-primary">Estadisticas</h1>
        <p className="mt-1 text-text-secondary">Resumen claro del comportamiento de tickets y equipos de soporte</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="Tickets Pendientes" value={pendientes} subtitle={`${kpis.enProceso} en proceso`} />
        <KPICard title="Tickets Cerrados" value={loading ? "..." : kpis.resueltos} subtitle="Casos finalizados" />
        <KPICard title="Tickets Anulados" value={loading ? "..." : kpis.anulado} subtitle="Incidencias descartadas" />
        <KPICard title="Total Registrados" value={loading ? "..." : kpis.total} subtitle="Volumen analizado" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-6 shadow-none">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-text-secondary">Tickets por Prioridad</h2>
          <BarChart data={priorityData} />
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-none">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-text-secondary">Areas con Mas Incidencias</h2>
          <div className="space-y-2">
            {topAreas.map((item, index) => (
              <div key={item.area} className="flex items-center justify-between border-b border-white/10 py-2 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-text-muted">0{index + 1}</span>
                  <span className="text-sm text-text-primary">{item.area}</span>
                </div>
                <span className="text-sm font-medium text-text-primary">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 shadow-none">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary">Atencion Requerida</h2>
          {stagnantTickets.length > 0 && (
            <span className="rounded-full border border-purple-electric/20 bg-purple-electric/10 px-3 py-1 text-xs font-medium text-purple-electric">
              {stagnantTickets.length} tickets
            </span>
          )}
        </div>
        <div className="space-y-2">
          {stagnantTickets.length === 0 ? (
            <p className="text-text-secondary">Todo al dia</p>
          ) : (
            stagnantTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="flex items-center justify-between rounded-xl border border-dark-purple-700/90 bg-dark-purple-800/55 p-3 transition-colors hover:bg-dark-purple-700/60"
              >
                <div>
                  <p className="text-sm text-text-primary">#{ticket.id}</p>
                  <p className="max-w-[200px] truncate text-xs text-text-muted">{ticket.titulo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge priority={ticket.prioridad} />
                  <span className="text-xs font-medium text-purple-electric">48h+</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

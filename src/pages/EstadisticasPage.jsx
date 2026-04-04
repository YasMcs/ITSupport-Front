import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { TICKET_STATUS } from "../constants/ticketStatus";
import { Badge } from "../components/ui/Badge";
import { ticketService } from "../services/ticketService";
import { 
  getSystemHealth, 
  calculateTrackingIndex, 
  getTicketsSinAtencion 
} from "../utils/metrics";

// Filtra los tickets según el rol para que las estadísticas sean personales o globales
function filterTicketsByRole(tickets, role, user) {
  if (role === ROLES.ADMIN) return tickets;
  if (role === ROLES.TECNICO) return tickets.filter((ticket) => Number(ticket.tecnico_id) === Number(user?.id));
  if (role === ROLES.ENCARGADO) return tickets.filter((ticket) => Number(ticket.encargado_id) === Number(user?.id));
  return [];
}

// Función corregida por Gemini para conteo preciso de estados
function calculateKPIs(tickets) {
  const abiertos = tickets.filter((ticket) => 
    ticket.estado === TICKET_STATUS.ABIERTO || ticket.estado === TICKET_STATUS.EN_PROCESO
  ).length;
  const enProceso = tickets.filter((ticket) => ticket.estado === TICKET_STATUS.EN_PROCESO).length;
  const resueltos = tickets.filter((ticket) => ticket.estado === TICKET_STATUS.CERRADO).length;
  
  return { abiertos, enProceso, resueltos, total: tickets.length };
}

function getTicketsByPriority(tickets) {
  const counts = { alta: 0, media: 0, baja: 0 };
  tickets.forEach((ticket) => {
    const p = ticket.prioridad?.toLowerCase();
    if (p === "alta") counts.alta += 1;
    else if (p === "media") counts.media += 1;
    else if (p === "baja") counts.baja += 1;
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
    const areaName = ticket.area || "Sin Área";
    areaCount[areaName] = (areaCount[areaName] || 0) + 1;
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
      const fechaReferencia = ticket.comentarios?.length 
        ? new Date(ticket.comentarios[ticket.comentarios.length - 1].fecha)
        : new Date(ticket.fechaCreacion);
      return fechaReferencia < cutoff;
    })
    .slice(0, 5);
}

function KPICard({ title, value, subtitle, loading }) {
  return (
    <div className="glass-card rounded-xl p-4 shadow-none border border-white/5 bg-white/[0.02]">
      <p className="mb-1 text-xs font-medium text-text-secondary">{title}</p>
      <p className="text-3xl font-bold text-text-primary">{loading ? "..." : value}</p>
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
          <div className="h-6 flex-1 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-xl">
            <div className={`h-full rounded-xl transition-all duration-500 ${item.barClass}`} style={{ width: `${item.percentage}%` }} />
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
        if (!cancelled) setSourceTickets([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadTickets();
    return () => { cancelled = true; };
  }, [role]);

  const tickets = useMemo(() => filterTicketsByRole(sourceTickets, role, user), [sourceTickets, role, user]);
  const kpis = useMemo(() => calculateKPIs(tickets), [tickets]);
  const priorityData = useMemo(() => getTicketsByPriority(tickets), [tickets]);
  const topAreas = useMemo(() => getTopAreas(tickets), [tickets]);
  const stagnantTickets = useMemo(() => getStagnantTickets(tickets), [tickets]);

  const roleMetric = useMemo(() => {
    if (role === ROLES.ADMIN) {
      const health = getSystemHealth(tickets);
      return { title: "Atención Crítica", value: health.rojo, subtitle: "Tickets > 48h sin actividad" };
    }
    if (role === ROLES.TECNICO) {
      const tracking = calculateTrackingIndex(tickets);
      return { title: "Sin Seguimiento", value: tracking.enProcesoSinSeguimiento, subtitle: "Tickets sin comentarios" };
    }
    if (role === ROLES.ENCARGADO) {
      const sinAtencion = getTicketsSinAtencion(tickets).length;
      return { title: "Sin Respuesta", value: sinAtencion, subtitle: "Pendientes de asignación" };
    }
    return null;
  }, [tickets, role]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-text-primary">Estadísticas</h1>
        <p className="mt-1 text-text-secondary">Análisis del rendimiento y estado de soporte</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard 
          title="Tickets Pendientes" 
          value={kpis.abiertos} 
          subtitle={`${kpis.enProceso} en proceso`} 
          loading={loading}
        />
        <KPICard 
          title="Tickets Cerrados" 
          value={kpis.resueltos} 
          subtitle="Casos finalizados" 
          loading={loading}
        />
        <KPICard 
          title="Total Registrados" 
          value={kpis.total} 
          subtitle="Volumen histórico" 
          loading={loading}
        />
        {roleMetric && (
          <KPICard 
            title={roleMetric.title} 
            value={roleMetric.value} 
            subtitle={roleMetric.subtitle} 
            loading={loading}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="glass-card rounded-2xl p-6 shadow-none">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-text-secondary">Distribución por Prioridad</h2>
          <BarChart data={priorityData} />
        </div>

        <div className="glass-card rounded-2xl p-6 shadow-none">
          <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-text-secondary">Áreas con más Incidencias</h2>
          <div className="space-y-2">
            {topAreas.length === 0 ? <p className="text-sm text-text-muted">Sin datos</p> : 
              topAreas.map((item, index) => (
                <div key={item.area} className="flex items-center justify-between border-b border-white/5 py-2 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-text-muted">0{index + 1}</span>
                    <span className="text-sm text-text-primary">{item.area}</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{item.count}</span>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 shadow-none">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xs font-medium uppercase tracking-wider text-text-secondary">Tickets Estancados (+48h)</h2>
          {stagnantTickets.length > 0 && (
            <span className="rounded-full border border-purple-electric/20 bg-purple-electric/10 px-3 py-1 text-xs font-medium text-purple-electric">
              {stagnantTickets.length} críticos
            </span>
          )}
        </div>
        <div className="space-y-2">
          {stagnantTickets.length === 0 ? (
            <p className="text-text-secondary text-sm">Flujo de trabajo al día</p>
          ) : (
            stagnantTickets.map((ticket) => (
              <Link
                key={ticket.id}
                to={`/tickets/${ticket.id}`}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.01] p-3 transition-colors hover:bg-white/[0.05]"
              >
                <div>
                  <p className="text-sm text-text-primary font-medium">#{ticket.id}</p>
                  <p className="max-w-[300px] truncate text-xs text-text-muted">{ticket.titulo}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge priority={ticket.prioridad} />
                  <span className="text-[10px] font-bold text-purple-electric uppercase bg-purple-electric/10 px-2 py-0.5 rounded">Atención</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
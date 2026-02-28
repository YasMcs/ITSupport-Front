import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { mockTickets } from "../utils/mockTickets";
import { TICKET_STATUS } from "../constants/ticketStatus";
import { Badge } from "../components/ui/Badge";
import {
  calculateTrackingIndex,
  getAverageFirstContactTime,
  getTicketsSinAtencion,
  getTecnicoDocumentacion,
  getSystemHealth,
} from "../utils/mockDashboard";

// Utilidades para métricas
function calculateKPIs(tickets, role, tecnico, sucursal) {
  const ahora = new Date();
  
  // Filtrar según rol
  let filteredTickets = tickets;
  if (role === ROLES.SOPORTE) {
    filteredTickets = tickets.filter(t => t.tecnicoAsignado === tecnico);
  } else if (role === ROLES.RESPONSABLE) {
    filteredTickets = tickets.filter(t => t.sucursal === sucursal);
  }

  // Tickets Abiertos (Abierto + En Proceso)
  const abiertos = filteredTickets.filter(
    t => t.estado === TICKET_STATUS.ABIERTO || t.estado === TICKET_STATUS.EN_PROCESO
  ).length;

  // Tiempo Promedio de Respuesta
  const avgResponse = getAverageFirstContactTime(filteredTickets);

  // Tickets resueltos en los últimos 30 días
  const hace30Dias = new Date(ahora.getTime() - 30 * 24 * 60 * 60 * 1000);
  const cerrados30Dias = filteredTickets.filter(t => {
    if (t.estado !== TICKET_STATUS.CERRADO) return false;
    const fechaCierre = new Date(t.fechaCreacion);
    return fechaCierre >= hace30Dias;
  }).length;

  // Tickets Resueltos
  const resueltos = filteredTickets.filter(t => t.estado === TICKET_STATUS.CERRADO).length;

  // Carga Actual (tickets en proceso)
  const enProceso = filteredTickets.filter(t => t.estado === TICKET_STATUS.EN_PROCESO).length;

  return { abiertos, avgResponse, cerrados30Dias, resueltos, enProceso, total: filteredTickets.length };
}

// Tickets por Prioridad
function getTicketsByPriority(tickets, role, tecnico, sucursal) {
  let filtered = tickets;
  if (role === ROLES.SOPORTE) {
    filtered = tickets.filter(t => t.tecnicoAsignado === tecnico);
  } else if (role === ROLES.RESPONSABLE) {
    filtered = tickets.filter(t => t.sucursal === sucursal);
  }

  const counts = { alta: 0, media: 0, baja: 0 };
  filtered.forEach(t => {
    if (t.prioridad === "alta" || t.prioridad === "ALTA") counts.alta++;
    else if (t.prioridad === "media" || t.prioridad === "MEDIA") counts.media++;
    else counts.baja++;
  });

  const max = Math.max(counts.alta, counts.media, counts.baja) || 1;
  return [
    { label: "Alta", count: counts.alta, percentage: (counts.alta / max) * 100, color: "bg-accent-pink" },
    { label: "Media", count: counts.media, percentage: (counts.media / max) * 100, color: "bg-accent-orange" },
    { label: "Baja", count: counts.baja, percentage: (counts.baja / max) * 100, color: "bg-purple-electric" },
  ];
}

// Áreas con más incidencias
function getTopAreas(tickets, role, tecnico, sucursal) {
  let filtered = tickets;
  if (role === ROLES.SOPORTE) {
    filtered = tickets.filter(t => t.tecnicoAsignado === tecnico);
  } else if (role === ROLES.RESPONSABLE) {
    filtered = tickets.filter(t => t.sucursal === sucursal);
  }

  const areas = {};
  filtered.forEach(t => {
    areas[t.area] = (areas[t.area] || 0) + 1;
  });

  return Object.entries(areas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([area, count]) => ({ area, count }));
}

// Tickets estancados (sin comentario > 48h)
function getStagnantTickets(tickets, role, tecnico, sucursal) {
  const ahora = new Date();
  const hace48h = new Date(ahora.getTime() - 48 * 60 * 60 * 1000);

  let filtered = tickets;
  if (role === ROLES.SOPORTE) {
    filtered = tickets.filter(t => t.tecnicoAsignado === tecnico);
  } else if (role === ROLES.RESPONSABLE) {
    filtered = tickets.filter(t => t.sucursal === sucursal);
  }

  return filtered.filter(ticket => {
    if (ticket.estado === TICKET_STATUS.CERRADO) return false;
    
    const fechaCreacion = new Date(ticket.fechaCreacion);
    const tieneComentarios = ticket.comentarios && ticket.comentarios.length > 0;
    
    if (!tieneComentarios) {
      return fechaCreacion < hace48h;
    } else {
      const ultimoComentario = new Date(ticket.comentarios[ticket.comentarios.length - 1].fecha);
      return ultimoComentario < hace48h;
    }
  }).slice(0, 5);
}

// KPI Card Component
function KPICard({ title, value, subtitle }) {
  return (
    <div className="glass-card rounded-2xl p-5 border border-dark-purple-700">
      <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
      <p className="text-3xl font-bold text-text-primary">{value}</p>
      {subtitle && <p className="text-text-muted text-xs mt-1">{subtitle}</p>}
    </div>
  );
}

// Bar Chart Horizontal
function BarChart({ data }) {
  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="w-12 text-xs text-text-secondary">{item.label}</span>
          <div className="flex-1 h-6 bg-dark-purple-800 rounded-xl overflow-hidden">
            <div
              className={`h-full ${item.color} rounded-xl`}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
          <span className="w-8 text-xs text-text-primary text-right font-medium">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

// Areas List
function AreasList({ areas }) {
  return (
    <div className="space-y-2">
      {areas.map((item, index) => (
        <div key={item.area} className="flex items-center justify-between py-2 border-b border-dark-purple-700 last:border-0">
          <div className="flex items-center gap-3">
            <span className="text-text-muted text-xs">0{index + 1}</span>
            <span className="text-text-primary text-sm">{item.area}</span>
          </div>
          <span className="text-text-primary text-sm font-medium">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

// Stagnant Tickets List
function StagnantTickets({ tickets }) {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 rounded-full bg-green-500/20 mx-auto mb-3 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-text-secondary">Todo al día</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          to={`/tickets/${ticket.id}`}
          className="flex items-center justify-between p-3 bg-dark-purple-700/30 hover:bg-dark-purple-700/50 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-accent-orange" />
            <div>
              <p className="text-text-primary text-sm">#{ticket.id}</p>
              <p className="text-text-muted text-xs truncate max-w-[200px]">{ticket.titulo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge priority={ticket.prioridad} />
            <span className="text-accent-orange text-xs font-medium">48h+</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Página principal
export function EstadisticasPage() {
  const { user, role } = useAuth();

  const tecnicoLogueado = user?.nombre || "Carlos Andres";
  const sucursalResponsable = "Sucursal Norte";

  const kpis = useMemo(() => calculateKPIs(mockTickets, role, tecnicoLogueado, sucursalResponsable), [role, tecnicoLogueado]);
  const priorityData = useMemo(() => getTicketsByPriority(mockTickets, role, tecnicoLogueado, sucursalResponsable), [role, tecnicoLogueado]);
  const topAreas = useMemo(() => getTopAreas(mockTickets, role, tecnicoLogueado, sucursalResponsable), [role, tecnicoLogueado]);
  const stagnantTickets = useMemo(() => getStagnantTickets(mockTickets, role, tecnicoLogueado, sucursalResponsable), [role, tecnicoLogueado]);

  // Calcular SLA (porcentaje de tickets resueltos a tiempo)
  const slaPercentage = kpis.total > 0 ? Math.round((kpis.cerrados30Dias / kpis.total) * 100) : 0;

  const getRoleTitle = () => {
    switch (role) {
      case ROLES.ADMIN: return "Dashboard General";
      case ROLES.RESPONSABLE: return `Operación - ${sucursalResponsable}`;
      case ROLES.SOPORTE: return "Mi Rendimiento";
      default: return "Estadísticas";
    }
  };

  const getRoleSubtitle = () => {
    switch (role) {
      case ROLES.ADMIN: return "Vista completa de todas las sucursales";
      case ROLES.RESPONSABLE: return "Estado de tu sucursal";
      case ROLES.SOPORTE: return "Tu actividad reciente";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-text-primary">Estadísticas</h1>
        <div>
          <p className="text-text-secondary mt-1">{getRoleTitle()}</p>
          <p className="text-text-muted text-sm">{getRoleSubtitle()}</p>
        </div>
      </div>

      {/* Nivel 1: KPIs Críticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Tickets Abiertos"
          value={kpis.abiertos}
          subtitle={`${kpis.enProceso} en proceso`}
        />
        <KPICard
          title="Tiempo de Respuesta"
          value={kpis.avgResponse > 0 ? `${kpis.avgResponse}h` : "N/A"}
          subtitle="Promedio hasta primer contacto"
        />
        <KPICard
          title="SLA de Resolución"
          value={`${slaPercentage}%`}
          subtitle={`${kpis.cerrados30Dias} resueltos (30 días)`}
        />
        <KPICard
          title="Carga Actual"
          value={kpis.enProceso}
          subtitle={`${kpis.resueltos} resueltos total`}
        />
      </div>

      {/* Nivel 2: Análisis Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets por Prioridad */}
        <div className="glass-card rounded-2xl p-6 border border-dark-purple-700">
          <h2 className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-4">
            Tickets por Prioridad
          </h2>
          <BarChart data={priorityData} />
        </div>

        {/* Áreas con más incidencias */}
        <div className="glass-card rounded-2xl p-6 border border-dark-purple-700">
          <h2 className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-4">
            Áreas con Más Incidencias
          </h2>
          {topAreas.length > 0 ? (
            <AreasList areas={topAreas} />
          ) : (
            <p className="text-text-muted text-sm">Sin datos</p>
          )}
        </div>
      </div>

      {/* Nivel 3: Accionables */}
      <div className="glass-card rounded-2xl p-6 border border-dark-purple-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-secondary text-xs font-medium uppercase tracking-wider">
            Atención Requerida
          </h2>
          {stagnantTickets.length > 0 && (
            <span className="px-3 py-1 bg-accent-orange/20 text-accent-orange text-xs font-medium rounded-full">
              {stagnantTickets.length} tickets
            </span>
          )}
        </div>
        <StagnantTickets tickets={stagnantTickets} />
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Badge } from "../components/ui/Badge";
import { MOCK_STATS, MOCK_RECENT_TICKETS, SUBTITLE_BY_ROLE } from "../utils/mockDashboard";
import { ROLES } from "../constants/roles";
import { PRIORIDAD } from "../constants/ticketPrioridad";
import { getUserDisplayName } from "../utils/userDisplay";

export function DashboardPage() {
  const { user, role } = useAuth();

  // Filtrar las 3 métricas principales según el rol
  const stats = MOCK_STATS[role]?.slice(0, 3) || [];
  const subtitle = SUBTITLE_BY_ROLE[role] || "Resumen general del sistema";

  const getRoleLabel = (rol) => {
    const labels = {
      [ROLES.ADMIN]: "Administrador",
      [ROLES.TECNICO]: "Tecnico",
      [ROLES.ENCARGADO]: "Encargado",
    };
    return labels[rol] || rol;
  };

  const getTrendIcon = (trend) => {
    if (trend === "up") {
      return (
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
        </svg>
      );
    }
    return (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-9.2 9.2M7 7v10h10" />
      </svg>
    );
  };

  const getStatIcon = (label) => {
    if (label.includes("Abiertos") || label.includes("Abierto")) {
      return (
        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    } else if (label.includes("Proceso") || label.includes("Proceso")) {
      return (
        <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    );
  };

  // Obtener tickets de prioridad alta para el widget de críticos
  const criticalTickets = MOCK_RECENT_TICKETS.filter(
    (ticket) => ticket.priority === PRIORIDAD.ALTA
  ).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header Minimalista */}
      <div className="flex flex-col gap-1 mb-8">
        <span className="text-sm font-medium text-purple-electric">Hola, {getUserDisplayName(user)}</span>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Tarjetas de Métricas - Grid Horizontal Uniforme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="glass-card rounded-xl p-4 hover:border-purple-electric/50 transition-all duration-200">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatIcon(stat.label)}
                  <p className="text-text-secondary text-xs">{stat.label}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs ${stat.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                  {getTrendIcon(stat.trend)}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Layout Dividido - Sin Scroll */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (70% - Tickets Recientes) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Tickets recientes
            </h2>
            <Link to="/tickets" className="text-purple-electric hover:text-purple-electric-hover text-sm font-medium transition-colors">
              Ver todos
            </Link>
          </div>
          
          <div className="space-y-3">
            {MOCK_RECENT_TICKETS.slice(0, 4).map((ticket) => (
              <Link 
                key={ticket.id} 
                to={`/tickets/${ticket.id}`}
                className="flex items-center justify-between p-4 bg-dark-purple-700/50 rounded-xl hover:bg-white/5 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-text-primary font-medium truncate">
                    #{ticket.id} - {ticket.title}
                  </p>
                  <p className="text-text-secondary text-sm mt-1">
                    {ticket.area} - Hace {ticket.time}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge priority={ticket.priority} />
                  <Badge status={ticket.status} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Columna Derecha (30% - Widget Tickets Críticos) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-5 border border-dark-purple-700">
            <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Tickets Criticos
            </h2>
            <div className="space-y-3">
              {criticalTickets.length > 0 ? (
                criticalTickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent-pink flex-shrink-0"></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary text-sm font-medium truncate">
                        #{ticket.id}
                      </p>
                      <p className="text-text-secondary text-xs truncate">
                        {ticket.title}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-text-muted text-sm">No hay tickets criticos</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

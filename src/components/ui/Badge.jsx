import { TICKET_STATUS } from "../../constants/ticketStatus";

// Ticket status styles
const statusStyles = {
  [TICKET_STATUS.ABIERTO]: "bg-accent-blue/20 text-accent-blue border border-accent-blue/30",
  [TICKET_STATUS.EN_PROCESO]: "bg-accent-orange/20 text-accent-orange border border-accent-orange/30",
  [TICKET_STATUS.CERRADO]: "bg-dark-purple-800 text-text-secondary border border-dark-purple-700",
};

// Sucursal status styles
const sucursalStatusStyles = {
  Activa: "bg-green-500/20 text-green-400 border border-green-500/30",
  Desactivada: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};

// Area status styles
const areaStatusStyles = {
  Activa: "bg-green-500/20 text-green-400 border border-green-500/30",
  Inactiva: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
};

const statusLabels = {
  [TICKET_STATUS.ABIERTO]: "Abierto",
  [TICKET_STATUS.EN_PROCESO]: "En proceso",
  [TICKET_STATUS.CERRADO]: "Cerrado",
};

const sucursalStatusLabels = {
  Activa: "Activa",
  Desactivada: "Desactivada",
};

const areaStatusLabels = {
  Activa: "Activa",
  Inactiva: "Inactiva",
};

const priorityStyles = {
  alta: "bg-accent-pink/20 text-accent-pink border border-accent-pink/30",
  media: "bg-accent-orange/20 text-accent-orange border border-accent-orange/30",
  baja: "bg-dark-purple-800 text-text-secondary border border-dark-purple-700",
};

const priorityLabels = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
};

export function Badge({ status, priority, sucursalStatus, areaStatus }) {
  // Priority badge
  if (priority) {
    const style = priorityStyles[priority] || "bg-dark-purple-800 text-text-secondary border border-dark-purple-700";
    const label = priorityLabels[priority] || priority;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
        {label}
      </span>
    );
  }

  // Area status badge
  if (areaStatus) {
    const style = areaStatusStyles[areaStatus] || "bg-dark-purple-800 text-text-secondary border border-dark-purple-700";
    const label = areaStatusLabels[areaStatus] || areaStatus;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
        {label}
      </span>
    );
  }

  // Sucursal status badge
  if (sucursalStatus) {
    const style = sucursalStatusStyles[sucursalStatus] || "bg-dark-purple-800 text-text-secondary border border-dark-purple-700";
    const label = sucursalStatusLabels[sucursalStatus] || sucursalStatus;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
        {label}
      </span>
    );
  }

  // Status badge (default)
  const style = statusStyles[status] || "bg-dark-purple-800 text-text-secondary border border-dark-purple-700";
  const label = statusLabels[status] || status;
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}>
      {label}
    </span>
  );
}

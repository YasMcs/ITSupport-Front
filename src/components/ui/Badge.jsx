import { TICKET_STATUS } from "../../constants/ticketStatus";

const statusStyles = {
  [TICKET_STATUS.ABIERTO]: {
    container: "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    dot: "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.45)]",
  },
  [TICKET_STATUS.EN_PROCESO]: {
    container: "border border-blue-400/20 bg-blue-500/10 text-blue-200",
    dot: "bg-blue-300 shadow-[0_0_12px_rgba(96,165,250,0.42)]",
  },
  [TICKET_STATUS.CERRADO]: {
    container: "border border-violet-400/20 bg-violet-500/10 text-violet-200",
    dot: "bg-violet-300 shadow-[0_0_12px_rgba(167,139,250,0.38)]",
  },
  [TICKET_STATUS.ANULADO]: {
    container: "border border-pink-400/20 bg-pink-500/10 text-pink-200",
    dot: "bg-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.42)]",
  },
};

const statusLabels = {
  [TICKET_STATUS.ABIERTO]: "Abierto",
  [TICKET_STATUS.EN_PROCESO]: "En proceso",
  [TICKET_STATUS.CERRADO]: "Cerrado",
  [TICKET_STATUS.ANULADO]: "Anulado",
};

const sucursalStatusStyles = {
  Activa: {
    container: "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    dot: "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.45)]",
  },
  Desactivada: {
    container: "border border-pink-400/20 bg-pink-500/10 text-pink-200",
    dot: "bg-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.38)]",
  },
};

const areaStatusStyles = {
  Activa: {
    container: "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    dot: "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.45)]",
  },
  Inactiva: {
    container: "border border-pink-400/20 bg-pink-500/10 text-pink-200",
    dot: "bg-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.38)]",
  },
};

const priorityStyles = {
  alta: {
    container: "border border-pink-400/20 bg-pink-500/10 text-pink-200",
    dot: "bg-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.42)]",
  },
  media: {
    container: "border border-orange-400/20 bg-orange-500/10 text-orange-200",
    dot: "bg-orange-300 shadow-[0_0_12px_rgba(251,146,60,0.42)]",
  },
  baja: {
    container: "border border-blue-400/20 bg-blue-500/10 text-blue-200",
    dot: "bg-blue-300 shadow-[0_0_12px_rgba(96,165,250,0.4)]",
  },
};

const accountStatusStyles = {
  activo: {
    container: "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    dot: "bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.45)]",
  },
  suspendido: {
    container: "border border-pink-400/20 bg-pink-500/10 text-pink-200",
    dot: "bg-pink-300 shadow-[0_0_12px_rgba(244,114,182,0.38)]",
  },
};

const priorityLabels = { alta: "Alta", media: "Media", baja: "Baja" };
const accountStatusLabels = { activo: "Activo", suspendido: "Suspendido" };

function Pill({ label, style }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${style.container}`}>
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      {label}
    </span>
  );
}

export function Badge({ status, priority, sucursalStatus, areaStatus, accountStatus }) {
  if (priority) {
    return <Pill label={priorityLabels[priority] || priority} style={priorityStyles[priority] || priorityStyles.baja} />;
  }

  if (areaStatus) {
    return <Pill label={areaStatus} style={areaStatusStyles[areaStatus] || areaStatusStyles.Inactiva} />;
  }

  if (sucursalStatus) {
    return <Pill label={sucursalStatus} style={sucursalStatusStyles[sucursalStatus] || sucursalStatusStyles.Desactivada} />;
  }

  if (accountStatus) {
    return <Pill label={accountStatusLabels[accountStatus] || accountStatus} style={accountStatusStyles[accountStatus] || accountStatusStyles.suspendido} />;
  }

  return <Pill label={statusLabels[status] || status} style={statusStyles[status] || statusStyles[TICKET_STATUS.CERRADO]} />;
}

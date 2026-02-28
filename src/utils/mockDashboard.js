import { ROLES } from "../constants/roles";
import { TICKET_STATUS } from "../constants/ticketStatus";
import { mockTickets } from "./mockTickets";

export const MOCK_STATS = {
  [ROLES.ADMIN]: [
    { id: 1, label: "Total Usuarios", value: "45", change: "+5%", trend: "up" },
    { id: 2, label: "Sucursales", value: "8", change: "+2%", trend: "up" },
    { id: 3, label: "Tickets Activos", value: "23", change: "-12%", trend: "down" },
    { id: 4, label: "Total Tickets", value: "156", change: "+8%", trend: "up" },
  ],
  [ROLES.SOPORTE]: [
    { id: 1, label: "Abiertos", value: "12", change: "-3%", trend: "down" },
    { id: 2, label: "En Proceso", value: "8", change: "+2%", trend: "up" },
    { id: 3, label: "Cerrados", value: "45", change: "+15%", trend: "up" },
    { id: 4, label: "Total Asignados", value: "65", change: "+10%", trend: "up" },
  ],
  [ROLES.RESPONSABLE]: [
    { id: 1, label: "Activos", value: "5", change: "-2%", trend: "down" },
    { id: 2, label: "Últimos Creados", value: "3", change: "+1", trend: "up" },
    { id: 3, label: "Cerrados", value: "18", change: "+5%", trend: "up" },
    { id: 4, label: "Total", value: "26", change: "+3%", trend: "up" },
  ],
};

export const MOCK_RECENT_TICKETS = [
  {
    id: 1023,
    title: "PC no enciende",
    area: "Informática",
    time: "2 horas",
    priority: "alta",
    status: TICKET_STATUS.ABIERTO,
    assignedTo: "Juan Pérez",
  },
  {
    id: 1022,
    title: "Error en impresoras de la oficina central",
    area: "Redes",
    time: "5 horas",
    priority: "media",
    status: TICKET_STATUS.EN_PROCESO,
    assignedTo: "María García",
  },
  {
    id: 1021,
    title: "Solicitud de instalación de software",
    area: "Software",
    time: "1 día",
    priority: "baja",
    status: TICKET_STATUS.CERRADO,
    assignedTo: "Carlos López",
  },
  {
    id: 1020,
    title: "Pantalla azul al iniciar sistema",
    area: "Hardware",
    time: "2 días",
    priority: "alta",
    status: TICKET_STATUS.ABIERTO,
    assignedTo: "Juan Pérez",
  },
  {
    id: 1019,
    title: "Solicitud de acceso a sistema contable",
    area: "Seguridad",
    time: "3 días",
    priority: "media",
    status: TICKET_STATUS.CERRADO,
    assignedTo: "María García",
  },
];

export const SUBTITLE_BY_ROLE = {
  [ROLES.ADMIN]: "Resumen general del sistema",
  [ROLES.SOPORTE]: "Resumen de tickets asignados",
  [ROLES.RESPONSABLE]: "Resumen de tus tickets",
};

// Datos adicionales para el dashboard
export const MOCK_ACTIVITY_LOG = [
  { id: 1, action: "Nuevo ticket creado", user: "Ana Martínez", time: "Hace 10 minutos" },
  { id: 2, action: "Ticket #1023 asignado", user: "Sistema", time: "Hace 30 minutos" },
  { id: 3, action: "Ticket #1021 cerrado", user: "Carlos López", time: "Hace 1 hora" },
  { id: 4, action: "Usuario registrado", user: "Admin", time: "Hace 2 horas" },
  { id: 5, action: "Nueva área creada: IA", user: "Admin", time: "Hace 3 horas" },
];

export const MOCK_QUICK_ACTIONS = {
  [ROLES.ADMIN]: [
    { label: "Crear usuario", path: "/usuarios/nuevo", icon: "user-plus" },
    { label: "Ver reportes", path: "/reportes", icon: "chart" },
    { label: "Configurar áreas", path: "/areas", icon: "settings" },
  ],
  [ROLES.SOPORTE]: [
    { label: "Ver mis tickets", path: "/tickets", icon: "list" },
    { label: "Estadísticas", path: "/estadisticas", icon: "chart" },
  ],
  [ROLES.RESPONSABLE]: [
    { label: "Nuevo ticket", path: "/tickets/nuevo", icon: "plus" },
    { label: "Mis tickets", path: "/tickets", icon: "list" },
  ],
};

// ==================== FUNCIONES DE MÉTRICAS DE COMENTARIOS ====================

/**
 * Calcula el índice de seguimiento: promedio de comentarios por ticket
 * @param {Array} tickets - Array de tickets
 * @returns {Object} - { promedio, enProcesoSinSegimiento, alert }
 */
export function calculateTrackingIndex(tickets) {
  if (!tickets || tickets.length === 0) {
    return { promedio: 0, enProcesoSinSeguimiento: 0, alert: false };
  }

  const totalComentarios = tickets.reduce((sum, ticket) => {
    return sum + (ticket.comentarios?.length || 0);
  }, 0);

  const promedio = (totalComentarios / tickets.length).toFixed(1);

  // Tickets en proceso sin comentarios o con muy pocos
  const enProcesoSinSeguimiento = tickets.filter(ticket => {
    const esEnProceso = ticket.estado === TICKET_STATUS.EN_PROCESO;
    const tieneComentarios = ticket.comentarios && ticket.comentarios.length > 0;
    return esEnProceso && !tieneComentarios;
  }).length;

  const alert = enProcesoSinSeguimiento > 0;

  return { promedio, enProcesoSinSeguimiento, alert };
}

/**
 * Calcula el tiempo de primer contacto (fechaCreacion -> primer comentario)
 * @param {Object} ticket - Ticket a analizar
 * @returns {number|null} - Horas hasta el primer contacto, o null si no hay comentarios
 */
export function calculateFirstContactTime(ticket) {
  if (!ticket.comentarios || ticket.comentarios.length === 0) {
    return null;
  }

  const fechaCreacion = new Date(ticket.fechaCreacion);
  const primerComentario = new Date(ticket.comentarios[0].fecha);

  const diffMs = primerComentario - fechaCreacion;
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));

  return diffHoras;
}

/**
 * Obtiene todos los comentarios recientes de los últimos N días
 * @param {Array} tickets - Array de tickets
 * @param {number} dias - Días hacia atrás
 * @returns {Array} - Comentarios ordenados por fecha
 */
export function getRecentComments(tickets, dias = 7) {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - dias);

  const todosComentarios = [];

  tickets.forEach(ticket => {
    if (ticket.comentarios && ticket.comentarios.length > 0) {
      ticket.comentarios.forEach(comentario => {
        const fechaComentario = new Date(comentario.fecha);
        if (fechaComentario >= fechaLimite) {
          todosComentarios.push({
            ...comentario,
            ticketId: ticket.id,
            ticketTitulo: ticket.titulo,
          });
        }
      });
    }
  });

  return todosComentarios.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

/**
 * Obtiene la actividad reciente filtrada por técnico
 * @param {Array} tickets - Array de tickets
 * @param {string|null} tecnico - Nombre del técnico (null = todos)
 * @param {number} limit - Límite de comentarios
 * @returns {Array} - Comentarios del técnico
 */
export function getTecnicoActivity(tickets, tecnico = null, limit = 10) {
  const comentarios = [];

  tickets.forEach(ticket => {
    if (ticket.comentarios && ticket.comentarios.length > 0) {
      ticket.comentarios.forEach(comentario => {
        if (!tecnico || comentario.autor === tecnico) {
          comentarios.push({
            ...comentario,
            ticketId: ticket.id,
            ticketTitulo: ticket.titulo,
          });
        }
      });
    }
  });

  return comentarios
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, limit);
}

/**
 * Obtiene ranking de técnicos más comunicativos (por cantidad de comentarios)
 * @param {Array} tickets - Array de tickets
 * @returns {Array} - Array de { tecnico, cantidad, ultimoComentario }
 */
export function getTecnicosMasComunicativos(tickets) {
  const tecnicosMap = {};

  tickets.forEach(ticket => {
    if (ticket.comentarios && ticket.comentarios.length > 0) {
      ticket.comentarios.forEach(comentario => {
        const autor = comentario.autor;
        if (!tecnicosMap[autor]) {
          tecnicosMap[autor] = {
            tecnico: autor,
            cantidad: 0,
            ultimoComentario: null,
          };
        }
        tecnicosMap[autor].cantidad += 1;
        
        // Actualizar último comentario
        const fechaComentario = new Date(comentario.fecha);
        if (!tecnicosMap[autor].ultimoComentario || 
            fechaComentario > new Date(tecnicosMap[autor].ultimoComentario)) {
          tecnicosMap[autor].ultimoComentario = comentario.fecha;
        }
      });
    }
  });

  return Object.values(tecnicosMap).sort((a, b) => b.cantidad - a.cantidad);
}

/**
 * Obtiene tickets sin atención técnica (abiertos sin comentarios)
 * @param {Array} tickets - Array de tickets
 * @param {string|null} sucursal - Filtrar por sucursal (null = todos)
 * @returns {Array} - Tickets sin comentarios
 */
export function getTicketsSinAtencion(tickets, sucursal = null) {
  return tickets.filter(ticket => {
    const tieneComentarios = ticket.comentarios && ticket.comentarios.length > 0;
    const matchSucursal = !sucursal || ticket.sucursal === sucursal;
    return !tieneComentarios && matchSucursal;
  });
}

/**
 * Calcula el porcentaje de documentación del técnico
 * @param {Array} tickets - Array de tickets
 * @param {string} tecnico - Nombre del técnico
 * @returns {Object} - { totalAsignados, conDocumentacion, porcentaje }
 */
export function getTecnicoDocumentacion(tickets, tecnico) {
  const misTickets = tickets.filter(t => t.tecnicoAsignado === tecnico);
  
  if (misTickets.length === 0) {
    return { totalAsignados: 0, conDocumentacion: 0, porcentaje: 0 };
  }

  const conDocumentacion = misTickets.filter(t => 
    t.comentarios && t.comentarios.length > 0
  ).length;

  return {
    totalAsignados: misTickets.length,
    conDocumentacion,
    porcentaje: Math.round((conDocumentacion / misTickets.length) * 100),
  };
}

/**
 * Obtiene el estado de salud del sistema basado en comentarios
 * @param {Array} tickets - Array de tickets
 * @returns {Object} - { verde, amarillo, rojo, total }
 */
export function getSystemHealth(tickets) {
  const ahora = new Date();
  const hace24h = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
  const hace48h = new Date(ahora.getTime() - 48 * 60 * 60 * 1000);
  const hace72h = new Date(ahora.getTime() - 72 * 60 * 60 * 1000);

  let verde = 0;
  let amarillo = 0;
  let rojo = 0;

  tickets.forEach(ticket => {
    if (ticket.estado === TICKET_STATUS.CERRADO) return;

    const fechaCreacion = new Date(ticket.fechaCreacion);
    const tieneComentarios = ticket.comentarios && ticket.comentarios.length > 0;
    
    if (tieneComentarios) {
      const ultimoComentario = new Date(
        ticket.comentarios[ticket.comentarios.length - 1].fecha
      );

      if (ultimoComentario >= hace24h) {
        verde++; // Comentario reciente (< 24h)
      } else if (ultimoComentario >= hace48h) {
        amarillo++; // Sin comentario entre 24-48h
      } else {
        rojo++; // Sin comentario > 48h
      }
    } else {
      // Sin comentarios
      if (fechaCreacion >= hace72h) {
        rojo++; // Abierto > 72h sin comentario
      } else if (fechaCreacion >= hace48h) {
        amarillo++; // Abierto entre 48-72h
      }
      // Los abiertos < 48h sin comentarios no cuentan como rojo/amarillo
    }
  });

  return { verde, amarillo, rojo, total: verde + amarillo + rojo };
}

/**
 * Calcula métricas de tiempo de primer contacto promedio
 * @param {Array} tickets - Array de tickets
 * @returns {number} - Promedio de horas hasta primer contacto
 */
export function getAverageFirstContactTime(tickets) {
  const tiempos = tickets
    .map(t => calculateFirstContactTime(t))
    .filter(t => t !== null);

  if (tiempos.length === 0) return 0;

  const suma = tiempos.reduce((a, b) => a + b, 0);
  return Math.round(suma / tiempos.length);
}

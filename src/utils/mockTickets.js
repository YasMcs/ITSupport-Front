import { TICKET_STATUS } from "../constants/ticketStatus";
import { PRIORIDAD } from "../constants/ticketPrioridad";
import {
  enrichMockUser,
  getAreaById,
  getUserDisplayName,
  getMockUserById,
} from "./mockUsers";

export { PRIORIDAD };

export const mockTickets = [
  {
    id: "1023",
    titulo: "PC no enciende",
    descripcion: "La computadora del area de contabilidad no enciende desde esta manana.",
    prioridad: PRIORIDAD.ALTA,
    estado: TICKET_STATUS.ABIERTO,
    encargado_id: 2,
    tecnico_id: 3,
    area_id: 5,
    fecha_creacion: "2026-02-18",
    historial: [
      { fecha: "2026-02-18", accion: "Ticket creado", tecnico_id: null },
      { fecha: "2026-02-19", accion: "Estado cambiado a en_proceso", tecnico_id: 3 },
    ],
    comentarios: [
      { id: 1, contenido: "Revisando el equipo.", ticket_id: "1023", usuario_id: 3, fecha: "2026-02-19" },
    ],
  },
  {
    id: "1024",
    titulo: "Error en sistema de nomina",
    descripcion: "El sistema de nomina muestra un error 500 al intentar generar las nominas del mes.",
    prioridad: PRIORIDAD.ALTA,
    estado: TICKET_STATUS.EN_PROCESO,
    encargado_id: 2,
    tecnico_id: 4,
    area_id: 4,
    fecha_creacion: "2026-02-17",
    historial: [
      { fecha: "2026-02-17", accion: "Ticket creado", tecnico_id: null },
      { fecha: "2026-02-18", accion: "Estado cambiado a en_proceso", tecnico_id: 4 },
    ],
    comentarios: [
      { id: 2, contenido: "El servidor de base de datos tiene alta carga. Investigando.", ticket_id: "1024", usuario_id: 4, fecha: "2026-02-18" },
    ],
  },
  {
    id: "1025",
    titulo: "Impresora atascada",
    descripcion: "La impresora del segundo piso esta atascada y no imprime.",
    prioridad: PRIORIDAD.MEDIA,
    estado: TICKET_STATUS.CERRADO,
    encargado_id: 2,
    tecnico_id: 3,
    area_id: 6,
    fecha_creacion: "2026-02-15",
    historial: [
      { fecha: "2026-02-15", accion: "Ticket creado", tecnico_id: null },
      { fecha: "2026-02-16", accion: "Estado cambiado a en_proceso", tecnico_id: 3 },
      { fecha: "2026-02-17", accion: "Estado cambiado a cerrado", tecnico_id: 3 },
    ],
    comentarios: [
      { id: 3, contenido: "Se limpio el rodillo de alimentacion.", ticket_id: "1025", usuario_id: 3, fecha: "2026-02-16" },
      { id: 4, contenido: "Problema resuelto. Impresora funcionando correctamente.", ticket_id: "1025", usuario_id: 3, fecha: "2026-02-17" },
    ],
  },
  {
    id: "1026",
    titulo: "Solicitud de software de diseno",
    descripcion: "Se necesita instalar Adobe Creative Cloud en la workstation de diseno.",
    prioridad: PRIORIDAD.BAJA,
    estado: TICKET_STATUS.ABIERTO,
    encargado_id: 5,
    tecnico_id: null,
    area_id: 10,
    fecha_creacion: "2026-02-20",
    historial: [{ fecha: "2026-02-20", accion: "Ticket creado", tecnico_id: null }],
    comentarios: [],
  },
  {
    id: "1027",
    titulo: "Conexion VPN lenta",
    descripcion: "La conexion VPN desde casa funciona extremadamente lenta y dificulta el trabajo remoto.",
    prioridad: PRIORIDAD.MEDIA,
    estado: TICKET_STATUS.EN_PROCESO,
    encargado_id: 2,
    tecnico_id: 4,
    area_id: 8,
    fecha_creacion: "2026-02-19",
    historial: [
      { fecha: "2026-02-19", accion: "Ticket creado", tecnico_id: null },
      { fecha: "2026-02-20", accion: "Estado cambiado a en_proceso", tecnico_id: 4 },
    ],
    comentarios: [
      { id: 5, contenido: "Verificando configuracion de red y ancho de banda.", ticket_id: "1027", usuario_id: 4, fecha: "2026-02-20" },
    ],
  },
  {
    id: "1028",
    titulo: "Teclado defectuoso",
    descripcion: "Algunas teclas no responden en el teclado del area de ventas.",
    prioridad: PRIORIDAD.BAJA,
    estado: TICKET_STATUS.ABIERTO,
    encargado_id: 5,
    tecnico_id: 3,
    area_id: 11,
    fecha_creacion: "2026-02-21",
    historial: [{ fecha: "2026-02-21", accion: "Ticket creado", tecnico_id: null }],
    comentarios: [],
  },
];

export function getTicketArea(ticket) {
  return getAreaById(ticket.area_id);
}

export function getEncargado(ticket) {
  return enrichMockUser(getMockUserById(ticket.encargado_id));
}

export function getTecnico(ticket) {
  return enrichMockUser(getMockUserById(ticket.tecnico_id));
}

export function getComentarioAutor(comentario) {
  return enrichMockUser(getMockUserById(comentario.usuario_id));
}

export function enrichTicket(ticket) {
  const area = getTicketArea(ticket);
  const encargado = getEncargado(ticket);
  const tecnico = getTecnico(ticket);

  return {
    ...ticket,
    area: area?.nombreArea ?? "Sin area",
    sucursal: area?.nombreSucursal ?? "Sin sucursal",
    encargado: getUserDisplayName(encargado) ?? "Sin encargado",
    tecnico: ticket.tecnico_id ? getUserDisplayName(tecnico) : "Sin tecnico",
    fechaCreacion: ticket.fecha_creacion,
    tecnicoAsignado: ticket.tecnico_id ? getUserDisplayName(tecnico) : null,
    responsable: getUserDisplayName(encargado),
    contacto: encargado?.email ?? "",
    comentarios: (ticket.comentarios ?? []).map((comentario) => ({
      ...comentario,
      autor: getUserDisplayName(getComentarioAutor(comentario)) ?? "Sistema",
      texto: comentario.contenido,
    })),
    historial: (ticket.historial ?? []).map((item) => ({
      ...item,
      tecnico: item.tecnico_id ? getUserDisplayName(enrichMockUser(getMockUserById(item.tecnico_id))) : null,
    })),
  };
}

export function getEnrichedMockTickets() {
  return mockTickets.map(enrichTicket);
}

export const AREAS = Array.from(
  new Set(mockTickets.map((ticket) => getTicketArea(ticket)?.nombreArea).filter(Boolean))
);

export const SUCURSALES = Array.from(
  new Set(mockTickets.map((ticket) => getTicketArea(ticket)?.nombreSucursal).filter(Boolean))
);

export const TECNICOS = Array.from(
  new Map(
    mockTickets
      .map((ticket) => getTecnico(ticket))
      .filter(Boolean)
      .map((user) => [user.id, { id: user.id, nombre: getUserDisplayName(user) }])
  ).values()
);

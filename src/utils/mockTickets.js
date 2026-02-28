import { TICKET_STATUS } from "../constants/ticketStatus";
import { PRIORIDAD } from "../constants/ticketPrioridad";

export { PRIORIDAD };

export const SUCURSALES = [
  "Sucursal Norte",
  "Sucursal Sur",
  "Sucursal Centro",
  "Sucursal Este",
  "Sucursal Oeste",
];

export const AREAS = [
  "Recursos Humanos",
  "Contabilidad",
  "Ventas",
  "Marketing",
  "Tecnología",
  "Operaciones",
];

export const TECNICOS = [
  { id: 1, nombre: "Carlos Ruiz" },
  { id: 2, nombre: "María García" },
  { id: 3, nombre: "Pedro Sánchez" },
  { id: 4, nombre: "Ana Martínez" },
];

export const mockTickets = [
  {
    id: "1023",
    titulo: "PC no enciende",
    descripcion: "La computadora del área de contabilidad no enciende desde esta mañana.",
    area: "Contabilidad",
    sucursal: "Sucursal Norte",
    prioridad: PRIORIDAD.ALTA,
    estado: TICKET_STATUS.ABIERTO,
    tecnicoAsignado: "Carlos Andres",
    responsable: "Juan Pedro",
    contacto: "juan@empresa.com",
    fechaCreacion: "2026-02-18",
    historial: [
      { fecha: "2026-02-18", accion: "Ticket creado", tecnico: null },
      { fecha: "2026-02-19", accion: "Estado cambiado a En proceso", tecnico: "Carlos Andres" },
    ],
    comentarios: [
      { autor: "Carlos Andres", fecha: "2026-02-19", texto: "Revisando el equipo." },
    ],
  },
  {
    id: "1024",
    titulo: "Error en sistema de nómina",
    descripcion: "El sistema de nómina muestra un error 500 al intentar generar las nóminas del mes.",
    area: "Recursos Humanos",
    sucursal: "Sucursal Centro",
    prioridad: PRIORIDAD.ALTA,
    estado: TICKET_STATUS.EN_PROCESO,
    tecnicoAsignado: "Ana",
    responsable: "Juan Pedro",
    contacto: "laura@empresa.com",
    fechaCreacion: "2026-02-17",
    historial: [
      { fecha: "2026-02-17", accion: "Ticket creado", tecnico: null },
      { fecha: "2026-02-18", accion: "Estado cambiado a En proceso", tecnico: "Ana" },
    ],
    comentarios: [
      { autor: "Ana", fecha: "2026-02-18", texto: "El servidor de base de datos tiene alta carga. Investigando." },
    ],
  },
  {
    id: "1025",
    titulo: "Impresora atascada",
    descripcion: "La impresora del segundo piso está atascada y no imprime.",
    area: "Operaciones",
    sucursal: "Sucursal Sur",
    prioridad: PRIORIDAD.MEDIA,
    estado: TICKET_STATUS.CERRADO,
    tecnicoAsignado: "Carlos Andres",
    responsable: "Juan Pedro",
    contacto: "mario@empresa.com",
    fechaCreacion: "2026-02-15",
    historial: [
      { fecha: "2026-02-15", accion: "Ticket creado", tecnico: null },
      { fecha: "2026-02-16", accion: "Estado cambiado a En proceso", tecnico: "Carlos Andres" },
      { fecha: "2026-02-17", accion: "Estado cambiado a Cerrado", tecnico: "Carlos Andres" },
    ],
    comentarios: [
      { autor: "Carlos Andres", fecha: "2026-02-16", texto: "Se limpió el rodillo de alimentación." },
      { autor: "Carlos Andres", fecha: "2026-02-17", texto: "Problema resuelto. Impresora funcionando correctamente." },
    ],
  },
  {
    id: "1026",
    titulo: "Solicitud de software de diseño",
    descripcion: "Se necesita instalar Adobe Creative Cloud en la workstation de diseño.",
    area: "Marketing",
    sucursal: "Sucursal Este",
    prioridad: PRIORIDAD.BAJA,
    estado: TICKET_STATUS.ABIERTO,
    tecnicoAsignado: null,
    responsable: "Juan Pedro",
    contacto: "sofia@empresa.com",
    fechaCreacion: "2026-02-20",
    historial: [
      { fecha: "2026-02-20", accion: "Ticket creado", tecnico: null },
    ],
    comentarios: [],
  },
  {
    id: "1027",
    titulo: "Conexión VPN lenta",
    descripcion: "La conexión VPN desde casa funciona extremadamente lenta, dificultando el trabajo remoto.",
    area: "Tecnología",
    sucursal: "Sucursal Norte",
    prioridad: PRIORIDAD.MEDIA,
    estado: TICKET_STATUS.EN_PROCESO,
    tecnicoAsignado: "Ana",
    responsable: "Juan Pedro",
    contacto: "roberto@empresa.com",
    fechaCreacion: "2026-02-19",
    historial: [
      { fecha: "2026-02-19", accion: "Ticket creado", tecnico: null },
      { fecha: "2026-02-20", accion: "Estado cambiado a En proceso", tecnico: "Ana" },
    ],
    comentarios: [
      { autor: "Ana", fecha: "2026-02-20", texto: "Verificando configuración de red y ancho de banda." },
    ],
  },
  {
    id: "1028",
    titulo: "Teclado defectuoso",
    descripcion: "Algunas teclas no responden en el teclado del área de ventas.",
    area: "Ventas",
    sucursal: "Sucursal Oeste",
    prioridad: PRIORIDAD.BAJA,
    estado: TICKET_STATUS.ABIERTO,
    tecnicoAsignado: "Carlos Andres",
    responsable: "Juan Pedro",
    contacto: "patricia@empresa.com",
    fechaCreacion: "2026-02-21",
    historial: [
      { fecha: "2026-02-21", accion: "Ticket creado", tecnico: null },
    ],
    comentarios: [],
  },
];

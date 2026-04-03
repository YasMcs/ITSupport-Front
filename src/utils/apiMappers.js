function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function normalizeAccountState(state) {
  const value = String(state || "").toLowerCase();
  if (value.includes("suspend")) return "suspendido";
  return "activo";
}

function normalizeCatalogState(state, activeLabel, inactiveLabel) {
  const value = String(state || "").toLowerCase();
  if (value.includes("desact") || value.includes("inact")) return inactiveLabel;
  return activeLabel;
}

function normalizeTicketStatus(status) {
  const value = String(status || "").toLowerCase();
  if (value === "abierta" || value === "abierto") return "abierto";
  if (value === "en_proceso" || value === "en proceso" || value === "asignado") return "en_proceso";
  if (value === "cerrada" || value === "cerrado" || value === "resuelto") return "cerrado";
  if (value === "anulada" || value === "anulado") return "anulado";
  return "abierto";
}

export function normalizeRole(role) {
  return String(role || "").toLowerCase();
}

export function normalizeUser(user = {}) {
  return {
    id: firstDefined(user.id, user.usuarioId),
    nombre: firstDefined(user.nombre, user.nombres, user.firstName, user.nombreUsuario, ""),
    apellido_paterno: firstDefined(user.apellido_paterno, user.apellidoPaterno, user.apellido1, ""),
    apellido_materno: firstDefined(user.apellido_materno, user.apellidoMaterno, user.apellido2, ""),
    nombre_usuario: firstDefined(user.nombre_usuario, user.nombreUsuario, user.username, ""),
    email: firstDefined(user.email, user.correo, ""),
    rol: normalizeRole(firstDefined(user.rol, user.role)),
    estado_cuenta: normalizeAccountState(firstDefined(user.estado_cuenta, user.estadoCuenta, user.estado, "activo")),
    area_id: firstDefined(user.area_id, user.areaId, user.idArea, null),
    sucursal_id: firstDefined(user.sucursal_id, user.sucursalId, user.idSucursal, null),
    area: firstDefined(user.area, user.nombreArea, user.areaNombre, null),
    sucursal: firstDefined(user.sucursal, user.nombreSucursal, user.sucursalNombre, null),
    ticketsActivos: firstDefined(user.ticketsActivos, user.tickets_activos, 0),
    ticketsCreados: firstDefined(user.ticketsCreados, user.tickets_creados, 0),
    ticketsResueltos: firstDefined(user.ticketsResueltos, user.tickets_resueltos, 0),
  };
}

export function normalizeSucursal(sucursal = {}) {
  const direccionFisica = firstDefined(sucursal.direccionFisica, sucursal.direccion, sucursal.domicilio, "");
  const horarioOperacion = firstDefined(
    sucursal.horarioOperacion,
    sucursal.horario_operacion,
    sucursal.horario,
    ""
  );

  return {
    id: firstDefined(sucursal.id, sucursal.sucursalId),
    nombre: firstDefined(sucursal.nombre, sucursal.nombreSucursal, ""),
    zona: firstDefined(sucursal.zona, sucursal.colonia, ""),
    direccion: direccionFisica,
    direccionFisica,
    contacto: firstDefined(sucursal.contacto, sucursal.encargado, ""),
    telefono: firstDefined(sucursal.telefono, sucursal.telefonoDirecto, ""),
    extension: firstDefined(sucursal.extension, sucursal.extensionInterna, ""),
    horaApertura: firstDefined(sucursal.horaApertura, sucursal.hora_apertura, ""),
    horaCierre: firstDefined(sucursal.horaCierre, sucursal.hora_cierre, ""),
    horarioOperacion,
    estado: normalizeCatalogState(firstDefined(sucursal.estado, sucursal.estatus, "ACTIVA"), "Activa", "Desactivada"),
    usuariosCount: firstDefined(sucursal.usuariosCount, sucursal.totalUsuarios, 0),
    areasCount: firstDefined(sucursal.areasCount, sucursal.totalAreas, 0),
    totalTickets: firstDefined(sucursal.totalTickets, 0),
    areasNombres: Array.isArray(sucursal.areasNombres) ? sucursal.areasNombres : [],
  };
}

export function normalizeArea(area = {}) {
  return {
    id: firstDefined(area.id, area.areaId),
    nombreArea: firstDefined(area.nombreArea, area.nombre, ""),
    nombreSucursal: firstDefined(area.nombreSucursal, area.sucursalNombre, area.sucursal?.nombre, ""),
    sucursalId: firstDefined(area.sucursalId, area.idSucursal, area.sucursal?.id, ""),
    estado: normalizeCatalogState(firstDefined(area.estado, area.estatus, "ACTIVA"), "Activa", "Inactiva"),
    encargadoId: firstDefined(area.encargadoId, area.usuarioId, null),
    encargadoNombre: firstDefined(area.encargadoNombre, null),
    totalTickets: firstDefined(area.totalTickets, 0),
  };
}

export function normalizeComment(comment = {}) {
  return {
    id: firstDefined(comment.id, comment.comentarioId),
    ticket_id: firstDefined(comment.ticket_id, comment.ticketId, comment.idTicket),
    usuario_id: firstDefined(comment.usuario_id, comment.usuarioId, comment.idUsuario),
    autor: firstDefined(comment.autor, comment.usuarioNombre, comment.nombreUsuario, comment.usuario, "Sistema"),
    contenido: firstDefined(comment.contenido, comment.texto, comment.comentario, ""),
    texto: firstDefined(comment.texto, comment.contenido, comment.comentario, ""),
    fecha: firstDefined(comment.fecha, comment.fechaCreacion, comment.createdAt, comment.created_at, ""),
  };
}

export function normalizeTicket(ticket = {}) {
  return {
    id: String(firstDefined(ticket.id, ticket.ticketId, "")),
    titulo: firstDefined(ticket.titulo, ticket.title, ""),
    descripcion: firstDefined(ticket.descripcion, ticket.description, ""),
    prioridad: String(firstDefined(ticket.prioridad, ticket.priority, "media")).toLowerCase(),
    estado: normalizeTicketStatus(firstDefined(ticket.estado, ticket.status, "abierto")),
    tecnico_id: firstDefined(ticket.tecnico_id, ticket.tecnicoId, ticket.idTecnico, null),
    encargado_id: firstDefined(ticket.encargado_id, ticket.encargadoId, ticket.idEncargado, null),
    area_id: firstDefined(ticket.area_id, ticket.areaId, ticket.idArea, null),
    sucursal_id: firstDefined(ticket.sucursal_id, ticket.sucursalId, ticket.idSucursal, null),
    tecnicoAsignado: firstDefined(ticket.tecnicoAsignado, ticket.tecnicoNombre, ticket.tecnico, ticket.nombreTecnico, null),
    tecnico: firstDefined(ticket.tecnico, ticket.tecnicoNombre, ticket.tecnicoAsignado, ticket.nombreTecnico, null),
    encargado: firstDefined(ticket.encargado, ticket.encargadoNombre, ticket.nombreEncargado, ticket.responsable, null),
    area: firstDefined(ticket.area, ticket.areaNombre, ticket.nombreArea, null),
    sucursal: firstDefined(ticket.sucursal, ticket.sucursalNombre, ticket.nombreSucursal, null),
    contacto: firstDefined(ticket.contacto, ticket.encargadoEmail, ticket.nombreContacto, null),
    fechaCreacion: firstDefined(ticket.fechaCreacion, ticket.fecha_creacion, ticket.createdAt, ticket.created_at, ""),
    fechaAsignacion: firstDefined(ticket.fechaAsignacion, ""),
    fechaCierre: firstDefined(ticket.fechaCierre, ""),
    createdAt: firstDefined(ticket.createdAt, ticket.created_at, ticket.fechaCreacion, ticket.fecha_creacion, ""),
    numeroComentarios: firstDefined(ticket.numeroComentarios, ticket.comentarios?.length, 0),
    tipoAsignacion: firstDefined(ticket.tipoAsignacion, null),
    minutosEsperando: firstDefined(ticket.minutosEsperando, 0),
    esVencido: Boolean(firstDefined(ticket.esVencido, false)),
    historial: Array.isArray(ticket.historial) ? ticket.historial : [],
    comentarios: Array.isArray(ticket.comentarios) ? ticket.comentarios.map(normalizeComment) : [],
  };
}

export function buildUserPayload(payload = {}) {
  return {
    nombreUsuario: payload.nombre_usuario,
    email: payload.email,
    contrasena: payload.contrasena_hash,
    rol: String(payload.rol || "").toLowerCase(),
    areaId: payload.area_id,
  };
}

export function buildAreaPayload(payload = {}) {
  return {
    nombre: payload.nombreArea,
    sucursalId: Number(payload.sucursalId),
  };
}

export function buildSucursalPayload(payload = {}) {
  return {
    nombre: payload.nombre,
    direccionFisica: payload.direccionFisica ?? payload.direccion ?? "",
    telefono: payload.telefono ?? "",
    horarioOperacion: payload.horarioOperacion ?? "",
    zona: payload.zona ?? "",
  };
}

export function buildTicketPayload(payload = {}) {
  return {
    titulo: payload.titulo,
    descripcion: payload.descripcion,
    prioridad: payload.prioridad,
    areaId: payload.area_id,
    encargadoId: payload.encargado_id,
  };
}

export function buildCommentPayload(payload = {}) {
  return {
    contenido: payload.contenido,
    ticketId: payload.ticket_id,
    usuarioId: payload.usuario_id,
  };
}

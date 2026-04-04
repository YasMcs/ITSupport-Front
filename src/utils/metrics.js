import { TICKET_STATUS } from "../constants/ticketStatus";

/**
 * Calcula el índice de seguimiento: promedio de comentarios por ticket
 */
export function calculateTrackingIndex(tickets) {
  if (!tickets || tickets.length === 0) {
    return { promedio: 0, enProcesoSinSeguimiento: 0, alert: false };
  }

  const totalComentarios = tickets.reduce((sum, ticket) => {
    return sum + (ticket.comentarios?.length || 0);
  }, 0);

  const promedio = (totalComentarios / tickets.length).toFixed(1);

  const enProcesoSinSeguimiento = tickets.filter(ticket => {
    const esEnProceso = ticket.estado === TICKET_STATUS.EN_PROCESO;
    const tieneComentarios = ticket.comentarios && ticket.comentarios.length > 0;
    return esEnProceso && !tieneComentarios;
  }).length;

  return { promedio, enProcesoSinSeguimiento, alert: enProcesoSinSeguimiento > 0 };
}

/**
 * Calcula el tiempo de primer contacto (fechaCreacion -> primer comentario)
 */
export function calculateFirstContactTime(ticket) {
  if (!ticket.comentarios || ticket.comentarios.length === 0 || !ticket.fechaCreacion) {
    return null;
  }

  const fechaCreacion = new Date(ticket.fechaCreacion);
  const primerComentario = new Date(ticket.comentarios[0].fecha);

  const diffMs = primerComentario - fechaCreacion;
  return Math.floor(diffMs / (1000 * 60 * 60));
}

/**
 * Obtiene el estado de salud del sistema basado en la frescura de los comentarios
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

      if (ultimoComentario >= hace24h) verde++;
      else if (ultimoComentario >= hace48h) amarillo++;
      else rojo++;
    } else {
      if (fechaCreacion >= hace72h) rojo++;
      else if (fechaCreacion >= hace48h) amarillo++;
    }
  });

  return { verde, amarillo, rojo, total: verde + amarillo + rojo };
}

/**
 * Obtiene ranking de técnicos más comunicativos
 */
export function getTecnicosMasComunicativos(tickets) {
  const tecnicosMap = {};

  tickets.forEach(ticket => {
    if (ticket.comentarios?.length > 0) {
      ticket.comentarios.forEach(comentario => {
        const autor = comentario.autor;
        if (!autor || autor === "Sistema") return;
        
        if (!tecnicosMap[autor]) {
          tecnicosMap[autor] = { tecnico: autor, cantidad: 0, ultimoComentario: null };
        }
        tecnicosMap[autor].cantidad += 1;
        
        const fechaComentario = new Date(comentario.fecha);
        if (!tecnicosMap[autor].ultimoComentario || fechaComentario > new Date(tecnicosMap[autor].ultimoComentario)) {
          tecnicosMap[autor].ultimoComentario = comentario.fecha;
        }
      });
    }
  });

  return Object.values(tecnicosMap).sort((a, b) => b.cantidad - a.cantidad);
}

/**
 * Obtiene los comentarios recientes de forma global
 */
export function getRecentComments(tickets, dias = 7) {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - dias);

  return tickets.flatMap(ticket => 
    (ticket.comentarios || [])
      .filter(c => new Date(c.fecha) >= fechaLimite)
      .map(c => ({ ...c, ticketId: ticket.id, ticketTitulo: ticket.titulo }))
  ).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

/**
 * Filtra tickets que no han recibido atención inicial
 */
export function getTicketsSinAtencion(tickets, sucursal = null) {
  return tickets.filter(ticket => {
    const tieneComentarios = ticket.comentarios && ticket.comentarios.length > 0;
    const matchSucursal = !sucursal || ticket.sucursal === sucursal;
    return !tieneComentarios && matchSucursal && ticket.estado !== TICKET_STATUS.CERRADO;
  });
}

/**
 * Calcula el porcentaje de tickets documentados de un técnico
 */
export function getTecnicoDocumentacion(tickets, tecnicoNombre) {
  const misTickets = tickets.filter(t => t.tecnicoAsignado === tecnicoNombre || t.tecnico === tecnicoNombre);
  
  if (misTickets.length === 0) return { totalAsignados: 0, conDocumentacion: 0, porcentaje: 0 };

  const conDocumentacion = misTickets.filter(t => t.comentarios?.length > 0).length;

  return {
    totalAsignados: misTickets.length,
    conDocumentacion,
    porcentaje: Math.round((conDocumentacion / misTickets.length) * 100),
  };
}

export function getAverageFirstContactTime(tickets) {
  const tiempos = tickets
    .map(t => calculateFirstContactTime(t))
    .filter(t => t !== null);

  if (tiempos.length === 0) return 0;
  return Math.round(tiempos.reduce((a, b) => a + b, 0) / tiempos.length);
}
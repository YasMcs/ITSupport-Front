import { Draggable } from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/formatDate";

export function KanbanCard({ ticket, index }) {
  // Función para obtener la fecha formateada o "Hace cuánto"
  const getTimeAgo = (fecha) => {
    const fechaCreacion = new Date(fecha);
    const ahora = new Date();
    const diffTime = Math.abs(ahora - fechaCreacion);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return formatDate(fecha);
  };

  return (
    <Draggable draggableId={ticket.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            group
            bg-dark-purple-800 
            border border-dark-purple-700 
            rounded-xl 
            p-4 
            transition-all 
            duration-200
            hover:bg-dark-purple-700
            ${snapshot.isDragging ? "bg-dark-purple-700 shadow-lg shadow-purple-electric/20 rotate-2" : ""}
          `}
        >
          <Link to={`/tickets/${ticket.id}`} className="block">
            {/* ID y Título */}
            <div className="flex items-start justify-between mb-3">
              <span className="text-xs font-mono text-text-muted">
                #{ticket.id}
              </span>
            </div>
            
            <h3 className="text-text-primary font-semibold text-sm mb-2 line-clamp-2">
              {ticket.titulo}
            </h3>

            {/* Fecha / Hace cuánto */}
            <p className="text-xs text-text-muted mb-3">
              {getTimeAgo(ticket.fechaCreacion)}
            </p>

            {/* Área y Prioridad */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-purple-700/50">
              <span className="text-xs text-text-muted">
                {ticket.area}
              </span>
              <Badge priority={ticket.prioridad} />
            </div>
          </Link>
        </div>
      )}
    </Draggable>
  );
}

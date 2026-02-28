import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/formatDate";

export function TicketDetail({ ticket }) {
  if (!ticket) return null;
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-dark-purple-800 border border-dark-purple-700 rounded-2xl p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-text-primary">{ticket.titulo}</h2>
          <Badge status={ticket.estado} />
        </div>
        <p className="text-text-secondary leading-relaxed">{ticket.descripcion}</p>
        <div className="mt-6 pt-4 border-t border-dark-purple-700">
          <p className="text-sm text-text-muted">
            Creado: <span className="text-text-secondary">{formatDate(ticket.createdAt)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

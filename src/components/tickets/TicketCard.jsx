import { Link } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/formatDate";

export function TicketCard({ ticket }) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block p-5 glass-card rounded-2xl hover:bg-dark-purple-700 hover:border-purple-electric/30 transition-all duration-200 hover:shadow-lg hover:shadow-purple-electric/10"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-text-primary">{ticket.titulo}</h3>
        <Badge status={ticket.estado} />
      </div>
      <p className="text-sm text-text-muted">{formatDate(ticket.createdAt)}</p>
    </Link>
  );
}

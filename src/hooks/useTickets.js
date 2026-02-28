import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import { ticketService } from "../services/ticketService";
import { ROLES } from "../constants/roles";

export function useTickets() {
  const { role } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchTickets() {
      setLoading(true);
      try {
        const data = await ticketService.getAll();
        if (!cancelled) {
          const filtered = filterByRole(Array.isArray(data) ? data : data?.data ?? [], role);
          setTickets(filtered);
        }
      } catch (err) {
        // Dev: si el backend no está disponible, usar datos mock
        if (import.meta.env.DEV && !cancelled) {
          setTickets([
            { id: 1, titulo: "Ticket de ejemplo", descripcion: "Descripción", estado: "abierto", createdAt: new Date().toISOString() },
          ]);
        } else if (!cancelled) {
          setTickets([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchTickets();
    return () => { cancelled = true; };
  }, [role]);

  return { tickets, loading };
}

function filterByRole(tickets, role) {
  if (role === ROLES.ADMIN) return tickets;
  if (role === ROLES.SOPORTE) return tickets;
  return tickets;
}

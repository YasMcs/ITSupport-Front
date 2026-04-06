import { createContext, useContext, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { websocketService } from "../services/websocketService";
import { useAuth } from "../hooks/useAuth";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      websocketService.disconnect();
      return undefined;
    }

    websocketService.connect();
    const removeListener = websocketService.addGlobalListener((event) => {
      handleSocketToast(event, user);
    });

    return () => {
      removeListener();
    };
  }, [isAuthenticated, user]);

  const value = useMemo(
    () => ({
      subscribeToTicketComments: (ticketId, listener) =>
        websocketService.subscribeToTicketComments(ticketId, listener),
    }),
    []
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

function handleSocketToast(event, user) {
  const { destination, payload } = event;
  const ticketLabel = payload?.titulo ? `"${payload.titulo}"` : payload?.ticketId ? `#${payload.ticketId}` : "ticket";
  const authorName = String(payload?.autor || payload?.usuarioNombre || "").trim();
  const isOwnAuthor =
    !user
      ? false
      : Number(payload?.usuarioId || payload?.usuario_id) === Number(user.id) ||
        authorName.toLowerCase() === String(user.nombre || user.nombre_usuario || "").toLowerCase();

  if (destination === "/topic/tickets/nuevo") {
    toast.info("Nuevo ticket", {
      description: `Hay un ticket nuevo por atender en la bandeja: ${ticketLabel}.`,
      id: `ws:new:${payload?.id || payload?.ticketId || payload?.titulo || Math.random()}`,
    });
    return;
  }

  if (destination === "/topic/tickets/actualizacion") {
    toast.info("Ticket actualizado", {
      description: `Hubo cambios en ${ticketLabel}.`,
      id: `ws:update:${payload?.id || payload?.ticketId || payload?.titulo || Math.random()}`,
    });
    return;
  }

  if (destination === "/topic/tickets/cerrado") {
    toast.success("Ticket cerrado", {
      description: `${ticketLabel} fue marcado como resuelto.`,
      id: `ws:closed:${payload?.id || payload?.ticketId || payload?.titulo || Math.random()}`,
    });
    return;
  }

  if (destination === "/user/queue/asignacion") {
    toast.success("Nuevo ticket asignado", {
      description: `Revisa ${ticketLabel} en tu bandeja.`,
      id: `ws:assignment:${payload?.id || payload?.ticketId || payload?.titulo || Math.random()}`,
    });
    return;
  }

  if (destination === "/user/queue/comentarios" && !isOwnAuthor) {
    toast.info("Nuevo comentario", {
      description: authorName ? `${authorName} comento en ${ticketLabel}.` : `Hay actividad nueva en ${ticketLabel}.`,
      id: `ws:comment:${payload?.id || payload?.ticketId || payload?.fecha || Math.random()}`,
    });
  }
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket must be used within WebSocketProvider");
  return ctx;
}

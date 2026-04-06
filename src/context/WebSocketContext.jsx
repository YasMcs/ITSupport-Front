import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { websocketService } from "../services/websocketService";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      websocketService.disconnect();
      setNotifications([]);
      return undefined;
    }

    websocketService.connect();
    const removeListener = websocketService.addGlobalListener((event) => {
      const notification = buildSocketNotification(event, user);
      if (!notification) return;

      setNotifications((current) => {
        const withoutDuplicate = current.filter((item) => item.id !== notification.id);
        return [notification, ...withoutDuplicate].slice(0, 10);
      });

      toast[notification.tone](notification.title, {
        description: notification.description,
        id: notification.id,
      });
    });

    return () => {
      removeListener();
    };
  }, [isAuthenticated, user]);

  const value = useMemo(
    () => ({
      subscribeToTicketComments: (ticketId, listener) =>
        websocketService.subscribeToTicketComments(ticketId, listener),
      notifications,
      unreadCount: notifications.filter((item) => !item.read).length,
      markAllAsRead: () => {
        setNotifications((current) => current.map((item) => ({ ...item, read: true })));
      },
    }),
    [notifications]
  );

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

function buildSocketNotification(event, user) {
  const { destination, payload } = event;
  const ticketId = payload?.ticketId || payload?.id;
  const ticketLabel = ticketId ? `#${ticketId}` : "ticket";
  const authorName = String(payload?.autor || payload?.usuarioNombre || "").trim();
  const role = user?.rol;
  const isOwnAuthor =
    !user
      ? false
      : Number(payload?.usuarioId || payload?.usuario_id) === Number(user.id) ||
        authorName.toLowerCase() === String(user.nombre || user.nombre_usuario || "").toLowerCase();

  if (destination === "/topic/tickets/nuevo" && (role === ROLES.ADMIN || role === ROLES.TECNICO)) {
    return {
      id: `ws:new:${ticketId || payload?.titulo || Math.random()}`,
      title: "Nuevo ticket",
      description:
        role === ROLES.ADMIN
          ? `Se registro un nuevo ticket: ${ticketLabel}.`
          : `Hay un ticket nuevo por atender en la bandeja: ${ticketLabel}.`,
      tone: "info",
      href: ticketId ? `/tickets/${ticketId}` : null,
      timestamp: Date.now(),
      read: false,
    };
  }

  if (destination === "/topic/tickets/actualizacion" && role !== ROLES.ADMIN) {
    return {
      id: `ws:update:${ticketId || payload?.titulo || Math.random()}`,
      title: role === ROLES.ENCARGADO ? "Ticket asignado" : "Ticket actualizado",
      description:
        role === ROLES.ENCARGADO
          ? `Un tecnico ya esta atendiendo el ticket ${ticketLabel}.`
          : `El ticket ${ticketLabel} tuvo cambios recientes.`,
      tone: "info",
      href: ticketId ? `/tickets/${ticketId}` : null,
      timestamp: Date.now(),
      read: false,
    };
  }

  if (destination === "/topic/tickets/cerrado") {
    return {
      id: `ws:closed:${ticketId || payload?.titulo || Math.random()}`,
      title: "Ticket cerrado",
      description: `${ticketLabel} fue marcado como resuelto.`,
      tone: "success",
      href: ticketId ? `/tickets/${ticketId}` : null,
      timestamp: Date.now(),
      read: false,
    };
  }

  if (destination === "/user/queue/asignacion" && role !== ROLES.ADMIN) {
    return {
      id: `ws:assignment:${ticketId || payload?.titulo || Math.random()}`,
      title: "Nuevo ticket asignado",
      description:
        role === ROLES.TECNICO
          ? `El ticket ${ticketLabel} ya forma parte de tu bandeja.`
          : `Un tecnico ya esta atendiendo el ticket ${ticketLabel}.`,
      tone: "success",
      href: ticketId ? `/tickets/${ticketId}` : null,
      timestamp: Date.now(),
      read: false,
    };
  }

  if (destination === "/user/queue/comentarios" && !isOwnAuthor && role !== ROLES.ADMIN) {
    return {
      id: `ws:comment:${payload?.id || ticketId || payload?.fecha || Math.random()}`,
      title: "Nuevo comentario",
      description: authorName
        ? `${authorName} agrego un comentario en el ticket ${ticketLabel}.`
        : `Hay un comentario nuevo en el ticket ${ticketLabel}.`,
      tone: "info",
      href: ticketId ? `/tickets/${ticketId}` : null,
      timestamp: Date.now(),
      read: false,
    };
  }

  return null;
}

export function useWebSocket() {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error("useWebSocket must be used within WebSocketProvider");
  return ctx;
}

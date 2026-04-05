import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { commentService } from "../services/commentService";
import { ticketService } from "../services/ticketService";
import { containsForbiddenInput, normalizeTextInput, validateRequiredText } from "../utils/security";
import { formatDate } from "../utils/formatDate";
import { feedbackText, getFeedbackMessage } from "../utils/feedback";
import { getUserDisplayName } from "../utils/userDisplay";
import { ROLES } from "../constants/roles";
import { TICKET_STATUS } from "../constants/ticketStatus";

export function TicketDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [ticket, setTicket] = useState(() => location.state?.ticket ?? null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [estadoActual, setEstadoActual] = useState(TICKET_STATUS.ABIERTO);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);
  const chatScrollRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTicket() {
      setLoading(true);

      try {
        const ticketData = await loadTicketForRole({
          id,
          role,
          prefetchedTicket: location.state?.ticket,
        });

        let commentsData = [];

        try {
          commentsData = await commentService.getByTicket(id);
        } catch {
          commentsData = [];
        }

        if (!cancelled) {
          setTicket(ticketData);
          setEstadoActual(ticketData?.estado ?? TICKET_STATUS.ABIERTO);
          setComentarios(commentsData);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error("No pudimos cargar el ticket", {
            description: getFeedbackMessage(error, "No pudimos abrir este ticket."),
          });
          setTicket(null);
          setComentarios([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTicket();
    return () => {
      cancelled = true;
    };
  }, [id, role, location.state]);

  const isAdmin = role === ROLES.ADMIN;
  const isCreator = ticket ? Number(user?.id) === Number(ticket.encargado_id) : false;
  const isAssignedTechnician = ticket ? Number(user?.id) === Number(ticket.tecnico_id) : false;
  const canViewTicket = ticket ? isAdmin || isCreator || isAssignedTechnician : false;
  const isClosedTicket = estadoActual === TICKET_STATUS.CERRADO;
  const canCloseTicket =
    !isAdmin &&
    role === ROLES.TECNICO &&
    isAssignedTechnician &&
    estadoActual !== TICKET_STATUS.CERRADO;
  const canComment = !isAdmin && !isClosedTicket && (isCreator || isAssignedTechnician);

  const comentariosVisibles = useMemo(
    () =>
      comentarios
        .filter((comentario) => !isAssignmentNoiseComment(comentario, ticket))
        .sort((a, b) => new Date(a?.fecha || 0) - new Date(b?.fecha || 0)),
    [comentarios, ticket]
  );

  useEffect(() => {
    if (!ticket || canViewTicket) return;

    toast.error("No puedes ver este ticket", {
      description: "No cuentas con permiso para abrir este ticket.",
      id: `ticket-denied:${id}`,
    });
  }, [canViewTicket, id, ticket]);

  useEffect(() => {
    const container = chatScrollRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [comentariosVisibles.length]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "0px";
    const nextHeight = Math.min(textarea.scrollHeight, 120);
    textarea.style.height = `${nextHeight}px`;
  }, [nuevoComentario]);

  if (loading) {
    return (
      <div className="mx-auto h-screen max-w-7xl space-y-6 overflow-hidden">
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-lg text-text-secondary">Cargando ticket...</p>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="mb-2 text-3xl font-bold text-text-primary">Ticket no encontrado</h1>
          <p className="text-text-secondary">No encontramos el ticket numero {id}.</p>
        </div>
        <Button onClick={() => navigate("/tickets")}>Volver a Tickets</Button>
      </div>
    );
  }

  if (!canViewTicket) {
    return <Navigate to="/acceso-denegado" replace state={{ from: `/tickets/${id}` }} />;
  }

  const handleAgregarComentario = async () => {
    if (!canComment || submittingComment) return;

    if (containsForbiddenInput(nuevoComentario)) {
      toast.error("No pudimos guardar el comentario", {
        description: feedbackText.invalidContent,
      });
      return;
    }

    const commentError = validateRequiredText(nuevoComentario, { min: 3, max: 600 });
    if (commentError) {
      toast.info(
        commentError === "Este campo es obligatorio" ? "Escribe un comentario antes de enviarlo" : commentError
      );
      return;
    }

    setSubmittingComment(true);

    try {
      const payload = {
        contenido: normalizeTextInput(nuevoComentario),
        ticket_id: Number(id),
        usuario_id: Number(user?.id),
      };

      const createdComment = await commentService.create(payload);
      setComentarios((prev) => [
        ...prev,
        {
          ...createdComment,
          autor: createdComment.autor || getUserDisplayName(user),
          texto: createdComment.texto || payload.contenido,
        },
      ]);
      setNuevoComentario("");
      toast.success("Comentario agregado", {
        description: "Tu actualizacion ya es visible en la conversacion.",
      });
    } catch (error) {
      toast.error("No pudimos guardar el comentario", {
        description: getFeedbackMessage(error, "Intenta nuevamente."),
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentChange = (value) => {
    if (containsForbiddenInput(value)) {
      toast.error("No pudimos agregar ese comentario", {
        description: feedbackText.invalidContent,
      });
      return;
    }

    setNuevoComentario(value);
  };

  const handleCommentKeyDown = (event) => {
    if (event.key !== "Enter" || event.shiftKey) return;

    event.preventDefault();
    handleAgregarComentario();
  };

  const handleCloseTicket = () => {
    if (!canCloseTicket) return;

    ticketService
      .close(id, user?.id)
      .then((updatedTicket) => {
        setTicket(updatedTicket);
        setEstadoActual(updatedTicket.estado);
        toast.success("Ticket cerrado", {
          description: "El ticket fue marcado como cerrado correctamente.",
        });
      })
      .catch((error) => {
        toast.error("No pudimos cerrar el ticket", {
          description: getFeedbackMessage(error, "Intenta nuevamente."),
        });
      });
  };

  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col overflow-hidden">
      <div className="space-y-3 pb-3">
      <div className="flex w-full items-start gap-3">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate("/tickets")}
            className="mt-0.5 rounded-xl bg-white/[0.03] p-2 text-text-secondary transition-all hover:text-text-primary"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-col gap-0.5">
            <h1 className="text-2xl font-bold text-text-primary">{ticket.titulo}</h1>
            <p className="text-xs text-text-muted">
              Ticket #{ticket.id}
            </p>
          </div>
        </div>
      </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 overflow-hidden xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)] xl:items-start">
        <div className="min-h-0 space-y-6 overflow-y-auto pr-2">
          <div className="rounded-3xl bg-white/[0.03] p-6 shadow-[0_18px_45px_rgba(9,6,23,0.16)]">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Descripcion del fallo</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-text-secondary">{ticket.descripcion}</p>
          </div>

          <div className="space-y-4">
            <section className="rounded-3xl bg-white/[0.03] p-6 shadow-[0_18px_45px_rgba(9,6,23,0.16)]">
              <h3 className="mb-5 text-lg font-semibold text-text-primary">Contexto del ticket</h3>
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
                <div className="space-y-4 sm:pr-5">
                  <InfoRow label="Folio" value={`#${ticket.id}`} mono />
                  <InfoRow label="Creado" value={formatDate(ticket.fechaCreacion) || "Sin fecha"} />
                  {ticket.fechaCierre && (
                    <InfoRow label="Cerrado" value={formatDate(ticket.fechaCierre) || "Sin fecha"} />
                  )}
                </div>
                <div className="space-y-4 sm:border-l sm:border-neutral-800 sm:pl-5">
                  <InfoRow label="Situacion" value={<Badge status={estadoActual} />} />
                  <InfoRow label="Prioridad" value={<Badge priority={ticket.prioridad} />} />
                </div>
              </div>
            </section>

            <section className="rounded-3xl bg-white/[0.045] p-6 shadow-[0_18px_45px_rgba(9,6,23,0.16)]">
              <h3 className="mb-5 text-lg font-semibold text-text-primary">Ubicacion y contacto</h3>
              <div className="grid gap-4">
                <InfoRow label="Sucursal" value={ticket.sucursal || "Sin dato"} />
                <InfoRow label="Area" value={ticket.area || "Sin dato"} />
                <InfoRow label="Encargado" value={ticket.encargado} />
                <InfoRow label="Tecnico" value={ticket.tecnico || "Sin asignar"} />
                {role === ROLES.TECNICO && (
                  <InfoRow
                    label="Contacto"
                    value={ticket.contacto || "Sin dato disponible"}
                  />
                )}
              </div>
            </section>

            {canCloseTicket && (
              <div className="flex justify-end pt-1">
                <Button type="button" onClick={handleCloseTicket} className="w-full sm:w-auto">
                  Cerrar ticket
                </Button>
              </div>
            )}
          </div>
        </div>

        <aside className="min-h-0 xl:self-start">
          <div className="flex h-full min-h-0 flex-col overflow-y-hidden rounded-[2rem] bg-white/[0.045] px-4 py-3 shadow-[0_24px_70px_rgba(9,6,23,0.22)] backdrop-blur-xl xl:h-[calc(100vh-172px)]">
            <div className="pb-2">
              <div>
                <h3 className="text-base font-semibold text-text-primary">Comentarios</h3>
                <p className="mt-1 text-xs text-text-muted">
                  Seguimiento del ticket.
                </p>
              </div>

              <div className="mt-4">
                {!canCloseTicket && (
                  <div className="rounded-2xl bg-white/[0.04] px-4 py-3 text-sm text-text-muted">
                    {isClosedTicket
                      ? "El ticket ya fue cerrado."
                      : "Solo el tecnico asignado puede cerrar este ticket."}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-1 flex min-h-0 flex-1 flex-col overflow-hidden">
              <div
                ref={chatScrollRef}
                className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3"
              >
                {comentariosVisibles.length === 0 ? (
                  <div className="flex min-h-full items-center justify-center rounded-2xl bg-white/[0.03] px-6 py-10 text-center">
                    <p className="text-sm text-text-muted">Aun no hay comentarios relevantes por mostrar.</p>
                  </div>
                ) : (
                comentariosVisibles.map((comentario, index) => {
                  const isTechnicianComment =
                    Number(comentario?.usuario_id) === Number(ticket?.tecnico_id) ||
                    String(comentario?.autor || "").toLowerCase().trim() ===
                      String(ticket?.tecnico || "").toLowerCase().trim();

                    return (
                      <div
                        key={index}
                        className={`flex ${isTechnicianComment ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-[1.45rem] px-4 py-3 shadow-[0_10px_24px_rgba(9,6,23,0.14)] backdrop-blur-md ${
                            isTechnicianComment
                              ? "bg-black/24 text-white"
                              : "bg-black/18 text-white"
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-text-primary">{comentario.autor}</span>
                            <span className="text-xs text-text-muted">{formatDate(comentario.fecha) || "Sin fecha"}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{comentario.texto}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="mt-auto px-3 pb-2 pt-2">
              {canComment ? (
                <div className="space-y-2.5">
                  <textarea
                    ref={textareaRef}
                    value={nuevoComentario}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    onKeyDown={handleCommentKeyDown}
                    rows={1}
                    maxLength={600}
                    className="max-h-[120px] min-h-[36px] w-full resize-none overflow-y-auto rounded-2xl bg-white/[0.05] px-4 py-2 text-sm text-text-secondary outline-none placeholder:text-text-muted/50 focus:ring-1 focus:ring-white/10"
                    placeholder="Escribe un comentario..."
                  />
                  <div className="flex justify-end">
                    <Button
                      variant="secondary"
                      onClick={handleAgregarComentario}
                      disabled={!nuevoComentario.trim() || submittingComment}
                      className="w-auto px-3 py-1.5"
                    >
                      {submittingComment ? "Validando..." : "Enviar"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-white/[0.03] px-4 py-3 text-sm text-text-muted">
                  {isClosedTicket
                    ? "Este ticket ya fue cerrado, por lo que la conversacion queda solo como consulta."
                    : isAdmin
                      ? "El administrador puede revisar este ticket, pero no agregar comentarios."
                      : "Solo el encargado creador o el tecnico asignado pueden agregar comentarios en esta vista."}
                </div>
              )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

async function loadTicketForRole({ id, role, prefetchedTicket }) {
  if (prefetchedTicket && String(prefetchedTicket.id) === String(id)) {
    return prefetchedTicket;
  }

  if (role === ROLES.ENCARGADO) {
    const tickets = await ticketService.getMineCreated();
    return tickets.find((ticket) => String(ticket.id) === String(id)) ?? null;
  }

  if (role === ROLES.TECNICO) {
    const tickets = await ticketService.getMineAssigned();
    return tickets.find((ticket) => String(ticket.id) === String(id)) ?? null;
  }

  return ticketService.getById(id);
}

function isAssignmentNoiseComment(comment, ticket) {
  const text = String(comment?.texto || comment?.contenido || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const author = String(comment?.autor || "").toLowerCase().trim();
  const assignedTechnician = String(ticket?.tecnico || ticket?.tecnicoAsignado || "").toLowerCase().trim();

  if (!text) return false;

  const looksLikeAssignmentEvent =
    text.includes("asigno el ticket") ||
    text.includes("asignado a") ||
    text.includes("ticket asignado") ||
    text.includes("se asigno el ticket") ||
    text.includes("se ha asignado el ticket");

  if (!looksLikeAssignmentEvent) return false;

  return author === "sistema" || (assignedTechnician && author === assignedTechnician);
}

function InfoRow({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="pt-1 text-xs font-bold uppercase tracking-[0.08em] text-text-muted">
        {label}
      </p>
      <div
        className={`text-right text-sm text-text-primary sm:text-base ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

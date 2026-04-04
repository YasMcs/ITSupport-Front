import { useEffect, useState } from "react";
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

export function TicketDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [ticket, setTicket] = useState(() => location.state?.ticket ?? null);
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [estadoActual, setEstadoActual] = useState("abierto");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [loading, setLoading] = useState(true);

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
          setEstadoActual(ticketData?.estado ?? "abierto");
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

  const isAdmin = role === "admin";
  const isCreator = ticket ? Number(user?.id) === Number(ticket.encargado_id) : false;
  const isAssignedTechnician = ticket ? Number(user?.id) === Number(ticket.tecnico_id) : false;
  const canViewTicket = ticket ? isAdmin || isCreator || isAssignedTechnician : false;
  const canCloseTicket = !isAdmin && role === "tecnico" && isAssignedTechnician && estadoActual !== "cerrado";
  const canComment = !isAdmin && (isCreator || isAssignedTechnician);
  const comentariosVisibles = comentarios.filter((comentario) => !isAssignmentNoiseComment(comentario, ticket));

  useEffect(() => {
    if (!ticket || canViewTicket) return;

    toast.error("No puedes ver este ticket", {
      description: "No cuentas con permiso para abrir este ticket.",
      id: `ticket-denied:${id}`,
    });
  }, [canViewTicket, id, ticket]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-text-secondary text-lg">Cargando ticket...</p>
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
      toast.info(commentError === "Este campo es obligatorio" ? "Escribe un comentario antes de enviarlo" : commentError);
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
        {
          ...createdComment,
          autor: createdComment.autor || getUserDisplayName(user),
          texto: createdComment.texto || payload.contenido,
        },
        ...prev,
      ]);
      setNuevoComentario("");
      toast.success("Comentario agregado", {
        description: "Tu actualizacion ya es visible en el historial.",
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

  const handleCloseTicket = () => {
    if (!canCloseTicket) return;

    ticketService.close(id, user?.id)
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
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => navigate("/tickets")}
            className="mt-1 rounded-xl glass-card p-2 text-text-secondary transition-all hover:border-purple-electric hover:text-text-primary"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-text-primary">{ticket.titulo}</h1>
            <p className="text-sm text-text-muted">
              Ticket #{ticket.id} - Creado el {formatDate(ticket.fechaCreacion) || "Sin fecha"}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">Situacion:</span>
            <Badge status={estadoActual} />
            <span className="text-sm text-text-muted">Prioridad:</span>
            <Badge priority={ticket.prioridad} />
          </div>

          {canCloseTicket && (
            <Button type="button" onClick={handleCloseTicket} className="w-auto px-5 py-2.5">
              Cerrar ticket
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Descripcion</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-text-secondary">{ticket.descripcion}</p>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Comentarios</h3>
                <p className="mt-1 text-sm text-text-secondary">
                  Usa esta seccion para dejar seguimiento relevante sobre la atencion del ticket.
                </p>
              </div>
              <div className="rounded-2xl bg-dark-purple-900/35 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-wide text-text-muted">Comentarios</p>
                <p className="text-2xl font-semibold text-text-primary">{comentariosVisibles.length}</p>
              </div>
            </div>

            {canComment && (
              <div className="rounded-2xl bg-white/5 p-4">
                <label className="mb-2 block text-xs uppercase tracking-wider text-text-muted">Agregar Comentario</label>
                <div className="flex items-start gap-2">
                  <textarea
                    value={nuevoComentario}
                    onChange={(e) => handleCommentChange(e.target.value)}
                    rows={2}
                    maxLength={600}
                    className="min-h-[50px] max-h-[200px] flex-1 resize-none overflow-y-auto rounded-xl border border-dark-purple-700 bg-dark-purple-800 p-3 text-sm text-text-secondary outline-none placeholder:text-text-muted/50 focus:border-purple-electric focus:ring-1 focus:ring-purple-electric"
                    placeholder="Escribe un comentario..."
                  />
                  <Button
                    variant="secondary"
                    onClick={handleAgregarComentario}
                    disabled={!nuevoComentario.trim() || submittingComment}
                    className="h-[50px] px-4"
                  >
                    {submittingComment ? "Validando..." : "Enviar"}
                  </Button>
                </div>
              </div>
            )}

            {!canComment && !isAdmin && (
              <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-text-muted">
                Solo el encargado creador o el tecnico asignado pueden agregar comentarios en esta vista.
              </div>
            )}

            {isAdmin && (
              <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-text-muted">
                El administrador puede revisar este ticket, pero no agregar comentarios.
              </div>
            )}

            <div className="mt-5 border-t border-dark-purple-700 pt-5">
              <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                {comentariosVisibles.length === 0 ? (
                  <p className="py-6 text-center text-sm text-text-muted">No hay comentarios relevantes por mostrar.</p>
                ) : (
                  comentariosVisibles.map((comentario, index) => (
                    <div key={index} className="rounded-xl bg-dark-purple-900/50 p-3">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-text-primary">{comentario.autor}</span>
                        <span className="text-xs text-text-muted">{formatDate(comentario.fecha) || "Sin fecha"}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-text-secondary">{comentario.texto}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Resumen operativo</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-text-muted">Folio</span>
                <span className="font-mono text-text-primary">#{ticket.id}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-muted">Creado</span>
                <span className="text-right text-text-primary">{formatDate(ticket.fechaCreacion) || "Sin fecha"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-muted">Situacion</span>
                <span className="text-text-primary">{estadoActual ? estadoActual.replace("_", " ") : "Sin dato"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-text-muted">Comentarios</span>
                <span className="text-text-primary">{comentariosVisibles.length}</span>
              </div>
              {ticket.fechaCierre && (
                <div className="flex justify-between gap-4">
                  <span className="text-text-muted">Cerrado</span>
                  <span className="text-right text-text-primary">{formatDate(ticket.fechaCierre) || "Sin fecha"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h3 className="mb-4 text-lg font-semibold text-text-primary">Contexto del ticket</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Encargado</span>
                <span className="text-text-primary">{ticket.encargado}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Tecnico</span>
                <span className="text-text-primary">{ticket.tecnico || "Sin asignar"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Area</span>
                <span className="text-text-primary">{ticket.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Sucursal</span>
                <span className="text-text-primary">{ticket.sucursal}</span>
              </div>
              {role === "tecnico" && (
                <div className="flex justify-between gap-4">
                  <span className="text-text-muted">Contacto del encargado del area</span>
                  <span className="text-right text-text-primary">{ticket.contacto || "Sin dato disponible"}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function loadTicketForRole({ id, role, prefetchedTicket }) {
  if (prefetchedTicket && String(prefetchedTicket.id) === String(id)) {
    return prefetchedTicket;
  }

  if (role === "encargado") {
    const tickets = await ticketService.getMineCreated();
    return tickets.find((ticket) => String(ticket.id) === String(id)) ?? null;
  }

  if (role === "tecnico") {
    const tickets = await ticketService.getMineAssigned();
    return tickets.find((ticket) => String(ticket.id) === String(id)) ?? null;
  }

  return ticketService.getById(id);
}

function isAssignmentNoiseComment(comment, ticket) {
  const text = String(comment?.texto || comment?.contenido || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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

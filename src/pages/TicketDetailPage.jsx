import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { getEnrichedMockTickets } from "../utils/mockTickets";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { getUserDisplayName } from "../utils/userDisplay";

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ticket = useMemo(() => getEnrichedMockTickets().find((item) => item.id === id), [id]);
  const [comentarios, setComentarios] = useState(() => ticket?.comentarios || []);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [estadoActual, setEstadoActual] = useState(ticket?.estado ?? "abierto");
  const [showAnularModal, setShowAnularModal] = useState(false);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Ticket no encontrado</h1>
          <p className="text-text-secondary">El ticket con ID {id} no existe.</p>
        </div>
        <Button onClick={() => navigate("/tickets")}>Volver a Tickets</Button>
      </div>
    );
  }

  const isAdmin = user?.rol === "admin";
  const isCreator = Number(user?.id) === Number(ticket.encargado_id);
  const isAssignedTechnician = Number(user?.id) === Number(ticket.tecnico_id);
  const canChangeStatus = !isAdmin && user?.rol === "tecnico" && isAssignedTechnician;
  const canComment = !isAdmin && user?.rol === "encargado";
  const canAnular = !isAdmin && (isCreator || isAssignedTechnician);

  const handleAgregarComentario = () => {
    if (!canComment) return;

    if (!nuevoComentario.trim()) {
      toast.info("Escribe un comentario antes de enviarlo");
      return;
    }

    setComentarios((prev) => [
      {
        autor: getUserDisplayName(user),
        fecha: new Date().toISOString().split("T")[0],
        texto: nuevoComentario.trim(),
      },
      ...prev,
    ]);
    setNuevoComentario("");
    toast.success("Comentario agregado", {
      description: "Tu actualizacion ya es visible en el historial.",
    });
  };

  const handleChangeStatus = (nextStatus) => {
    if (!canChangeStatus) return;

    setEstadoActual(nextStatus);
    toast.info(`Estado actualizado a ${formatStatus(nextStatus)}`);
  };

  const confirmAnularTicket = () => {
    if (!canAnular) return;

    setEstadoActual("anulado");
    setShowAnularModal(false);
    toast.error("Estado actualizado a Anulado", {
      description: "El ticket fue marcado como anulado.",
    });
  };

  return (
    <>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-start w-full gap-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => navigate("/tickets")}
              className="p-2 rounded-xl glass-card text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all mt-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-text-primary">{ticket.titulo}</h1>
              <p className="text-sm text-text-muted">Ticket #{ticket.id} - Creado el {ticket.fechaCreacion}</p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <span className="text-sm text-text-muted">Estado:</span>
            <Badge status={estadoActual} />
            <span className="text-sm text-text-muted">Prioridad:</span>
            <Badge priority={ticket.prioridad} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Descripcion</h3>
              {canChangeStatus && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { value: "abierto", label: "Abierto" },
                    { value: "en_proceso", label: "En proceso" },
                    { value: "cerrado", label: "Cerrado" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleChangeStatus(option.value)}
                      className={`px-3 py-2 rounded-xl text-sm border transition-colors ${
                        estadoActual === option.value
                          ? "bg-purple-electric/20 border-purple-electric/40 text-purple-electric"
                          : "bg-white/5 border-white/10 text-text-secondary hover:bg-white/10"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              {!canChangeStatus && !isAdmin && user?.rol === "tecnico" && (
                <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-muted">
                  Solo el tecnico asignado puede actualizar el estado de este ticket.
                </div>
              )}
              {isAdmin && (
                <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-muted">
                  El administrador solo supervisa este ticket y no puede modificar su estado.
                </div>
              )}
              <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{ticket.descripcion}</p>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Comentarios</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {comentarios.length === 0 ? (
                  <p className="text-text-muted text-sm text-center py-4">No hay comentarios</p>
                ) : (
                  comentarios.map((comentario, index) => (
                    <div key={index} className="bg-dark-purple-900/50 rounded-xl p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-text-primary text-sm font-medium">{comentario.autor}</span>
                        <span className="text-text-muted text-xs">{comentario.fecha}</span>
                      </div>
                      <p className="text-text-secondary text-sm">{comentario.texto}</p>
                    </div>
                  ))
                )}
              </div>

              {canComment && (
                <div className="border-t border-dark-purple-700 pt-4">
                  <label className="text-xs uppercase tracking-wider text-text-muted mb-2 block">Agregar Comentario</label>
                  <div className="flex gap-2 items-start">
                    <textarea
                      value={nuevoComentario}
                      onChange={(e) => setNuevoComentario(e.target.value)}
                      rows={2}
                      className="flex-1 min-h-[50px] max-h-[200px] resize-none overflow-y-auto bg-dark-purple-800 text-text-secondary border border-dark-purple-700 rounded-xl p-3 text-sm placeholder:text-text-muted/50 focus:ring-1 focus:ring-purple-electric focus:border-purple-electric outline-none"
                      placeholder="Escribe un comentario..."
                    />
                    <Button variant="secondary" onClick={handleAgregarComentario} disabled={!nuevoComentario.trim()} className="h-[50px] px-4">
                      Enviar
                    </Button>
                  </div>
                </div>
              )}
              {!canComment && !isAdmin && user?.rol !== "encargado" && (
                <div className="border-t border-dark-purple-700 pt-4 text-sm text-text-muted">
                  Solo el encargado puede agregar comentarios en esta vista.
                </div>
              )}
              {isAdmin && (
                <div className="border-t border-dark-purple-700 pt-4 text-sm text-text-muted">
                  El administrador puede revisar el historial, pero no agregar comentarios.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="glass-card rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Participantes</h3>
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
                <div className="flex justify-between">
                  <span className="text-text-muted">Contacto</span>
                  <span className="text-text-primary">{ticket.contacto}</span>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Historial</h2>
              {canAnular && estadoActual !== "anulado" && (
                <div className="mb-4">
                  <Button type="button" onClick={() => setShowAnularModal(true)} className="w-full bg-accent-pink hover:bg-accent-pink/90">
                    Anular Ticket
                  </Button>
                </div>
              )}
              {!canAnular && !isAdmin && (
                <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-muted">
                  Solo el creador del ticket o el tecnico asignado pueden anularlo.
                </div>
              )}
              {isAdmin && (
                <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-muted">
                  El administrador no puede anular tickets.
                </div>
              )}
              <div className="relative border-l border-dark-purple-700 ml-3 space-y-6">
                {ticket.historial.slice().reverse().map((item, index) => (
                  <div key={index} className="relative pl-6">
                    <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-electric ring-4 ring-dark-purple-900" />
                    <p className="text-sm text-text-secondary">{item.accion}</p>
                    <span className="text-xs text-text-muted">{item.fecha}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={showAnularModal} onClose={() => setShowAnularModal(false)} title="Confirmar anulacion">
        <p className="text-text-secondary text-sm mb-6">
          Estas seguro de que deseas anular a {ticket.titulo}? Esta accion no se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => setShowAnularModal(false)} className="w-auto px-5">
            Cancelar
          </Button>
          <Button type="button" onClick={confirmAnularTicket} className="w-auto px-5 bg-accent-pink hover:bg-accent-pink/90" disabled={!canAnular}>
            Anular Ticket
          </Button>
        </div>
      </Modal>
    </>
  );
}

function formatStatus(status) {
  if (status === "en_proceso") return "En proceso";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

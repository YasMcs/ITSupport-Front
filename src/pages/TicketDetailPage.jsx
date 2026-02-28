import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { TICKET_STATUS } from "../constants/ticketStatus";
import { mockTickets } from "../utils/mockTickets";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Clock, HelpCircle, MapPin, User, Phone, Store, ChevronRight, X } from "lucide-react";

// Mapping de datos de sucursales para el contexto
const SUCURSAL_CONTEXT = {
  "Sucursal Norte": {
    zona: "Zona Industrial",
    contacto: "Carlos Mendoza",
    telefono: "555-1234",
    extension: "Ext. 105",
    horario: "09:00 - 18:00",
  },
  "Sucursal Sur": {
    zona: "Zona Residencial",
    contacto: "Ana López",
    telefono: "555-2345",
    extension: "Ext. 201",
    horario: "08:00 - 17:00",
  },
  "Sucursal Centro": {
    zona: "Centro Histórico",
    contacto: "Roberto García",
    telefono: "555-3456",
    extension: "Ext. 301",
    horario: "09:00 - 18:00",
  },
  "Sucursal Este": {
    zona: "Zona Comercial",
    contacto: "María Fernández",
    telefono: "555-4567",
    extension: "Ext. 402",
    horario: "09:00 - 19:00",
  },
  "Sucursal Oeste": {
    zona: "Zona Financiera",
    contacto: "Pedro Sánchez",
    telefono: "555-5678",
    extension: "Ext. 503",
    horario: "08:30 - 17:30",
  },
};

const ESTADO_OPTIONS = [
  { value: TICKET_STATUS.ABIERTO, label: "Abierto" },
  { value: TICKET_STATUS.EN_PROCESO, label: "En proceso" },
  { value: TICKET_STATUS.CERRADO, label: "Cerrado" },
];

// Componentes sacados fuera para evitar re-creación en cada render
const Card = ({ title, children, className = "" }) => (
  <div className={`glass-card rounded-2xl p-5 ${className}`}>
    {title && (
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-purple-electric rounded-full"></span>
        {title}
      </h3>
    )}
    {children}
  </div>
);

const Avatar = ({ name, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div className={`${sizeClasses[size]} rounded-full bg-purple-electric/20 flex items-center justify-center flex-shrink-0`}>
      <span className="text-purple-electric font-semibold">{initial}</span>
    </div>
  );
};

export function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  
  const ticket = useMemo(() => {
    return mockTickets.find((t) => t.id === id);
  }, [id]);

  // Usar estado solo para los comentarios, no para todo el ticket
  const [comentarios, setComentarios] = useState(() => ticket?.comentarios || []);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAgregarComentario = () => {
    if (!nuevoComentario.trim()) return;
    setComentarios((prev) => [
      {
        autor: user?.nombre,
        fecha: new Date().toISOString().split("T")[0],
        texto: nuevoComentario,
      },
      ...prev,
    ]);
    setNuevoComentario("");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header - Fila única con Volver, Título y Badges */}
      <div className="flex justify-between items-start w-full gap-4">
        {/* Lado Izquierdo: Volver + Título + Ticket# + Fecha */}
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
            <h1 className="text-2xl font-bold text-text-primary">
              {ticket.titulo}
            </h1>
            <p className="text-sm text-text-muted">
              Ticket #{ticket.id} • Creado el {ticket.fechaCreacion}
            </p>
          </div>
        </div>
        
        {/* Lado Derecho: Badges con contexto */}
        <div className="flex gap-3 items-center">
          <span className="text-sm text-text-muted">Estado:</span>
          <Badge status={ticket.estado} />
          <span className="text-sm text-text-muted">Prioridad:</span>
          <Badge priority={ticket.prioridad} />
        </div>
      </div>

      {/* Grid Layout - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Comunicación Humana */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Descripción */}
          <Card title="Descripción">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {ticket.descripcion}
            </p>
          </Card>

          {/* Card 2: Comentarios (Comunicación Humana) */}
          <Card title="Comentarios">
            {/* Lista de Comentarios */}
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

            {/* Input para agregar comentario - Estilo Chat */}
            <div className="border-t border-dark-purple-700 pt-4">
              <label className="text-xs uppercase tracking-wider text-text-muted mb-2 block">
                Agregar Comentario
              </label>
              <div className="flex gap-2 items-start">
                <textarea
                  value={nuevoComentario}
                  onChange={(e) => setNuevoComentario(e.target.value)}
                  rows={2}
                  className="flex-1 min-h-[50px] max-h-[200px] resize-none overflow-y-auto bg-dark-purple-800 text-text-secondary border border-dark-purple-700 rounded-xl p-3 text-sm placeholder:text-text-muted/50 focus:ring-1 focus:ring-purple-electric focus:border-purple-electric outline-none"
                  placeholder="Escribe un comentario..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (nuevoComentario.trim()) {
                        handleAgregarComentario();
                      }
                    }
                  }}
                />
                <Button 
                  variant="secondary" 
                  onClick={handleAgregarComentario}
                  disabled={!nuevoComentario.trim()}
                  className="h-[50px] px-4"
                >
                  Enviar
                </Button>
              </div>
              <p className="text-xs text-text-muted mt-2">
                Presiona <strong>Enter</strong> para enviar, <strong>Shift + Enter</strong> para nueva línea
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column - Datos y Sistema */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Card: Participantes con lógica de renderizado condicional por rol */}
          <Card title="Participantes">
            <div className="flex flex-col gap-4">
              {/* ADMIN: Muestra ambas secciones */}
              {role === ROLES.ADMIN && (
                <>
                  {/* Técnico Asignado - con Empty State */}
                  {ticket.tecnicoAsignado ? (
                    <div className="flex items-center gap-3 p-3 bg-dark-purple-900/50 rounded-xl">
                      <Avatar name={ticket.tecnicoAsignado} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary font-medium truncate">
                          {ticket.tecnicoAsignado}
                        </p>
                        <p className="text-text-muted text-xs">Técnico Asignado</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-dark-purple-900/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-dark-purple-800 flex items-center justify-center flex-shrink-0">
                        <HelpCircle className="w-5 h-5 text-text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-muted font-medium truncate">
                          Pendiente de asignación
                        </p>
                        <p className="text-text-muted text-xs">Técnico Asignado</p>
                      </div>
                    </div>
                  )}

                  {/* Solicitante */}
                  <div className="flex items-center gap-3 p-3 bg-dark-purple-900/50 rounded-xl">
                    <Avatar name={ticket.responsable} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="text-text-primary font-medium truncate">
                        {ticket.responsable}
                      </p>
                      <p className="text-text-muted text-xs">Usuario Solicitante</p>
                    </div>
                  </div>
                </>
              )}

              {/* SOPORTE (Técnico): Oculta técnico, muestra solicitante */}
              {role === ROLES.SOPORTE && (
                <div className="flex items-center gap-3 p-3 bg-dark-purple-900/50 rounded-xl">
                  <Avatar name={ticket.responsable} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary font-medium truncate">
                      {ticket.responsable}
                    </p>
                    <p className="text-text-muted text-xs">Usuario Solicitante</p>
                  </div>
                </div>
              )}

              {/* RESPONSABLE (Usuario): Oculta solicitante, muestra técnico */}
              {role === ROLES.RESPONSABLE && (
                <>
                  {ticket.tecnicoAsignado ? (
                    <div className="flex items-center gap-3 p-3 bg-dark-purple-900/50 rounded-xl">
                      <Avatar name={ticket.tecnicoAsignado} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary font-medium truncate">
                          {ticket.tecnicoAsignado}
                        </p>
                        <p className="text-text-muted text-xs">Técnico Asignado</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-dark-purple-900/50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-dark-purple-800 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-text-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-muted font-medium truncate">
                          Pendiente de asignación
                        </p>
                        <p className="text-text-muted text-xs">Técnico Asignado</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Información adicional del solicitante - siempre visible */}
              <div className="pt-3 border-t border-dark-purple-700/50 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Área</span>
                  <span className="text-text-primary">{ticket.area}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Sucursal</span>
                  <span className="text-text-primary">{ticket.sucursal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Contacto</span>
                  <span className="text-text-primary">{ticket.contacto}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Botón: Ver detalles de Sucursal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-800/50 hover:bg-gray-700 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-electric/10 flex items-center justify-center">
                <Store className="w-4 h-4 text-purple-electric" />
              </div>
              <span className="text-text-primary font-medium">Ver detalles de Sucursal</span>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted" />
          </button>

          {/* Modal: Información de la Sucursal */}
          {isModalOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={() => setIsModalOpen(false)}
              >
                {/* Tarjeta del Modal */}
                <div 
                  className="bg-dark-purple-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md p-6 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Cabecera */}
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-text-primary">Información de la Sucursal</h2>
                    <button 
                      onClick={() => setIsModalOpen(false)}
                      className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5 text-text-muted" />
                    </button>
                  </div>

                  {/* Cuerpo del Modal - Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Zona */}
                    <div className="col-span-2 bg-dark-purple-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-electric/10 flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-purple-electric" />
                        </div>
                        <span className="text-text-muted text-xs">Zona</span>
                      </div>
                      <p className="text-white text-sm font-medium pl-11">{SUCURSAL_CONTEXT[ticket.sucursal]?.zona || "N/A"}</p>
                    </div>

                    {/* Contacto Local */}
                    <div className="bg-dark-purple-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-electric/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-electric" />
                        </div>
                        <span className="text-text-muted text-xs">Contacto Local</span>
                      </div>
                      <p className="text-white text-sm font-medium pl-11">{SUCURSAL_CONTEXT[ticket.sucursal]?.contacto || "N/A"}</p>
                    </div>

                    {/* Tel. Directo */}
                    <div className="bg-dark-purple-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-electric/10 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-purple-electric" />
                        </div>
                        <span className="text-text-muted text-xs">Tel. Directo</span>
                      </div>
                      <p className="text-white text-sm font-medium pl-11">{SUCURSAL_CONTEXT[ticket.sucursal]?.telefono || "N/A"}</p>
                    </div>

                    {/* Extensión */}
                    <div className="bg-dark-purple-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-electric/10 flex items-center justify-center">
                          <Phone className="w-4 h-4 text-purple-electric" />
                        </div>
                        <span className="text-text-muted text-xs">Extensión</span>
                      </div>
                      <p className="text-white text-sm font-medium pl-11">{SUCURSAL_CONTEXT[ticket.sucursal]?.extension || "N/A"}</p>
                    </div>

                    {/* Horario */}
                    <div className="bg-dark-purple-800/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-electric/10 flex items-center justify-center">
                          <Clock className="w-4 h-4 text-purple-electric" />
                        </div>
                        <span className="text-text-muted text-xs">Horario</span>
                      </div>
                      <p className="text-white text-sm font-medium pl-11">{SUCURSAL_CONTEXT[ticket.sucursal]?.horario || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Card: Historial del Sistema */}
          <div className="glass-card rounded-2xl p-5">
            <div className="flex items-center border-l-4 border-purple-electric pl-3 mb-6">
              <h2 className="text-lg font-semibold text-text-primary">Historial</h2>
            </div>
            {/* Timeline */}
            <div className="relative border-l border-dark-purple-700 ml-3 space-y-6">
              {ticket.historial.slice().reverse().map((item, index) => (
                <div key={index} className="relative pl-6">
                  {/* El puntito morado sobre la línea */}
                  <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-purple-electric ring-4 ring-dark-purple-900"></span>
                  {/* Textos */}
                  <p className="text-sm text-text-secondary">{item.accion}</p>
                  <span className="text-xs text-text-muted">{item.fecha}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

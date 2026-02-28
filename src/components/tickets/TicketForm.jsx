import { useState } from "react";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { SUCURSALES } from "../../utils/mockTickets";
import { PRIORIDAD, PRIORIDAD_OPTIONS, getPriorityConfig } from "../../constants/ticketPrioridad";

export function TicketForm({ initialValues, onSubmit, user, layout = "default" }) {
  // Obtener la sucursal del usuario o usar un valor por defecto
  const userSucursal = user?.sucursal || SUCURSALES[0];
  
  const [form, setForm] = useState({
    responsable: initialValues?.responsable || user?.nombre || "",
    area: initialValues?.area || user?.area || "",
    sucursal: initialValues?.sucursal || userSucursal,
    titulo: initialValues?.titulo || "",
    descripcion: initialValues?.descripcion || "",
    prioridad: initialValues?.prioridad || PRIORIDAD.MEDIA,
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.titulo.trim()) {
      setError("El título del ticket es obligatorio");
      return;
    }

    if (!form.descripcion.trim()) {
      setError("La descripción del problema es obligatoria");
      return;
    }

    try {
      onSubmit?.(form);
    } catch (err) {
      setError("Error al crear el ticket");
    }
  };

  const priorityConfig = getPriorityConfig(form.prioridad);

  const ReadOnlyField = ({ value, icon }) => (
    <div className="flex items-center gap-3 bg-dark-purple-900/50 border border-dark-purple-700 rounded-xl px-4 py-3">
      {icon && <span className="text-text-muted">{icon}</span>}
      <span className="text-text-muted opacity-60">{value || "-"}</span>
    </div>
  );

  // Renderizar campos de solo lectura (Responsable, Área, Sucursal)
  const renderReadOnlyFields = () => (
    <>
      <FormField label="Responsable" required>
        <ReadOnlyField 
          value={form.responsable}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      </FormField>

      <FormField label="Área">
        <ReadOnlyField 
          value={form.area}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </FormField>

      <FormField label="Sucursal">
        <ReadOnlyField 
          value={form.sucursal}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </FormField>
    </>
  );

  // Renderizar campo de prioridad
  const renderPriorityField = () => (
    <FormField label="Prioridad">
      <div className="space-y-3">
        <div className="flex gap-2">
          {PRIORIDAD_OPTIONS.map((opt) => {
            const config = getPriorityConfig(opt.value);
            const isSelected = form.prioridad === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, prioridad: opt.value }))}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm transition-all duration-200 border ${
                  isSelected
                    ? opt.value === PRIORIDAD.BAJA
                      ? "bg-dark-purple-800 text-white font-semibold border-gray-400 ring-1 ring-gray-400/50"
                      : `${config.bg} text-white font-semibold border-transparent ring-1 ${opt.value === PRIORIDAD.MEDIA ? 'ring-accent-orange/50' : 'ring-accent-pink/50'}`
                    : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5 hover:border-white/20"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <div className={`text-sm font-medium ${priorityConfig.color} flex items-center gap-2`}>
          <span className={`w-2 h-2 rounded-full ${priorityConfig.bg}`}></span>
          Prioridad: {priorityConfig.label}
        </div>
      </div>
    </FormField>
  );

  // Renderizar campo de título
  const renderTitleField = () => (
    <FormField label="Título del ticket" required>
      <input
        type="text"
        className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
        value={form.titulo}
        onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
        placeholder="Resumen breve del problema..."
        required
      />
    </FormField>
  );

  // Renderizar campo de descripción
  const renderDescriptionField = () => (
    <FormField label="Descripción del problema" required>
      <textarea
        className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600 resize-none min-h-[250px]"
        value={form.descripcion}
        onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
        rows={8}
        placeholder="Describe detalladamente el problema o solicitud..."
        required
      />
    </FormField>
  );

  // Layout Split: Dos columnas (estilo Jira/Linear)
  if (layout === "split") {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-accent-pink/20 border border-accent-pink/30 text-accent-pink px-4 py-3 rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Grid de 2 columnas: Descripción (izquierda) + Metadatos (derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Título y Descripción */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              {renderTitleField()}
              {renderDescriptionField()}
            </div>
            
            {/* Botón alineado a la derecha */}
            <div className="flex justify-end mt-6">
              <Button type="submit" className="px-8 py-3 w-auto">
                {initialValues ? "Guardar cambios" : "Enviar ticket"}
              </Button>
            </div>
          </div>

          {/* Columna Derecha: Metadatos */}
          <div className="lg:col-span-1 space-y-6 h-fit">
            <div className="glass-card rounded-2xl p-6 space-y-5 h-fit">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Configuración
              </h3>
              <div className="flex flex-col gap-4">
                {renderReadOnlyFields()}
                {renderPriorityField()}
              </div>
            </div>
          </div>
        </div>
      </form>
    );
  }

  // Layout Default: Una sola columna (comportamiento original)
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Campos de solo lectura */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Responsable" required>
          <ReadOnlyField 
            value={form.responsable}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            }
          />
        </FormField>

        <FormField label="Área">
          <ReadOnlyField 
            value={form.area}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
        </FormField>
      </div>

      {/* Sucursal - solo lectura en layout default también */}
      <FormField label="Sucursal">
        <ReadOnlyField 
          value={form.sucursal}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        />
      </FormField>

      {/* Descripción */}
      <FormField label="Descripción del problema" required>
        <textarea
          className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600 resize-none min-h-[120px]"
          value={form.descripcion}
          onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
          rows={4}
          placeholder="Describe detalladamente el problema o solicitud..."
          required
        />
      </FormField>

      {/* Prioridad */}
      <FormField label="Prioridad">
        <div className="space-y-3">
          <div className="flex gap-2">
            {PRIORIDAD_OPTIONS.map((opt) => {
              const config = getPriorityConfig(opt.value);
              const isSelected = form.prioridad === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, prioridad: opt.value }))}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm transition-all duration-200 border ${
                    isSelected
                      ? opt.value === PRIORIDAD.BAJA
                        ? "bg-dark-purple-800 text-white font-semibold border-gray-400 ring-1 ring-gray-400/50"
                        : `${config.bg} text-white font-semibold border-transparent ring-1 ${opt.value === PRIORIDAD.MEDIA ? 'ring-accent-orange/50' : 'ring-accent-pink/50'}`
                      : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5 hover:border-white/20"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <div className={`text-sm font-medium ${priorityConfig.color} flex items-center gap-2`}>
            <span className={`w-2 h-2 rounded-full ${priorityConfig.bg}`}></span>
            Prioridad: {priorityConfig.label}
          </div>
        </div>
      </FormField>

      {error && (
        <div className="bg-accent-pink/20 border border-accent-pink/30 text-accent-pink px-4 py-3 rounded-xl flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <Button type="submit" className="w-full">
        {initialValues ? "Guardar cambios" : "Enviar ticket"}
      </Button>
    </form>
  );
}

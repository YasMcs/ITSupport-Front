import { useState } from "react";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { getAreaDisplay, getSucursalDisplayByAreaId } from "../../utils/mockUsers";
import { PRIORIDAD, PRIORIDAD_OPTIONS, getPriorityConfig } from "../../constants/ticketPrioridad";
import { getUserDisplayName } from "../../utils/userDisplay";

export function TicketForm({ initialValues, onSubmit, user, layout = "default" }) {
  const [form, setForm] = useState({
    encargado_id: initialValues?.encargado_id || user?.id || "",
    area_id: initialValues?.area_id || user?.area_id || "",
    titulo: initialValues?.titulo || "",
    descripcion: initialValues?.descripcion || "",
    prioridad: initialValues?.prioridad || PRIORIDAD.MEDIA,
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.titulo.trim()) {
      setError("El titulo del ticket es obligatorio");
      return;
    }

    if (!form.descripcion.trim()) {
      setError("La descripcion del problema es obligatoria");
      return;
    }

    if (!form.area_id) {
      setError("El area_id es obligatorio para generar el ticket");
      return;
    }

    try {
      onSubmit?.({
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        prioridad: form.prioridad,
        estado: initialValues?.estado || "abierto",
        encargado_id: Number(form.encargado_id),
        tecnico_id: initialValues?.tecnico_id ?? null,
        area_id: Number(form.area_id),
      });
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

  const renderReadOnlyFields = () => (
    <>
      <FormField label="Encargado" required>
        <ReadOnlyField
          value={getUserDisplayName(user)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
        />
      </FormField>

      <FormField label="Area">
        <ReadOnlyField
          value={getAreaDisplay(form.area_id)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          }
        />
      </FormField>

      <FormField label="Sucursal">
        <ReadOnlyField
          value={getSucursalDisplayByAreaId(form.area_id)}
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
                onClick={() => setForm((current) => ({ ...current, prioridad: opt.value }))}
                className={`flex-1 py-2.5 px-3 rounded-xl text-sm transition-all duration-200 border ${
                  isSelected
                    ? opt.value === PRIORIDAD.BAJA
                      ? "bg-dark-purple-800 text-white font-semibold border-gray-400 ring-1 ring-gray-400/50"
                      : `${config.bg} text-white font-semibold border-transparent ring-1 ${opt.value === PRIORIDAD.MEDIA ? "ring-accent-orange/50" : "ring-accent-pink/50"}`
                    : "bg-transparent border-white/10 text-gray-400 hover:bg-white/5 hover:border-white/20"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <div className={`text-sm font-medium ${priorityConfig.color} flex items-center gap-2`}>
          <span className={`w-2 h-2 rounded-full ${priorityConfig.bg}`} />
          Prioridad: {priorityConfig.label}
        </div>
      </div>
    </FormField>
  );

  const renderTitleField = () => (
    <FormField label="Titulo del ticket" required>
      <input
        type="text"
        className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
        value={form.titulo}
        onChange={(e) => setForm((current) => ({ ...current, titulo: e.target.value }))}
        placeholder="Resumen breve del problema..."
        required
      />
    </FormField>
  );

  const renderDescriptionField = () => (
    <FormField label="Descripcion del problema" required>
      <textarea
        className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600 resize-none min-h-[250px]"
        value={form.descripcion}
        onChange={(e) => setForm((current) => ({ ...current, descripcion: e.target.value }))}
        rows={8}
        placeholder="Describe detalladamente el problema o solicitud..."
        required
      />
    </FormField>
  );

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              {renderTitleField()}
              {renderDescriptionField()}
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" className="px-8 py-3 w-auto">
                {initialValues ? "Guardar cambios" : "Enviar ticket"}
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 h-fit">
            <div className="glass-card rounded-2xl p-6 space-y-5 h-fit">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Configuracion</h3>
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

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="Encargado" required>
          <ReadOnlyField value={getUserDisplayName(user)} />
        </FormField>
        <FormField label="Area">
          <ReadOnlyField value={getAreaDisplay(form.area_id)} />
        </FormField>
      </div>
      <FormField label="Sucursal">
        <ReadOnlyField value={getSucursalDisplayByAreaId(form.area_id)} />
      </FormField>
      {renderTitleField()}
      {renderDescriptionField()}
      {renderPriorityField()}
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Select } from "../ui/Select";
import { CustomTimePicker } from "../ui/CustomTimePicker";

const ESTADO_OPTIONS = [
  { value: "Activa", label: "Activa" },
  { value: "Desactivada", label: "Desactivada" },
];

export function SucursalForm({ initialData, onSubmit }) {
  const navigate = useNavigate();
  const isEditing = !!initialData;
  
  // Inicializar el formulario con los datos existentes o valores vacíos
  // Usando los nombres de campos correctos del mock: horaApertura, horaCierre
  const [form, setForm] = useState({
    nombre: initialData?.nombre || "",
    zona: initialData?.zona || "",
    direccion: initialData?.direccion || "",
    contacto: initialData?.contacto || "",
    telefono: initialData?.telefono || "",
    extension: initialData?.extension || "",
    horaApertura: initialData?.horaApertura || "",
    horaCierre: initialData?.horaCierre || "",
    estado: initialData?.estado || "Activa",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombre.trim()) {
      setError("El nombre de la sucursal es obligatorio");
      return;
    }

    if (!form.zona.trim()) {
      setError("La zona/colonia es obligatoria");
      return;
    }

    try {
      // Aquí iría la lógica para guardar la sucursal
      console.log(isEditing ? "Actualizando sucursal:" : "Nueva sucursal:", form);
      if (onSubmit) {
        onSubmit(form);
      }
      navigate("/sucursales");
    } catch (err) {
      setError(isEditing ? "Error al actualizar la sucursal" : "Error al crear la sucursal");
    }
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header con título y botón de regresar alineados en la misma línea */}
      <div className="flex items-center gap-4 mb-8">
        {/* Botón Regresar */}
        <button
          type="button"
          onClick={() => navigate("/sucursales")}
          className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Título y Subtítulo */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {isEditing ? "Editar Sucursal" : "Nueva Sucursal"}
          </h1>
          <p className="text-text-secondary mt-1">
            {isEditing 
              ? "Modifica los datos de la sucursal seleccionada" 
              : "Registra los datos de una nueva sede operativa"}
          </p>
        </div>
      </div>

      {/* Formulario con layout split (dos columnas) */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-accent-pink/20 border border-accent-pink/30 text-accent-pink px-4 py-3 rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Grid de 2 columnas: Principal (izquierda) + Configuración (derecha) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Datos de la Sucursal */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              {/* Fila 1: grid grid-cols-2 gap-4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre de la sucursal */}
                <FormField label="Nombre de la sucursal" required>
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    placeholder="Sucursal Centro"
                    required
                  />
                </FormField>

                {/* Zona / Colonia */}
                <FormField label="Zona / Colonia" required>
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.zona}
                    onChange={(e) => handleChange("zona", e.target.value)}
                    placeholder="Centro Histórico"
                    required
                  />
                </FormField>
              </div>

              {/* Fila 2: Dirección física exacta (ancho completo) */}
              <FormField label="Dirección física exacta">
                <textarea
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600 resize-none"
                  value={form.direccion}
                  onChange={(e) => handleChange("direccion", e.target.value)}
                  rows={2}
                  placeholder="Calle, número, referencias..."
                />
              </FormField>

              {/* Fila 3: grid grid-cols-2 gap-4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contacto Local */}
                <FormField label="Contacto Local">
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.contacto}
                    onChange={(e) => handleChange("contacto", e.target.value)}
                    placeholder="Nombre del encargado"
                  />
                </FormField>

                {/* Teléfono Directo / Móvil */}
                <FormField label="Teléfono Directo / Móvil">
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value)}
                    placeholder="Para emergencias si cae la red"
                  />
                </FormField>
              </div>

              {/* Fila 4: grid grid-cols-2 gap-4 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Extensión Interna */}
                <FormField label="Extensión Interna">
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.extension}
                    onChange={(e) => handleChange("extension", e.target.value)}
                    placeholder="Ext. 105"
                  />
                </FormField>

                {/* Horario de Operación con CustomTimePicker */}
                <FormField label="Horario de Operación">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <CustomTimePicker
                        value={form.horaApertura}
                        onChange={(value) => handleChange("horaApertura", value)}
                        placeholder="Apertura"
                      />
                    </div>
                    <span className="text-gray-400">a</span>
                    <div className="flex-1">
                      <CustomTimePicker
                        value={form.horaCierre}
                        onChange={(value) => handleChange("horaCierre", value)}
                        placeholder="Cierre"
                      />
                    </div>
                  </div>
                  {/* Helper text para el formato de horario */}
                  <div className="flex items-center gap-1 mt-1 text-xs text-purple-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Formato de 24 horas (ej. 14:00 para 2:00 PM)</span>
                  </div>
                </FormField>
              </div>

              {/* Botón Guardar alineado a la derecha */}
              <div className="flex justify-end mt-6">
                <Button type="submit" className="px-8 py-3 w-auto">
                  {isEditing ? "Guardar Cambios" : "Crear Sucursal"}
                </Button>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Configuración */}
          <div className="lg:col-span-1 space-y-6 h-fit">
            <div className="glass-card rounded-2xl p-6 space-y-5 h-fit">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Configuración
              </h3>
              
              {/* Campo de Estado */}
              <FormField label="Estado">
                <Select
                  value={form.estado}
                  onChange={(value) => handleChange("estado", value)}
                  options={ESTADO_OPTIONS}
                  className="w-full"
                />
              </FormField>

              {/* Nota Informativa */}
              <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-6">
                <p>
                  {isEditing
                    ? "Los cambios se guardarán inmediatamente en la base de datos."
                    : "Podrás asignar usuarios y áreas a esta sucursal una vez que sea creada."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

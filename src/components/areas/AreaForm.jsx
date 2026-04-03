import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Select } from "../ui/Select";

const ESTADO_FORM_OPTIONS = [
  { value: "Activa", label: "Activa" },
  { value: "Inactiva", label: "Inactiva" },
];

export function AreaForm({ initialData, onSubmit, sucursalOptions = [] }) {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    nombreArea: initialData?.nombreArea || "",
    sucursalId: initialData?.sucursalId || "",
    estado: initialData?.estado || "Activa",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.nombreArea.trim()) {
      setError("El nombre del area es obligatorio");
      return;
    }

    if (!form.sucursalId) {
      setError("Debe seleccionar una sucursal");
      return;
    }

    try {
      if (onSubmit) {
        await Promise.resolve(onSubmit(form));
      }
      navigate("/areas");
    } catch (err) {
      setError(err.response?.data?.message ?? (isEditing ? "Error al actualizar el area" : "Error al crear el area"));
    }
  };

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate("/areas")}
          className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {isEditing ? "Editar Area" : "Nueva Area"}
          </h1>
          <p className="text-text-secondary mt-1">
            {isEditing ? "Modifica los datos del area" : "Registra una nueva area operativa"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-accent-pink/20 border border-accent-pink/30 text-accent-pink px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Informacion del Area
              </h3>

              <FormField label="Nombre del Area" required>
                <input
                  type="text"
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all"
                  value={form.nombreArea}
                  onChange={(e) => handleChange("nombreArea", e.target.value)}
                  placeholder="Ej: Recepcion, Almacen, Produccion"
                  required
                />
              </FormField>

              <FormField label="Sucursal" required>
                <Select
                  value={form.sucursalId}
                  onChange={(value) => handleChange("sucursalId", value)}
                  options={sucursalOptions}
                  placeholder="Seleccionar sucursal"
                  className="w-full"
                />
              </FormField>

              <div className="flex justify-end mt-6">
                <Button type="submit" className="px-8 py-3 w-auto">
                  {isEditing ? "Guardar Cambios" : "Crear Area"}
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 h-fit">
            <div className="glass-card rounded-2xl p-6 space-y-5 h-fit">
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Configuracion
              </h3>

              <FormField label="Estado">
                <Select
                  value={form.estado}
                  onChange={(value) => handleChange("estado", value)}
                  options={ESTADO_FORM_OPTIONS}
                  className="w-full"
                  disabled={isEditing}
                />
              </FormField>

              <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-6">
                <p>
                  {isEditing
                    ? "Esta vista ya puede actualizar el nombre del area y moverla a otra sucursal."
                    : "Podras asignar tickets a esta area una vez creada."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

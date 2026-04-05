import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Select } from "../ui/Select";
import { containsForbiddenInput, normalizeTextInput, validateRequiredText } from "../../utils/security";
import { feedbackText, getFeedbackMessage } from "../../utils/feedback";

const ESTADO_OPTIONS = [
  { value: "Activa", label: "Activa" },
  { value: "Desactivada", label: "Desactivada" },
];

export function SucursalForm({ initialData, onSubmit }) {
  const navigate = useNavigate();
  const isEditing = !!initialData;

  const [form, setForm] = useState({
    nombre: initialData?.nombre || "",
    zona: initialData?.zona || "",
    direccionFisica: initialData?.direccionFisica || initialData?.direccion || "",
    telefono: initialData?.telefono || "",
    horarioOperacion: initialData?.horarioOperacion || "",
    estado: initialData?.estado || "Activa",
  });

const [errors, setErrors] = useState({});  
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (containsForbiddenInput(form.nombre)) {
      newErrors.nombre = feedbackText.invalidContent;
    } else {
      const nombreError = validateRequiredText(form.nombre, { min: 2, max: 80 });
      if (nombreError) {
        newErrors.nombre =
          nombreError === "Este campo es obligatorio" ? "El nombre de la sucursal es obligatorio" : nombreError;
      }
    }

    if (containsForbiddenInput(form.zona)) {
      newErrors.zona = feedbackText.invalidContent;
    } else {
      const zonaError = validateRequiredText(form.zona, { min: 2, max: 80 });
      if (zonaError) {
        newErrors.zona =
          zonaError === "Este campo es obligatorio" ? "La zona o colonia es obligatoria" : zonaError;
      }
    }

    if (containsForbiddenInput(form.direccionFisica)) {
      newErrors.direccionFisica = feedbackText.invalidContent;
    } else {
      const direccionError = validateRequiredText(form.direccionFisica, { min: 5, max: 200 });
      if (direccionError) {
        newErrors.direccionFisica =
          direccionError === "Este campo es obligatorio" ? "La direccion fisica es obligatoria" : direccionError;
      }
    }

    if (!/^\d{10}$/.test(form.telefono.trim())) {
      newErrors.telefono = "El telefono debe tener exactamente 10 digitos";
    }

    if (containsForbiddenInput(form.horarioOperacion)) {
      newErrors.horarioOperacion = feedbackText.invalidContent;
    } else {
      const horarioError = validateRequiredText(form.horarioOperacion, { min: 3, max: 80 });
      if (horarioError) {
        newErrors.horarioOperacion =
          horarioError === "Este campo es obligatorio" ? "El horario de operacion es obligatorio" : horarioError;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!validate()) return;

    try {
      setSubmitting(true);
      if (onSubmit) {
        await Promise.resolve(
          onSubmit({
            ...form,
            nombre: normalizeTextInput(form.nombre),
            zona: normalizeTextInput(form.zona),
            direccionFisica: normalizeTextInput(form.direccionFisica),
            horarioOperacion: normalizeTextInput(form.horarioOperacion),
          })
        );
      }
      navigate("/sucursales");
    } catch (err) {
      toast.error(
        getFeedbackMessage(
          err,
          isEditing ? "No pudimos guardar los cambios de la sucursal." : "No pudimos guardar la sucursal."
        )
      );
    } finally {
      setSubmitting(false);
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
          onClick={() => navigate("/sucursales")}
          className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

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

  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
  


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nombre de la sucursal" error={errors.nombre} required>
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.nombre}
                    onChange={(e) => handleChange("nombre", e.target.value)}
                    placeholder="Sucursal Centro"
                    required
                  />
                </FormField>

                <FormField label="Zona / Colonia" error={errors.zona} required>
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.zona}
                    onChange={(e) => handleChange("zona", e.target.value)}
                    placeholder="Centro Historico"
                    required
                  />
                </FormField>
              </div>

              <FormField label="Direccion fisica exacta" error={errors.direccionFisica} required>
                <textarea
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600 resize-none"
                  value={form.direccionFisica}
                  onChange={(e) => handleChange("direccionFisica", e.target.value)}
                  rows={2}
                  placeholder="Calle, numero, referencias..."
                  required
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Telefono Directo / Movil" error={errors.telefono} required>
                  <input
                    type="tel"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.telefono}
                    onChange={(e) => handleChange("telefono", e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="5551234567"
                    inputMode="numeric"
                    required
                  />
                </FormField>

                <FormField label="Horario de Operacion" error={errors.horarioOperacion} required>
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={form.horarioOperacion}
                    onChange={(e) => handleChange("horarioOperacion", e.target.value)}
                    placeholder="Lun-Vie 9-18"
                    required
                  />
                </FormField>
              </div>

              <div className="flex justify-end mt-6">
                <Button type="submit" className="px-8 py-3 w-auto" disabled={submitting}>
                  {submitting ? "Validando..." : isEditing ? "Guardar Cambios" : "Crear Sucursal"}
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
                  options={ESTADO_OPTIONS}
                  className="w-full"
                  disabled={isEditing}
                />
              </FormField>

              <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-6">
                <p>
                  {isEditing
                    ? "Actualiza los datos principales de esta sucursal desde una sola vista."
                    : "Completa los datos principales de la sucursal para registrarla correctamente."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

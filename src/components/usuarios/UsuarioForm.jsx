import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FormField } from "../ui/FormField";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import {
  containsForbiddenInput,
  normalizeTextInput,
  validateEmail,
  validateName,
  validateRequiredText,
} from "../../utils/security";
import { feedbackText, getFeedbackMessage } from "../../utils/feedback";

export const ROL_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "encargado", label: "Encargado" },
  { value: "tecnico", label: "Tecnico" },
];

export const ESTADO_OPTIONS = [
  { value: "activo", label: "Activo" },
  { value: "suspendido", label: "Suspendido" },
];

export function UsuarioForm({ usuario, onSubmit, onCancel, isEditing = false, areaOptions = [] }) {
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || usuario?.nombre_usuario || "",
    apellido_paterno: usuario?.apellido_paterno || "",
    apellido_materno: usuario?.apellido_materno || "",
    email: usuario?.email || "",
    contrasena_hash: "",
    rol: usuario?.rol || "",
    estado_cuenta: usuario?.estado_cuenta || "activo",
    area_id: usuario?.area_id ? String(usuario.area_id) : "",
  });
const [errors, setErrors] = useState({});  
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const normalizedAreaOptions = areaOptions
    .filter((area) => area.estado === "Activa")
    .map((area) => ({
      value: String(area.id),
      label: area.nombreSucursal ? `${area.nombreArea} - ${area.nombreSucursal}` : area.nombreArea,
    }));

  const isEncargado = formData.rol === "encargado";
  const selectedArea = useMemo(
    () => normalizedAreaOptions.find((option) => option.value === formData.area_id),
    [formData.area_id, normalizedAreaOptions]
  );

  useEffect(() => {
    setFormData({
      nombre: usuario?.nombre || usuario?.nombre_usuario || "",
      apellido_paterno: usuario?.apellido_paterno || "",
      apellido_materno: usuario?.apellido_materno || "",
      email: usuario?.email || "",
      contrasena_hash: "",
      rol: usuario?.rol || "",
      estado_cuenta: usuario?.estado_cuenta || "activo",
      area_id: usuario?.area_id ? String(usuario.area_id) : "",
    });
  }, [usuario]);

  const handleChange = (field, value) => {
    setFormError("");
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "rol" && value !== "encargado") {
        next.area_id = "";
      }
      return next;
    });
  };

  const validate = () => {
    const newErrors = {};

    const fieldsToCheck = [
      formData.nombre,
      formData.apellido_paterno,
      formData.apellido_materno,
      formData.email,
      formData.contrasena_hash,
    ];

    if (fieldsToCheck.some((value) => containsForbiddenInput(value))) {
      newErrors.nombre = feedbackText.invalidContent;
      setErrors(newErrors);
      return false;
    }

    const nombreError = validateName(formData.nombre, "El nombre");
    if (nombreError) {
      newErrors.nombre = nombreError;
      setErrors(newErrors);
      return false;
    }

    const apellidoPaternoError = validateName(formData.apellido_paterno, "El apellido paterno");
    if (apellidoPaternoError) {
      newErrors.apellido_paterno = apellidoPaternoError;
      setErrors(newErrors);
      return false;
    }

    const apellidoMaternoError = validateName(formData.apellido_materno, "El apellido materno");
    if (apellidoMaternoError) {
      newErrors.apellido_materno = apellidoMaternoError;
      setErrors(newErrors);
      return false;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
      setErrors(newErrors);
      return false;
    }

    if (!isEditing || formData.contrasena_hash.trim()) {
      const passwordError = validateRequiredText(formData.contrasena_hash, { min: 6, max: 60 });
      if (passwordError) {
        newErrors.contrasena_hash = passwordError === "Este campo es obligatorio" ? "La contrasena es obligatoria" : passwordError;
        setErrors(newErrors);
        return false;
      }
    }

    if (!formData.rol) {
      newErrors.rol = "El rol es obligatorio";
      setErrors(newErrors);
      return false;
    }

    if (!isEditing && isEncargado && !formData.area_id) {
      newErrors.area_id = "El area asignada es obligatoria";
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setFormError("");

    if (!validate()) return;

    try {
      setSubmitting(true);
      await Promise.resolve(onSubmit?.({
        nombre: normalizeTextInput(formData.nombre),
        apellido_paterno: normalizeTextInput(formData.apellido_paterno),
        apellido_materno: normalizeTextInput(formData.apellido_materno),
        email: normalizeTextInput(formData.email).toLowerCase(),
        contrasena_hash: formData.contrasena_hash.trim() || undefined,
        rol: formData.rol,
        estado_cuenta: formData.estado_cuenta,
        area_id: isEncargado ? Number(formData.area_id) : null,
      }));

      toast.success(isEditing ? "Usuario actualizado" : "Registro creado exitosamente", {
        description: isEditing ? "Los cambios ya fueron aplicados." : "La informacion se guardo correctamente.",
      });
    } catch (error) {
      setFormError(getFeedbackMessage(error, feedbackText.saveGeneric));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {formError && (
          <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {formError}
          </div>
        )}

      


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <FormField label="Nombre" error={errors.nombre} required>
                <input
                  type="text"
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="Nombre registrado"
                  maxLength={60}
                  required
                />
              </FormField>

              <FormField label="Apellido Paterno" error={errors.apellido_paterno} required>
                <input
                  type="text"
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                  value={formData.apellido_paterno}
                  onChange={(e) => handleChange("apellido_paterno", e.target.value)}
                  placeholder="De Coz"
                  maxLength={60}
                  required
                />
              </FormField>

              <FormField label="Apellido Materno" error={errors.apellido_materno} required>
                <input
                  type="text"
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                  value={formData.apellido_materno}
                  onChange={(e) => handleChange("apellido_materno", e.target.value)}
                  placeholder="Fernandez"
                  maxLength={60}
                  required
                />
              </FormField>

              <FormField label="Correo Electronico" error={errors.email} required>
                <input
                  type="email"
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                  maxLength={120}
                  required
                />
              </FormField>

              <FormField label={isEditing ? "Contrasena" : "Contrasena Temporal"} error={errors.contrasena_hash} required={!isEditing}>
                <input
                  type="password"
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                  value={formData.contrasena_hash}
                  onChange={(e) => handleChange("contrasena_hash", e.target.value)}
                  placeholder={isEditing ? "Deja vacio si no cambia" : "Temporal123"}
                  maxLength={60}
                  autoComplete="new-password"
                  required={!isEditing}
                />
              </FormField>

              <div className="flex justify-end gap-3 mt-6">
                {onCancel && (
                  <Button type="button" variant="secondary" onClick={onCancel} className="px-6 py-3 w-auto">
                    Cancelar
                  </Button>
                )}
                  <Button type="submit" className="px-8 py-3 w-auto" disabled={submitting}>
                    {submitting ? "Validando..." : isEditing ? "Guardar Cambios" : "Crear Usuario"}
                  </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6 h-fit">
            <div className="glass-card rounded-2xl p-6 space-y-5 h-fit">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Configuracion</h3>

              <FormField label="Rol" error={errors.rol} required>
                <Select
                  value={formData.rol}
                  onChange={(value) => handleChange("rol", value)}
                  options={ROL_OPTIONS}
                  placeholder="Selecciona un rol"
                  className="w-full"
                  disabled={isEditing}
                />
              </FormField>

              <FormField label="Estado de Cuenta">
                <Select
                  value={formData.estado_cuenta}
                  onChange={(value) => handleChange("estado_cuenta", value)}
                  options={ESTADO_OPTIONS}
                  placeholder="Selecciona un estado"
                  className="w-full"
                  disabled={isEditing}
                />
              </FormField>

              {!isEditing && isEncargado && (
                <FormField label="Area Asignada" error={errors.area_id} required>
                  <Select
                    value={formData.area_id}
                    onChange={(value) => handleChange("area_id", value)}
                    options={normalizedAreaOptions}
                    placeholder="Selecciona un area"
                    className="w-full"
                  />
                </FormField>
              )}

              {!isEditing && isEncargado && selectedArea && (
                <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-6">
                  <p>Area seleccionada</p>
                  <p className="mt-2 text-xs text-text-muted">{selectedArea.label}</p>
                </div>
              )}

              {!isEditing && (
                <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-6">
                  <p>El cargo se define al crear el usuario y despues ya no se modifica desde la edicion por seguridad.</p>
                </div>
              )}

              {isEditing && (
                <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-6">
                  <p>En esta vista puedes actualizar nombre, apellidos, correo y contrasena. El cargo se mantiene fijo por seguridad.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

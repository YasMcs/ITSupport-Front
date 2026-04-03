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
  const [error, setError] = useState("");
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
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "rol" && value !== "encargado") {
        next.area_id = "";
      }
      return next;
    });
  };

  const validate = () => {
    const fieldsToCheck = [
      formData.nombre,
      formData.apellido_paterno,
      formData.apellido_materno,
      formData.email,
      formData.contrasena_hash,
    ];

    if (fieldsToCheck.some((value) => containsForbiddenInput(value))) {
      setError("Deteccion de caracteres no permitidos");
      return false;
    }

    const nombreError = validateName(formData.nombre, "El nombre");
    if (nombreError) {
      setError(nombreError);
      return false;
    }

    const apellidoPaternoError = validateName(formData.apellido_paterno, "El apellido paterno");
    if (apellidoPaternoError) {
      setError(apellidoPaternoError);
      return false;
    }

    const apellidoMaternoError = validateName(formData.apellido_materno, "El apellido materno");
    if (apellidoMaternoError) {
      setError(apellidoMaternoError);
      return false;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      setError(emailError);
      return false;
    }

    if (!isEditing || formData.contrasena_hash.trim()) {
      const passwordError = validateRequiredText(formData.contrasena_hash, { min: 6, max: 60 });
      if (passwordError) {
        setError(passwordError === "Este campo es obligatorio" ? "La contrasena es obligatoria" : passwordError);
        return false;
      }
    }

    if (!formData.rol) {
      setError("El rol es obligatorio");
      return false;
    }

    if (!isEditing && isEncargado && !formData.area_id) {
      setError("El area asignada es obligatoria");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");

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
      setError(error.response?.data?.message ?? "No pudimos guardar la informacion del usuario");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
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
              <FormField label="Nombre" required>
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

              <FormField label="Apellido Paterno" required>
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

              <FormField label="Apellido Materno" required>
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

              <FormField label="Correo Electronico" required>
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

              <FormField label={isEditing ? "Contrasena" : "Contrasena Temporal"} required={!isEditing}>
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

              <FormField label="Rol" required>
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
                <FormField label="Area Asignada" required>
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

              {isEditing && (
                <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-6">
                  <p>Por ahora la edicion administrativa actualiza nombre, apellidos, correo y contrasena. El cargo queda bloqueado hasta contar con la asignacion de area correspondiente.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

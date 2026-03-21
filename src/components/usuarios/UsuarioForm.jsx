import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FormField } from "../ui/FormField";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { mockAreas } from "../../utils/mocks/areas.mock";

export const ROL_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "encargado", label: "Encargado" },
  { value: "tecnico", label: "Tecnico" },
];

export const ESTADO_OPTIONS = [
  { value: "activo", label: "Activo" },
  { value: "suspendido", label: "Suspendido" },
];

const AREA_OPTIONS = mockAreas
  .filter((area) => area.estado === "Activa")
  .map((area) => ({
    value: String(area.id),
    label: `${area.nombreArea} - ${area.nombreSucursal}`,
  }));

export function UsuarioForm({ usuario, onSubmit, onCancel, isEditing = false }) {
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || "",
    apellido_paterno: usuario?.apellido_paterno || "",
    apellido_materno: usuario?.apellido_materno || "",
    nombre_usuario: usuario?.nombre_usuario || "",
    email: usuario?.email || "",
    contrasena_hash: "",
    rol: usuario?.rol || "",
    estado_cuenta: usuario?.estado_cuenta || "activo",
    area_id: usuario?.area_id ? String(usuario.area_id) : "",
  });
  const [error, setError] = useState("");

  const isEncargado = formData.rol === "encargado";
  const selectedArea = useMemo(
    () => AREA_OPTIONS.find((option) => option.value === formData.area_id),
    [formData.area_id]
  );

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
    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio");
      toast.warning("Informacion incompleta", {
        description: "Agrega el nombre real del usuario.",
      });
      return false;
    }

    if (!formData.apellido_paterno.trim()) {
      setError("El apellido paterno es obligatorio");
      toast.warning("Informacion incompleta", {
        description: "Agrega el apellido paterno para continuar.",
      });
      return false;
    }

    if (!formData.apellido_materno.trim()) {
      setError("El apellido materno es obligatorio");
      toast.warning("Informacion incompleta", {
        description: "Agrega el apellido materno para continuar.",
      });
      return false;
    }

    if (!formData.nombre_usuario.trim()) {
      setError("El nombre de usuario es obligatorio");
      toast.warning("Informacion incompleta", {
        description: "Necesitamos un nombre de usuario para continuar.",
      });
      return false;
    }

    if (!formData.email.trim()) {
      setError("El correo electronico es obligatorio");
      toast.warning("Informacion incompleta", {
        description: "Agrega un correo electronico valido antes de guardar.",
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("El correo electronico no es valido");
      toast.warning("Informacion incompleta", {
        description: "El formato del correo electronico no es valido.",
      });
      return false;
    }

    if (!isEditing && !formData.contrasena_hash.trim()) {
      setError("La contrasena es obligatoria");
      toast.warning("Informacion incompleta", {
        description: "Define una contrasena temporal para crear el registro.",
      });
      return false;
    }

    if (!formData.rol) {
      setError("El rol es obligatorio");
      toast.warning("Informacion incompleta", {
        description: "Selecciona un rol para el usuario.",
      });
      return false;
    }

    if (isEncargado && !formData.area_id) {
      setError("El area asignada es obligatoria");
      toast.warning("Informacion incompleta", {
        description: "Selecciona el area asignada para el encargado.",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    onSubmit({
      nombre: formData.nombre.trim(),
      apellido_paterno: formData.apellido_paterno.trim(),
      apellido_materno: formData.apellido_materno.trim(),
      nombre_usuario: formData.nombre_usuario.trim(),
      email: formData.email.trim().toLowerCase(),
      contrasena_hash: formData.contrasena_hash.trim() || undefined,
      rol: formData.rol,
      estado_cuenta: formData.estado_cuenta,
      area_id: isEncargado ? Number(formData.area_id) : null,
    });

    toast.success("Registro creado exitosamente", {
      description: isEditing ? "Los cambios ya fueron aplicados." : "La informacion se guardo correctamente.",
    });
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
              <FormField label="Nombre(s)" required>
                <input
                  type="text"
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="Joel"
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
                  required
                />
              </FormField>

              <FormField label="Nombre de Usuario" required>
                <input
                  type="text"
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                  value={formData.nombre_usuario}
                  onChange={(e) => handleChange("nombre_usuario", e.target.value)}
                  placeholder="ej. joel.decoz"
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
                  required
                />
              </FormField>

              {!isEditing && (
                <FormField label="Contrasena Temporal" required>
                  <input
                    type="text"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={formData.contrasena_hash}
                    onChange={(e) => handleChange("contrasena_hash", e.target.value)}
                    placeholder="Temporal123"
                    required
                  />
                </FormField>
              )}

              <div className="flex justify-end gap-3 mt-6">
                {onCancel && (
                  <Button type="button" variant="secondary" onClick={onCancel} className="px-6 py-3 w-auto">
                    Cancelar
                  </Button>
                )}
                <Button type="submit" className="px-8 py-3 w-auto">
                  {isEditing ? "Guardar Cambios" : "Crear Usuario"}
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
                />
              </FormField>

              <FormField label="Estado de Cuenta">
                <Select
                  value={formData.estado_cuenta}
                  onChange={(value) => handleChange("estado_cuenta", value)}
                  options={ESTADO_OPTIONS}
                  placeholder="Selecciona un estado"
                  className="w-full"
                />
              </FormField>

              {isEncargado && (
                <FormField label="Area Asignada" required>
                  <Select
                    value={formData.area_id}
                    onChange={(value) => handleChange("area_id", value)}
                    options={AREA_OPTIONS}
                    placeholder="Selecciona un area"
                    className="w-full"
                  />
                </FormField>
              )}

              {isEncargado && selectedArea && (
                <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-6">
                  <p>Area seleccionada</p>
                  <p className="mt-2 text-xs text-text-muted">{selectedArea.label}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

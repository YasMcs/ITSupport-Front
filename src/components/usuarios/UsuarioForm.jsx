import { useState, useEffect } from "react";
import { FormField } from "../ui/FormField";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { mockSucursales } from "../../utils/mocks/sucursales.mock";
import { mockAreas } from "../../utils/mocks/areas.mock";

// Opciones de roles (solo soporte y responsable)
export const ROL_OPTIONS = [
  { value: "soporte", label: "Soporte" },
  { value: "responsable", label: "Responsable" },
];

// Opciones de sucursales activas
export const SUCURSAL_OPTIONS = mockSucursales
  .filter((s) => s.estado === "Activa")
  .map((s) => ({ value: s.id, label: s.nombre }));

// Función para obtener áreas por sucursal
const getAreasBySucursal = (sucursalId) => {
  if (!sucursalId) return [];
  return mockAreas
    .filter((a) => a.sucursalId === parseInt(sucursalId) && a.estado === "Activa")
    .map((a) => ({ value: a.id, label: a.nombreArea }));
};

export function UsuarioForm({ usuario, onSubmit, onCancel, isEditing = false }) {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "",
    sucursalId: "",
    areaId: "",
  });

  // Estado de errores
  const [error, setError] = useState("");

  // Opciones de área filtradas por sucursal seleccionada
  const [areaOptions, setAreaOptions] = useState([]);

  // Cargar datos del usuario si está en modo edición
  useEffect(() => {
    if (usuario) {
      setFormData({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        password: "",
        rol: usuario.rol || "",
        sucursalId: usuario.sucursalId || "",
        areaId: usuario.areaId || "",
      });

      // Cargar opciones de área si hay sucursal seleccionada
      if (usuario.sucursal) {
        const sucursalId = mockSucursales.find(
          (s) => s.nombre === usuario.sucursal
        )?.id;
        if (sucursalId) {
          setAreaOptions(getAreasBySucursal(sucursalId));
        }
      }
    }
  }, [usuario]);

  // Manejar cambios en los campos
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Si cambia la sucursal, filtrar las áreas
    if (field === "sucursalId") {
      setAreaOptions(getAreasBySucursal(value));
      setFormData((prev) => ({ ...prev, areaId: "" })); // Reset área
    }
  };

  // Manejar cambios de inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

  // Validar formulario
  const validate = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      return false;
    }

    if (!formData.apellido.trim()) {
      setError("El apellido es requerido");
      return false;
    }

    if (!formData.email.trim()) {
      setError("El email es requerido");
      return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("El email no es válido");
      return false;
    }

    if (!isEditing && !formData.password.trim()) {
      setError("La contraseña es requerida");
      return false;
    }

    if (!formData.rol) {
      setError("El rol es requerido");
      return false;
    }

    if (!formData.sucursalId) {
      setError("La sucursal es requerida");
      return false;
    }

    if (!formData.areaId) {
      setError("El área es requerida");
      return false;
    }

    return true;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    // Obtener nombres de sucursal y área
    const sucursal = mockSucursales.find(
      (s) => s.id === parseInt(formData.sucursalId)
    );
    const area = mockAreas.find((a) => a.id === parseInt(formData.areaId));

    const usuarioData = {
      ...formData,
      sucursal: sucursal?.nombre || "",
      area: area?.nombreArea || "",
      sucursalId: parseInt(formData.sucursalId),
      areaId: parseInt(formData.areaId),
    };

    onSubmit(usuarioData);
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

        {/* Grid de 2 columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna Izquierda: Datos del usuario */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              {/* Fila 1: Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nombre" required>
                  <input
                    type="text"
                    name="nombre"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingresa el nombre"
                    required
                  />
                </FormField>

                <FormField label="Apellido" required>
                  <input
                    type="text"
                    name="apellido"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    placeholder="Ingresa el apellido"
                    required
                  />
                </FormField>
              </div>

              {/* Fila 2: Email */}
              <FormField label="Email" required>
                <input
                  type="email"
                  name="email"
                  className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </FormField>

              {/* Password (solo en creación) */}
              {!isEditing && (
                <FormField label="Password" required>
                  <input
                    type="password"
                    name="password"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl px-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Ingresa la contraseña"
                    required
                  />
                </FormField>
              )}

              {/* Botón Guardar */}
              <div className="flex justify-end mt-6">
                <Button type="submit" className="px-8 py-3 w-auto">
                  {isEditing ? "Guardar Cambios" : "Crear Usuario"}
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

              {/* Campo de Rol */}
              <FormField label="Rol" required>
                <Select
                  value={formData.rol}
                  onChange={(value) => handleChange("rol", value)}
                  options={ROL_OPTIONS}
                  placeholder="Selecciona un rol"
                  className="w-full"
                />
              </FormField>

              {/* Campo de Sucursal */}
              <FormField label="Sucursal" required>
                <Select
                  value={formData.sucursalId}
                  onChange={(value) => handleChange("sucursalId", value)}
                  options={SUCURSAL_OPTIONS}
                  placeholder="Selecciona una sucursal"
                  className="w-full"
                />
              </FormField>

              {/* Campo de Área - Se filtra según la sucursal seleccionada */}
              <FormField label="Área" required>
                <Select
                  value={formData.areaId}
                  onChange={(value) => handleChange("areaId", value)}
                  options={areaOptions}
                  placeholder={
                    formData.sucursalId
                      ? "Selecciona un área"
                      : "Selecciona primero una sucursal"
                  }
                  className="w-full"
                  disabled={!formData.sucursalId}
                />
              </FormField>

              {/* Nota Informativa */}
              <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-6">
                <p>
                  {isEditing
                    ? "Los cambios se guardarán inmediatamente en la base de datos."
                    : "El usuario recibirá las credenciales para acceder al sistema."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormField } from "../components/ui/FormField";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { mockSucursales } from "../utils/mocks/sucursales.mock";
import { mockAreas } from "../utils/mocks/areas.mock";
import dummies from "../utils/dummies.json";

const ROL_OPTIONS = [
  { value: "soporte", label: "Soporte" },
  { value: "responsable", label: "Responsable" },
];

const ESTADO_OPTIONS = [
  { value: "Activo", label: "Activo" },
  { value: "Inactivo", label: "Inactivo" },
];

const PUESTO_OPTIONS = [
  { value: "Técnico de Soporte", label: "Técnico de Soporte" },
  { value: "Gerente de Tienda", label: "Gerente de Tienda" },
  { value: "Jefe de Almacén", label: "Jefe de Almacén" },
  { value: "Administrativo", label: "Administrativo" },
  { value: "Gerente", label: "Gerente" },
  { value: "Jefe de Área", label: "Jefe de Área" },
  { value: "Coordinador", label: "Coordinador" },
];

const SUCURSAL_OPTIONS = mockSucursales
  .filter((s) => s.estado === "Activa")
  .map((s) => ({ value: s.id, label: s.nombre }));

const getAreasBySucursal = (sucursalId) => {
  if (!sucursalId) return [];
  return mockAreas
    .filter((a) => a.sucursalId === parseInt(sucursalId) && a.estado === "Activa")
    .map((a) => ({ value: a.id, label: a.nombreArea }));
};

const getSucursalIdByNombre = (nombre) => {
  const sucursal = mockSucursales.find((s) => s.nombre === nombre);
  return sucursal ? sucursal.id : null;
};

const getAreaIdByNombre = (nombre, sucursalId) => {
  const area = mockAreas.find((a) => a.nombreArea === nombre && a.sucursalId === sucursalId);
  return area ? area.id : null;
};

export function EditarUsuarioPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const usuarioData = dummies.users
    .map((u) => u.user)
    .find((u) => u.id === parseInt(id));

  const [formData, setFormData] = useState({
    nombre: usuarioData?.nombre || "",
    apellido: usuarioData?.apellido || "",
    email: usuarioData?.email || "",
    telefono: usuarioData?.telefono || "",
    puesto: usuarioData?.puesto || "",
    nuevaPassword: "",
    rol: usuarioData?.rol || "",
    sucursalId: usuarioData?.sucursal ? String(getSucursalIdByNombre(usuarioData.sucursal)) : "",
    areaId: "",
    estado: usuarioData?.estado || "Activo",
  });

  const [error, setError] = useState("");
  const [areaOptions, setAreaOptions] = useState([]);

  const isResponsable = formData.rol === "responsable";

  useEffect(() => {
    if (formData.sucursalId) {
      setAreaOptions(getAreasBySucursal(formData.sucursalId));
      if (usuarioData?.area && formData.sucursalId) {
        const areaId = getAreaIdByNombre(usuarioData.area, parseInt(formData.sucursalId));
        if (areaId) {
          setFormData((prev) => ({ ...prev, areaId: String(areaId) }));
        }
      }
    }
  }, [formData.sucursalId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "sucursalId") {
      setAreaOptions(getAreasBySucursal(value));
      setFormData((prev) => ({ ...prev, areaId: "" }));
    }

    if (field === "rol") {
      if (value !== "responsable") {
        setFormData((prev) => ({ ...prev, sucursalId: "", areaId: "" }));
        setAreaOptions([]);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(name, value);
  };

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
    if (!formData.puesto) {
      setError("El puesto/cargo es requerido");
      return false;
    }
    if (!formData.rol) {
      setError("El rol es requerido");
      return false;
    }

    if (formData.rol === "responsable") {
      if (!formData.sucursalId) {
        setError("La sucursal es requerida para responsables");
        return false;
      }
      if (!formData.areaId) {
        setError("El área es requerida para responsables");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    const sucursal = mockSucursales.find(
      (s) => s.id === parseInt(formData.sucursalId)
    );
    const area = mockAreas.find((a) => a.id === parseInt(formData.areaId));

    const usuarioActualizado = {
      ...formData,
      id: parseInt(id),
      password: formData.nuevaPassword || undefined,
      sucursal: sucursal?.nombre || (formData.rol === "responsable" ? "" : "Global"),
      area: area?.nombreArea || (formData.rol === "responsable" ? "" : "Global"),
      sucursalId: formData.sucursalId ? parseInt(formData.sucursalId) : null,
      areaId: formData.areaId ? parseInt(formData.areaId) : null,
    };

    console.log("Usuario actualizado:", usuarioActualizado);
    navigate("/usuarios");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          type="button"
          onClick={() => navigate("/usuarios")}
          className="p-2 rounded-xl bg-dark-purple-800 border border-dark-purple-700 text-text-secondary hover:text-text-primary hover:border-purple-electric transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Editar Usuario</h1>
          <p className="text-text-secondary mt-1">Modifica los datos del usuario seleccionado</p>
        </div>
      </div>

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
          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField label="Nombre" required>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="nombre"
                      className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ingresa el nombre"
                      required
                    />
                  </div>
                </FormField>

                <FormField label="Apellido" required>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="apellido"
                      className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      placeholder="Ingresa el apellido"
                      required
                    />
                  </div>
                </FormField>
              </div>

              <FormField label="Email" required>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    name="email"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </FormField>

              <FormField label="Teléfono de Contacto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    name="telefono"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+52 (55) 1234-5678"
                  />
                </div>
              </FormField>

              <FormField label="Nueva Contraseña">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    name="nuevaPassword"
                    className="w-full bg-dark-purple-800 border border-dark-purple-700 rounded-xl pl-10 pr-4 py-3 text-text-primary placeholder:text-text-muted/50 focus:ring-2 focus:ring-purple-electric focus:border-purple-electric outline-none transition-all duration-200 hover:border-dark-purple-600"
                    value={formData.nuevaPassword}
                    onChange={handleInputChange}
                    placeholder="Nueva contraseña (opcional)"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Dejar en blanco para mantener la contraseña actual</p>
              </FormField>

              <FormField label="Puesto / Cargo" required>
                <Select
                  value={formData.puesto}
                  onChange={(value) => handleChange("puesto", value)}
                  options={PUESTO_OPTIONS}
                  placeholder="Selecciona un puesto"
                  className="w-full"
                />
              </FormField>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="px-8 py-3 w-auto">
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-5 h-fit">
            <div className="glass-card rounded-2xl p-6 space-y-5 h-fit">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Configuración</h3>

              <FormField label="Rol" required>
                <Select
                  value={formData.rol}
                  onChange={(value) => handleChange("rol", value)}
                  options={ROL_OPTIONS}
                  placeholder="Selecciona un rol"
                  className="w-full"
                />
              </FormField>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  isResponsable
                    ? "opacity-100 max-h-40"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
                <FormField label="Sucursal" required>
                  <Select
                    value={formData.sucursalId}
                    onChange={(value) => handleChange("sucursalId", value)}
                    options={SUCURSAL_OPTIONS}
                    placeholder="Selecciona una sucursal"
                    className="w-full"
                  />
                </FormField>
              </div>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  isResponsable
                    ? "opacity-100 max-h-40"
                    : "opacity-0 max-h-0 overflow-hidden"
                }`}
              >
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
              </div>

              <FormField label="Estado">
                <Select
                  value={formData.estado}
                  onChange={(value) => handleChange("estado", value)}
                  options={ESTADO_OPTIONS}
                  placeholder="Selecciona el estado"
                  className="w-full"
                />
              </FormField>

              <div className="text-sm text-gray-400 bg-white/5 p-4 rounded-lg mt-4">
                <p>
                  {isResponsable
                    ? "El responsable será asignado a una sucursal y área específica."
                    : "Los usuarios de soporte son globales y pueden atender cualquier sucursal."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

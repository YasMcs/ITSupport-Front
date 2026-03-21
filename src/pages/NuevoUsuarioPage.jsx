import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UsuarioForm } from "../components/usuarios/UsuarioForm";
import { mockUsers } from "../utils/mockUsers";

export function NuevoUsuarioPage() {
  const navigate = useNavigate();

  const handleSubmit = (payload) => {
    mockUsers.push({
      id: mockUsers.length + 1,
      nombre: payload.nombre,
      apellido_paterno: payload.apellido_paterno,
      apellido_materno: payload.apellido_materno,
      nombre_usuario: payload.nombre_usuario,
      email: payload.email,
      contrasena_hash: payload.contrasena_hash ?? "hash_demo_temporal",
      rol: payload.rol,
      estado_cuenta: payload.estado_cuenta,
      area_id: payload.area_id,
    });
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
          <h1 className="text-3xl font-bold text-text-primary">Nuevo Usuario</h1>
          <p className="text-text-secondary mt-1">Crea un usuario de prueba listo para Railway y backend SQL</p>
        </div>
      </div>

      <UsuarioForm onSubmit={handleSubmit} onCancel={() => navigate("/usuarios")} />
    </div>
  );
}

import { Bell, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { getUserDisplayName, getUserInitial } from "../utils/userDisplay";

function InfoCard({ label, value }) {
  return (
    <div className="glass-card rounded-xl p-4">
      <p className="mb-2 text-xs uppercase tracking-[0.24em] text-text-muted">{label}</p>
      <p className="font-medium text-text-primary">{value}</p>
    </div>
  );
}

export function PerfilPage() {
  const { user, role } = useAuth();
  const [notificaciones, setNotificaciones] = useState(true);

  const getRoleLabel = (rol) => {
    const labels = {
      [ROLES.ADMIN]: "Administrador",
      [ROLES.TECNICO]: "Tecnico",
      [ROLES.ENCARGADO]: "Encargado",
    };
    return labels[rol] || rol;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white">Perfil</h1>
        <p className="text-text-secondary">Consulta tu informacion, preferencias y detalles de acceso en un solo lugar.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <section className="glass-card rounded-2xl p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple-electric/12 blur-2xl" />
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-purple-electric/30 bg-dark-purple-800/85 text-4xl font-bold text-white backdrop-blur-xl">
                  {getUserInitial(user)}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-purple-electric">Informacion personal</p>
                <h1 className="text-3xl font-bold text-text-primary">{getUserDisplayName(user)}</h1>
                <p className="text-text-secondary">{user?.email}</p>
                <span className="inline-flex items-center rounded-full border border-purple-electric/20 bg-purple-electric/10 px-3 py-1 text-sm font-medium text-purple-electric">
                  {getRoleLabel(role)}
                </span>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-semibold text-text-primary">Informacion de la cuenta</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoCard label="Nombre Completo" value={getUserDisplayName(user)} />
                <InfoCard label="Correo Electronico" value={user?.email || "Sin correo"} />
                <InfoCard label="Rol" value={getRoleLabel(role)} />
                <InfoCard value={user?.estado_cuenta === "suspendido" ? "Suspendido" : "Activo"} label="Estado de Cuenta" />
              </div>
            </div>
          </div>
        </section>

        <aside className="glass-card rounded-2xl p-6">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-medium text-purple-electric">Configuracion</p>
              <h2 className="mt-2 text-2xl font-semibold text-text-primary">Preferencias y seguridad</h2>
            </div>

            <div className="glass-card rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-purple-electric/12 text-purple-electric">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Notificaciones</p>
                    <p className="text-sm text-text-muted">Recibe avisos sobre actividad y cambios en tus tickets.</p>
                  </div>
                </div>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={notificaciones}
                    onChange={(e) => setNotificaciones(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-6 w-11 rounded-full bg-dark-purple-700 transition-colors peer-checked:bg-purple-electric/80 peer-focus:ring-2 peer-focus:ring-purple-electric/30 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-full" />
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-electric/12 text-purple-electric">
                    <UserRound className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Usuario de acceso</p>
                    <p className="text-xs text-text-muted">{user?.nombre_usuario || "Sin usuario"}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-electric/12 text-purple-electric">
                    <LockKeyhole className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Seguridad</p>
                    <p className="text-xs text-text-muted">Tu acceso y permisos se administran desde el panel interno.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

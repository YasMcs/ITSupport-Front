import { Bell, Mail, ShieldCheck, User2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { getUserDisplayName, getUserInitial } from "../utils/userDisplay";

function InfoCard({ label, value, accent = "purple" }) {
  const accents = {
    purple: "border-purple-electric/20 bg-purple-electric/5",
    blue: "border-accent-blue/20 bg-accent-blue/5",
    emerald: "border-emerald-400/20 bg-emerald-400/5",
    pink: "border-accent-pink/20 bg-accent-pink/5",
  };

  return (
    <div className={`glass-card rounded-xl border p-4 ${accents[accent]}`}>
      <p className="text-xs uppercase tracking-[0.24em] text-text-muted mb-2">{label}</p>
      <p className="text-text-primary font-medium">{value}</p>
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
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="glass-card rounded-2xl border border-white/5 bg-[#0b0f1a] p-6 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-6">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-purple-electric/15 blur-xl" />
                <div className="relative w-28 h-28 rounded-full border border-purple-electric/50 bg-dark-purple-800 flex items-center justify-center text-white text-4xl font-bold shadow-[0_0_24px_rgba(124,77,255,0.16)]">
                  {getUserInitial(user)}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.28em] text-purple-electric">Perfil Personal</p>
                <h1 className="text-3xl font-bold text-text-primary">{getUserDisplayName(user)}</h1>
                <p className="text-text-secondary">{user?.email}</p>
                <span className="inline-flex items-center rounded-full border border-purple-electric/20 bg-purple-electric/10 px-3 py-1 text-sm font-medium text-purple-electric">
                  {getRoleLabel(role)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard label="Nombre Completo" value={getUserDisplayName(user)} accent="purple" />
              <InfoCard label="Correo Electronico" value={user?.email || "Sin correo"} accent="blue" />
              <InfoCard label="Rol" value={getRoleLabel(role)} accent="pink" />
              <InfoCard
                label="Estado de Cuenta"
                value={user?.estado_cuenta === "suspendido" ? "Suspendido" : "Activo"}
                accent={user?.estado_cuenta === "suspendido" ? "pink" : "emerald"}
              />
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/5 bg-white/5 p-5">
            <h2 className="text-lg font-semibold text-text-primary mb-5">Preferencias</h2>

            <div className="space-y-4">
              <div className="rounded-xl border border-white/5 bg-dark-purple-700/30 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-purple-electric/15 text-purple-electric">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-text-primary font-medium">Notificaciones</p>
                      <p className="text-sm text-text-muted">Recibe avisos sobre actividad y cambios en tus tickets.</p>
                    </div>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificaciones}
                      onChange={(e) => setNotificaciones(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="h-6 w-11 rounded-full bg-dark-purple-600 transition-colors peer-checked:bg-purple-electric peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-electric/40 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-full" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="rounded-xl border border-white/5 bg-dark-purple-700/20 p-4 flex items-center gap-3">
                  <Mail className="h-5 w-5 text-accent-blue" />
                  <div>
                    <p className="text-sm text-text-primary font-medium">Correo de contacto</p>
                    <p className="text-xs text-text-muted">{user?.email || "Sin correo"}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-dark-purple-700/20 p-4 flex items-center gap-3">
                  <User2 className="h-5 w-5 text-purple-electric" />
                  <div>
                    <p className="text-sm text-text-primary font-medium">Usuario de acceso</p>
                    <p className="text-xs text-text-muted">{user?.nombre_usuario || "Sin usuario"}</p>
                  </div>
                </div>
                <div className="rounded-xl border border-white/5 bg-dark-purple-700/20 p-4 flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-sm text-text-primary font-medium">Seguridad</p>
                    <p className="text-xs text-text-muted">Tu acceso se gestiona desde el panel administrativo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../constants/roles";
import { getUserDisplayName, getUserInitial } from "../utils/userDisplay";

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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Card */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-electric to-purple-electric-hover flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-electric/30">
            {getUserInitial(user)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">
              {getUserDisplayName(user)}
            </h2>
            <p className="text-text-secondary mt-1">{user?.email}</p>
            <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium bg-purple-electric/20 text-purple-electric">
              {getRoleLabel(role)}
            </span>
          </div>
        </div>

        <div className="mt-8 border-t border-dark-purple-700 pt-8">
          <h3 className="text-lg font-bold text-text-primary mb-6">Información de la cuenta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-dark-purple-700/50 rounded-xl">
              <p className="text-sm text-text-muted mb-1">Nombre completo</p>
              <p className="text-text-primary font-medium">{getUserDisplayName(user)}</p>
            </div>
            <div className="p-4 bg-dark-purple-700/50 rounded-xl">
              <p className="text-sm text-text-muted mb-1">Correo electrónico</p>
              <p className="text-text-primary font-medium">{user?.email}</p>
            </div>
            <div className="p-4 bg-dark-purple-700/50 rounded-xl">
              <p className="text-sm text-text-muted mb-1">Rol</p>
              <p className="text-text-primary font-medium">{getRoleLabel(role)}</p>
            </div>
            <div className="p-4 bg-dark-purple-700/50 rounded-xl">
              <p className="text-sm text-text-muted mb-1">Estado</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                {user?.estado_cuenta === "suspendido" ? "Suspendido" : "Activo"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-bold text-text-primary mb-6">Preferencias</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-purple-700/50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-electric/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <div>
                <p className="text-text-primary font-medium">Notificaciones</p>
                <p className="text-text-muted text-sm">Recibe alertas sobre tus tickets</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={notificaciones} 
                onChange={(e) => setNotificaciones(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-dark-purple-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-electric rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-electric"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

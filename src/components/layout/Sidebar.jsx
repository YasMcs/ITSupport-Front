import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";
import {
  LayoutDashboard,
  Ticket,
  BarChart3,
  User,
  LogOut,
  Users,
  Building2,
  MapPin,
  PlusCircle,
} from "lucide-react";

const MENU_ITEMS = {
  [ROLES.ADMIN]: [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/estadisticas", label: "Estadisticas", icon: BarChart3 },
    { path: "/usuarios", label: "Usuarios", icon: Users },
    { path: "/areas", label: "Areas", icon: Building2 },
    { path: "/sucursales", label: "Sucursales", icon: MapPin },
    { path: "/perfil", label: "Perfil", icon: User },
  ],
  [ROLES.TECNICO]: [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/estadisticas", label: "Estadisticas", icon: BarChart3 },
    { path: "/perfil", label: "Perfil", icon: User },
  ],
  [ROLES.ENCARGADO]: [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/estadisticas", label: "Estadisticas", icon: BarChart3 },
    { path: "/tickets/nuevo", label: "Nuevo Ticket", icon: PlusCircle },
    { path: "/perfil", label: "Perfil", icon: User },
  ],
};

export function Sidebar() {
  const { role, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const menuItems = MENU_ITEMS[role] || [];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/5 bg-black/20 backdrop-blur-lg">
      <nav className="flex-1 px-3 pt-12">
        <ul className="flex flex-col gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 rounded-xl px-3 py-4 transition-all duration-200 ${
                    isActive(item.path)
                      ? "border border-purple-electric/20 bg-purple-electric/12 text-white"
                      : "text-text-muted hover:bg-white/5 hover:text-text-primary"
                  }`}
                >
                  <Icon size={20} />
                  <span className="truncate font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto mb-6 border-t border-white/5 px-3 py-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted transition-all duration-200 hover:bg-white/5 hover:text-text-primary"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar sesion</span>
        </button>
      </div>
    </aside>
  );
}

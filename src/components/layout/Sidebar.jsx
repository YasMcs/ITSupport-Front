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
  PlusCircle
} from "lucide-react";

const MENU_ITEMS = {
  [ROLES.ADMIN]: [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
    { path: "/usuarios", label: "Usuarios", icon: Users },
    { path: "/areas", label: "Áreas", icon: Building2 },
    { path: "/sucursales", label: "Sucursales", icon: MapPin },
    { path: "/perfil", label: "Perfil", icon: User },
  ],
  [ROLES.SOPORTE]: [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
    { path: "/perfil", label: "Perfil", icon: User },
  ],
  [ROLES.RESPONSABLE]: [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/tickets", label: "Tickets", icon: Ticket },
    { path: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
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
    <aside className="w-64 bg-dark-purple-800 border-r border-dark-purple-700 h-full flex flex-col">
      {/* Navegación */}
      <nav className="flex-1 px-3 pt-12">
        <ul className="flex flex-col gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-4 rounded-xl transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-purple-electric text-white shadow-lg shadow-purple-electric/30"
                      : "text-text-muted hover:text-text-primary hover:bg-dark-purple-700 text-sm"
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Logout Button - pushed to bottom */}
      <div className="px-3 py-3 border-t border-dark-purple-700 mt-auto mb-6">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-text-muted hover:text-accent-pink hover:bg-dark-purple-700 text-sm"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}

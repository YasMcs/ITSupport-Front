import { NavLink, useLocation, useNavigate } from "react-router-dom";
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

function matchesSection(pathname, path) {
  if (path === "/tickets") {
    return pathname === "/tickets" || pathname === "/tickets/disponibles" || /^\/tickets\/\d+$/.test(pathname);
  }

  if (path === "/usuarios") {
    return pathname === "/usuarios" || pathname.startsWith("/usuarios/");
  }

  if (path === "/areas") {
    return pathname === "/areas" || pathname.startsWith("/areas/");
  }

  if (path === "/sucursales") {
    return pathname === "/sucursales" || pathname.startsWith("/sucursales/");
  }

  return pathname === path;
}

export function Sidebar() {
  const { role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = MENU_ITEMS[role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-white/[0.06] bg-white/[0.04] backdrop-blur-[22px]">
      <nav className="flex-1 px-3 pt-12">
        <ul className="flex flex-col gap-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = matchesSection(location.pathname, item.path);

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3.5 text-sm transition-[background-color,border-color,color,transform] duration-200 ease-out ${
                    active
                      ? "border border-white/[0.08] bg-white/[0.075] text-white"
                      : "text-text-muted hover:bg-white/[0.05] hover:text-text-primary"
                  }`}
                >
                  <span
                    className={`absolute inset-y-2 left-0 w-1 rounded-full transition-all duration-200 ease-out ${
                      active ? "bg-purple-electric opacity-100" : "bg-purple-electric/0 opacity-0 group-hover:opacity-60"
                    }`}
                  />
                  <Icon
                    size={19}
                    className={`transition-colors duration-200 ease-out ${
                      active ? "text-purple-electric" : "text-text-muted group-hover:text-text-primary"
                    }`}
                  />
                  <span className="truncate font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto mb-6 border-t border-white/[0.06] px-3 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-text-muted transition-colors duration-150 hover:bg-white/[0.04] hover:text-text-primary"
        >
          <LogOut size={20} />
          <span className="font-medium">Cerrar sesion</span>
        </button>
      </div>
    </aside>
  );
}

import { useAuth } from "../../hooks/useAuth";
import logoIcono from "../../assets/logo_icono.png";
import logo from "../../assets/logo.png";

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="w-full bg-dark-purple-800 border-b border-dark-purple-700 px-6 py-3 z-50">
      <div className="flex items-center justify-between">
        {/* Left - Logos */}
        <div className="flex items-center gap-3">
          <img 
            src={logoIcono} 
            alt="Logo Icono" 
            className="h-10 w-auto"
          />
          <img 
            src={logo} 
            alt="Logo" 
            className="h-8 w-auto"
          />
        </div>

        {/* Right - Notifications & Profile */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="relative p-2 rounded-xl hover:bg-dark-purple-700 transition-colors">
            <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-pink rounded-full border-2 border-dark-purple-800"></span>
          </button>

          {/* User Profile - Simple */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-electric/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-electric">
                  {user.nombre?.[0]}{user.apellido?.[0]}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-text-primary">{user.nombre} {user.apellido}</p>
                <p className="text-xs text-text-muted">{user.rol}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

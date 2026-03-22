import { useAuth } from "../../hooks/useAuth";
import logoIcono from "../../assets/logo_icono.png";
import logo from "../../assets/logo.png";
import { getUserDisplayName, getUserInitial } from "../../utils/userDisplay";

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="z-50 w-full border-b border-white/5 bg-black/20 px-6 py-3 backdrop-blur-lg">
      <div className="flex items-center justify-between">
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

        <div className="flex items-center gap-4">
          <button className="relative rounded-xl p-2 transition-colors hover:bg-white/5">
            <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full border-2 border-[#07070a] bg-purple-electric"></span>
          </button>

          {user && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-electric/20 bg-purple-electric/12">
                <span className="text-sm font-semibold text-purple-electric">
                  {getUserInitial(user)}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-text-primary">{getUserDisplayName(user)}</p>
                <p className="text-xs text-text-muted">{user.rol}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

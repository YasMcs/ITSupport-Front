import { useAuth } from "../../hooks/useAuth";
import logoIcono from "../../assets/logo_icono.png";
import logo from "../../assets/logo.png";
import { getUserDisplayName, getUserInitial } from "../../utils/userDisplay";

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="z-50 w-full border-b border-white/[0.06] bg-white/[0.04] px-6 py-3 backdrop-blur-[22px]">
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

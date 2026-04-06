import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function SessionExpiredPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="glass-card relative max-w-2xl overflow-hidden rounded-[2rem] p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(118,96,216,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.08),transparent_28%)]" />

        <div className="relative z-10 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <span className="inline-flex rounded-full bg-white/[0.05] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">
              Sesion finalizada
            </span>
            <h1 className="mt-4 text-3xl font-bold text-text-primary md:text-4xl">
              Tu sesion expiro por seguridad
            </h1>
            <p className="mt-4 text-base leading-7 text-text-secondary">
              Para seguir trabajando en la plataforma, vuelve a iniciar sesion. Esto ayuda a proteger el acceso a tus tickets y a la informacion operativa.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button type="button" onClick={() => navigate("/login", { replace: true })} className="w-auto px-6">
                Volver a iniciar sesion
              </Button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative flex h-64 w-full max-w-[280px] items-center justify-center rounded-[2rem] bg-white/[0.04]">
              <div className="absolute inset-6 rounded-[1.75rem] border border-white/[0.06] bg-[#100d1a]/90" />
              <div className="absolute left-1/2 top-7 h-2.5 w-20 -translate-x-1/2 rounded-full bg-white/[0.08]" />
              <div className="absolute left-1/2 top-16 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-purple-electric/12 shadow-[0_0_40px_rgba(118,96,216,0.18)]">
                <svg className="h-12 w-12 text-purple-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.8}
                    d="M15.75 9V5.25a3.75 3.75 0 10-7.5 0V9m-1.5 0h10.5A1.5 1.5 0 0118.75 10.5v7.25A1.25 1.25 0 0117.5 19h-11A1.25 1.25 0 015.25 17.75V10.5A1.5 1.5 0 016.75 9z"
                  />
                </svg>
              </div>
              <div className="absolute bottom-10 left-1/2 w-[72%] -translate-x-1/2 space-y-3">
                <div className="h-3 rounded-full bg-white/[0.08]" />
                <div className="h-3 w-4/5 rounded-full bg-white/[0.06]" />
                <div className="h-10 rounded-2xl bg-white/[0.05]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

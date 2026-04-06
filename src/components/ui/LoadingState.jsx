export function LoadingState({
  title = "Cargando contenido",
  description = "Espera un momento mientras preparamos esta vista.",
  className = "",
}) {
  return (
    <div className={`glass-card overflow-hidden rounded-[2rem] p-8 md:p-10 ${className}`}>
      <div className="flex flex-col items-center gap-8 md:grid md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12">
        <div className="flex flex-col items-center gap-6 md:items-start">
          <span className="inline-flex rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            Cargando vista
          </span>
          
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white/[0.05]">
            <div className="absolute inset-0 rounded-2xl border border-white/[0.1]" />
            <div className="h-12 w-12 rounded-full border-3 border-purple-electric/20 border-t-purple-electric animate-spin" />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-text-primary mb-2">{title}</h2>
            <p className="text-text-secondary max-w-md">{description}</p>
          </div>
        </div>

        <div className="relative hidden min-h-[280px] w-full rounded-[1.8rem] bg-white/[0.04] md:block">
          <div className="absolute inset-4 rounded-[1.4rem] border border-white/[0.08] bg-[#120f1d]/90" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-3 border-purple-electric/20 border-t-purple-electric animate-spin" />
          </div>
        </div>
      </div>
    </div>
  );
}

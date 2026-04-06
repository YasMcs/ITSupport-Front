export function LoadingState({
  title = "Cargando contenido",
  description = "Espera un momento mientras preparamos esta vista.",
  className = "",
}) {
  const titleLower = title.toLowerCase();
  
  const isTickets = titleLower.includes('ticket');
  const isListPage = titleLower.includes('usuario') || titleLower.includes('area') || titleLower.includes('sucursal');
  const isDashboard = titleLower.includes('dashboard') || titleLower.includes('estadística');
  const isDetail = titleLower.includes('detalle');

  const renderShimmers = () => {
    if (isDashboard) {
      return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="loading-shimmer h-20 rounded-xl" />
          ))}
        </div>
      );
    }
    
    if (isTickets) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="loading-shimmer h-28 rounded-xl" />
            ))}
          </div>
        </div>
      );
    }
    
    if (isListPage) {
      return (
        <div className="space-y-1.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="loading-shimmer h-12 rounded-lg" />
          ))}
        </div>
      );
    }
    
    if (isDetail) {
      return (
        <div className="space-y-4">
          <div className="loading-shimmer h-14 rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="loading-shimmer h-20 rounded-xl" />
            <div className="loading-shimmer h-16 rounded-lg" />
          </div>
        </div>
      );
    }
    
    // Default spinner
    return (
      <div className="relative flex h-16 w-16 items-center justify-center rounded-xl bg-white/[0.06]">
        <div className="h-8 w-8 rounded-full border-2 border-purple-electric/30 border-t-purple-electric animate-spin" />
      </div>
    );
  };

  return (
    <div className={`glass-card overflow-hidden rounded-[2rem] p-8 md:p-10 ${className}`}>
      <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-8 md:items-center">
        <div>
          <span className="inline-flex rounded-full bg-white/[0.05] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
            Cargando...
          </span>
          <div className="mt-4">
            <h2 className="text-2xl font-bold text-text-primary mb-6">{title}</h2>
            {renderShimmers()}
          </div>
        </div>

        <div className="relative hidden min-h-[240px] rounded-[1.8rem] bg-white/[0.04] md:block">
          <div className="absolute inset-4 rounded-[1.4rem] border border-white/[0.08] bg-[#120f1d]/90" />
          <div className="absolute inset-0 p-6 space-y-3">
            <div className="loading-shimmer h-5 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-2 h-16 w-full" />
            <div className="loading-shimmer h-10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

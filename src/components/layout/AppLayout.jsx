import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

function BackgroundOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Capa base de gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/30 via-transparent to-purple-950/20" />
      
      {/* Orbes principales */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700/15 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-3xl" />

      {/* Orbes secundarios */}
      <div className="absolute top-[15%] right-[20%] w-64 h-64 bg-violet-800/15 rounded-full blur-3xl" />
      <div className="absolute bottom-[20%] left-[15%] w-80 h-80 bg-blue-800/15 rounded-full blur-3xl" />
      
      {/* Líneas de gradiente sutiles */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/15 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-600/10 to-transparent" />
    </div>
  );
}

export function AppLayout({ children }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dark-purple-900 relative">
      <BackgroundOrbs />
      
      {/* Header - ocupa 100% del ancho en la parte superior */}
      <div className="w-full z-50">
        <Navbar />
      </div>
      
      {/* Contenedor flexible: Sidebar + Contenido principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - debajo del header, alineado a la izquierda */}
        <div className="h-full">
          <Sidebar />
        </div>
        
        {/* Contenido principal */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

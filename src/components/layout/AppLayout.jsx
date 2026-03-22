import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

function BackgroundOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[#0d0a16]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,99,230,0.14),transparent_38%),radial-gradient(circle_at_80%_18%,rgba(139,124,255,0.10),transparent_28%),radial-gradient(circle_at_50%_75%,rgba(244,114,182,0.06),transparent_34%)]" />
      <div className="animate-sweep-slow absolute left-[10%] top-[12%] h-72 w-72 rounded-full bg-purple-electric/10 blur-3xl" />
      <div className="animate-drift-wide absolute bottom-[14%] right-[12%] h-80 w-80 rounded-full bg-purple-electric/8 blur-3xl" />
      <div className="animate-orbit-slow absolute left-[58%] top-[18%] h-56 w-56 rounded-full bg-accent-pink/8 blur-3xl" />
      <div className="animate-drift absolute left-1/2 top-[42%] h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-electric/6 blur-[140px]" />
      <div className="animate-float-slow absolute bottom-[18%] left-[16%] h-64 w-64 rounded-full bg-accent-blue/8 blur-[120px]" />
      <div className="animate-pulse-slow absolute right-[24%] top-[62%] h-40 w-40 rounded-full bg-accent-cyan/8 blur-[90px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-electric/15 to-transparent" />
    </div>
  );
}

export function AppLayout({ children }) {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-[#0d0a16]">
      <BackgroundOrbs />

      <div className="z-50 w-full">
        <Navbar />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="h-full">
          <Sidebar />
        </div>

        <main className="relative z-10 flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

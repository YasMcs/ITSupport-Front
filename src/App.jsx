import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";
import { TicketProvider } from "./context/TicketContext";
import { AppRouter } from "./routes/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketProvider>
          <AppRouter />
          <Toaster
            richColors
            position="top-right"
            theme="dark"
            toastOptions={{
              duration: 5000,
              style: {
                background: "#0b0f1a",
                border: "1px solid rgba(148, 163, 184, 0.18)",
                color: "#f8fafc",
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.12)",
              },
              className: "sonner-premium-toast",
            }}
          />
        </TicketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

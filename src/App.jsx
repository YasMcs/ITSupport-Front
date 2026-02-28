import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TicketProvider } from "./context/TicketContext";
import { AppRouter } from "./routes/AppRouter";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TicketProvider>
          <AppRouter />
        </TicketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

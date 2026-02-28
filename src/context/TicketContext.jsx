import { createContext, useContext, useState } from "react";

const TicketContext = createContext(null);

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [filters, setFilters] = useState({});

  return (
    <TicketContext.Provider value={{ tickets, setTickets, filters, setFilters }}>
      {children}
    </TicketContext.Provider>
  );
}

export function useTicketContext() {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTicketContext must be used within TicketProvider");
  return ctx;
}

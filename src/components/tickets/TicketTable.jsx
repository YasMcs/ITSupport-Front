import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { encodeId } from "../../utils/cryptoUtils";
import { Table } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../utils/formatDate";

const COLUMN_KEYS = {
  NUMERO: "numero",
  TITULO: "titulo",
  AREA: "area",
  SUCURSAL: "sucursal",
  PRIORIDAD: "prioridad",
  ESTADO: "estado",
  TECNICO: "tecnicoAsignado",
  RESPONSABLE: "encargado",
  FECHA: "fechaCreacion",
  ACCIONES: "acciones",
};

const DEFAULT_COLUMNS = [
  { key: COLUMN_KEYS.NUMERO, label: "Numero" },
  { key: COLUMN_KEYS.TITULO, label: "Titulo" },
  { key: COLUMN_KEYS.AREA, label: "Area" },
  { key: COLUMN_KEYS.SUCURSAL, label: "Sucursal" },
  { key: COLUMN_KEYS.PRIORIDAD, label: "Prioridad", render: (val) => <Badge priority={val} /> },
  { key: COLUMN_KEYS.ESTADO, label: "Estado", render: (val) => <Badge status={val} /> },
  { key: COLUMN_KEYS.TECNICO, label: "Tecnico Asignado", render: (val) => val || "Sin asignar" },
  { key: COLUMN_KEYS.RESPONSABLE, label: "Encargado" },
  { key: COLUMN_KEYS.FECHA, label: "Fecha de Creacion", render: (val) => formatDate(val) || "-" },
  { key: COLUMN_KEYS.ACCIONES, label: "Acciones" },
];

export function TicketTable({ tickets, columnas = [] }) {
  const navigate = useNavigate();
  const columns = columnaKeysToColumns(columnas, tickets);
  return (
    <Table
      columns={columns}
      data={tickets}
      onRowClick={(ticket) => {
        if (!ticket?.id) {
          toast.error("No se puede ver: ID inválido");
          return;
        }
        const encoded = encodeId(ticket.id);
        if (encoded) navigate(`/tickets/${encoded}`, { state: { ticket } });
      }}
    />
  );
}

function columnaKeysToColumns(columnas, tickets = []) {
  const ticketsById = new Map(tickets.map((ticket) => [String(ticket.id), ticket]));

  if (columnas.length === 0) {
    return DEFAULT_COLUMNS;
  }

  return columnas
    .map((col) => {
      switch (col) {
        case COLUMN_KEYS.NUMERO:
          return { key: "id", label: "Numero" };
        case COLUMN_KEYS.TITULO:
          return { key: "titulo", label: "Titulo" };
        case COLUMN_KEYS.AREA:
          return { key: "area", label: "Area" };
        case COLUMN_KEYS.SUCURSAL:
          return { key: "sucursal", label: "Sucursal" };
        case COLUMN_KEYS.PRIORIDAD:
          return { key: "prioridad", label: "Prioridad", render: (val) => <Badge priority={val} /> };
        case COLUMN_KEYS.ESTADO:
          return { key: "estado", label: "Estado", render: (val) => <Badge status={val} /> };
        case COLUMN_KEYS.TECNICO:
          return { key: "tecnicoAsignado", label: "Tecnico Asignado", render: (val) => val || "Sin asignar" };
        case COLUMN_KEYS.RESPONSABLE:
          return { key: "encargado", label: "Encargado" };
        case COLUMN_KEYS.FECHA:
          return { key: "fechaCreacion", label: "Fecha de Creacion", render: (val) => formatDate(val) || "-" };
        case COLUMN_KEYS.ACCIONES:
          return {
            key: "id",
            label: "Acciones",
            render: (id) => (
              <Link
                to={`/tickets/${encodeId(id) || id}`}
                state={{ ticket: ticketsById.get(String(id)) }}
                data-row-action="true"
                className="text-purple-electric hover:text-purple-electric-hover font-medium transition-colors duration-200"
              >
                Ver detalle
              </Link>
            ),
          };
        default:
          return null;
      }
    })
    .filter(Boolean);
}

export { COLUMN_KEYS };

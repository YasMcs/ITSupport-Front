import { Link } from "react-router-dom";
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
  RESPONSABLE: "responsable",
  FECHA: "fechaCreacion",
  ACCIONES: "acciones",
};

const DEFAULT_COLUMNS = [
  { key: COLUMN_KEYS.NUMERO, label: "Número" },
  { key: COLUMN_KEYS.TITULO, label: "Título" },
  { key: COLUMN_KEYS.AREA, label: "Área" },
  { key: COLUMN_KEYS.SUCURSAL, label: "Sucursal" },
  { key: COLUMN_KEYS.PRIORIDAD, label: "Prioridad", render: (val) => <Badge priority={val} /> },
  { key: COLUMN_KEYS.ESTADO, label: "Estado", render: (val) => <Badge status={val} /> },
  { key: COLUMN_KEYS.TECNICO, label: "Técnico Asignado" },
  { key: COLUMN_KEYS.RESPONSABLE, label: "Responsable" },
  { key: COLUMN_KEYS.FECHA, label: "Fecha de Creación", render: (val) => val },
  { key: COLUMN_KEYS.ACCIONES, label: "Acciones" },
];

export function TicketTable({ tickets, columnas = [], onVerDetalle }) {
  // If custom columns are provided, use them; otherwise use default
  const columns = columnaKeysToColumns(columnas);

  return <Table columns={columns} data={tickets} />;
}

function columnaKeysToColumns(columnas) {
  if (columnas.length === 0) {
    return DEFAULT_COLUMNS;
  }

  return columnas.map((col) => {
    switch (col) {
      case COLUMN_KEYS.NUMERO:
        return { key: "id", label: "Número" };
      case COLUMN_KEYS.TITULO:
        return { key: "titulo", label: "Título" };
      case COLUMN_KEYS.AREA:
        return { key: "area", label: "Área" };
      case COLUMN_KEYS.SUCURSAL:
        return { key: "sucursal", label: "Sucursal" };
      case COLUMN_KEYS.PRIORIDAD:
        return { key: "prioridad", label: "Prioridad", render: (val) => <Badge priority={val} /> };
      case COLUMN_KEYS.ESTADO:
        return { key: "estado", label: "Estado", render: (val) => <Badge status={val} /> };
      case COLUMN_KEYS.TECNICO:
        return { key: "tecnicoAsignado", label: "Técnico Asignado", render: (val) => val || "Sin asignar" };
      case COLUMN_KEYS.RESPONSABLE:
        return { key: "responsable", label: "Responsable" };
      case COLUMN_KEYS.FECHA:
        return { key: "fechaCreacion", label: "Fecha de Creación", render: (val) => val };
      case COLUMN_KEYS.ACCIONES:
        return {
          key: "id",
          label: "Acciones",
          render: (id, row) => {
            return (
              <Link
                to={`/tickets/${id}`}
                className="text-purple-electric hover:text-purple-electric-hover font-medium transition-colors duration-200"
              >
                Ver →
              </Link>
            );
          },
        };
      default:
        return null;
    }
  }).filter(Boolean);
}

export { COLUMN_KEYS };

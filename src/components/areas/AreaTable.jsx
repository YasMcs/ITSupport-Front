import { Table } from "../ui/Table";
import { Badge } from "../ui/Badge";

const EstadoToggleIcon = ({ isActive }) =>
  isActive ? (
    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12l5 5L20 7" />
    </svg>
  ) : (
    <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636L5.636 18.364M5.636 5.636l12.728 12.728" />
    </svg>
  );

export function AreaTable({ areas, onEditar, onToggleEstado }) {
  const COLUMNS = [
    { key: "nombreArea", label: "Nombre del Area" },
    {
      key: "nombreSucursal",
      label: "Sucursal",
      render: (val) => (
        <span className="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-indigo-500/20">
          {val}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (val) => <Badge areaStatus={val} />,
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (id, row) => {
        const isActive = row.estado === "Activa";
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEditar && onEditar(row.id)}
              className="p-2 text-text-secondary hover:text-purple-electric hover:bg-dark-purple-700 rounded-lg transition-colors"
              title="Editar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onToggleEstado && onToggleEstado(row.id)}
              className={`p-2 rounded-lg transition-colors ${
                isActive
                  ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                  : "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              }`}
              title={isActive ? "Desactivar" : "Activar"}
            >
              <EstadoToggleIcon isActive={isActive} />
            </button>
          </div>
        );
      },
    },
  ];

  return <Table columns={COLUMNS} data={areas} />;
}

import { useNavigate } from "react-router-dom";
import { CheckCircle2, Pencil, XCircle } from "lucide-react";
import { Table } from "../ui/Table";
import { Badge } from "../ui/Badge";

const EstadoToggleIcon = ({ isActive }) =>
  isActive ? <CheckCircle2 className="h-5 w-5 text-emerald-400" strokeWidth={2.2} /> : <XCircle className="h-5 w-5 text-slate-400" strokeWidth={2.2} />;

export function SucursalTable({ sucursales, onEditar, onToggleEstado }) {
  const navigate = useNavigate();

  const COLUMNS = [
    { key: "nombre", label: "Nombre" },
    { key: "zona", label: "Zona / Colonia" },
    { key: "contacto", label: "Contacto Local" },
    { key: "extension", label: "Extension" },
    {
      key: "usuariosCount",
      label: "Usuarios",
      render: (val) => (
        <span className="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-indigo-500/20">
          {val}
        </span>
      ),
    },
    {
      key: "areasCount",
      label: "Areas",
      render: (val) => (
        <span className="inline-flex items-center justify-center bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-purple-500/20">
          {val}
        </span>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (val) => <Badge sucursalStatus={val} />,
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (id, row) => {
        const isActive = row.estado === "Activa";
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/sucursales/editar/${row.id}`)}
              className="p-2 text-text-secondary hover:text-purple-electric hover:bg-dark-purple-700 rounded-lg transition-colors duration-200"
              title="Editar"
            >
              <Pencil className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => onToggleEstado && onToggleEstado(row.id)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-500/10"
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

  return <Table columns={COLUMNS} data={sucursales} />;
}

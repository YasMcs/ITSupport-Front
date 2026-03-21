import { useNavigate } from "react-router-dom";
import { Table } from "../ui/Table";
import { Badge } from "../ui/Badge";

export function SucursalTable({ sucursales, onEditar, onToggleEstado }) {
  const navigate = useNavigate();

  const COLUMNS = [
    { key: "nombre", label: "Nombre" },
    { key: "zona", label: "Zona / Colonia" },
    { key: "contacto", label: "Contacto Local" },
    { key: "extension", label: "Extensión" },
    { 
      key: "usuariosCount", 
      label: "Usuarios",
      render: (val) => (
        <span className="inline-flex items-center justify-center bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-indigo-500/20">
          {val}
        </span>
      )
    },
    { 
      key: "areasCount", 
      label: "Áreas",
      render: (val) => (
        <span className="inline-flex items-center justify-center bg-purple-500/10 text-purple-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-purple-500/20">
          {val}
        </span>
      )
    },
    { 
      key: "estado", 
      label: "Estado", 
      render: (val) => <Badge sucursalStatus={val} /> 
    },
    {
      key: "acciones",
      label: "Acciones",
      render: (id, row) => {
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/sucursales/editar/${row.id}`)}
              className="p-2 text-text-secondary hover:text-purple-electric hover:bg-dark-purple-700 rounded-lg transition-colors duration-200"
              title="Editar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onToggleEstado && onToggleEstado(row.id)}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                row.estado === "Activa" 
                  ? "text-text-secondary hover:text-accent-pink hover:bg-dark-purple-700" 
                  : "text-text-secondary hover:text-green-400 hover:bg-dark-purple-700"
              }`}
              title={row.estado === "Activa" ? "Desactivar" : "Activar"}
            >
              {row.estado === "Activa" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
        );
      },
    },
  ];

  return <Table columns={COLUMNS} data={sucursales} />;
}

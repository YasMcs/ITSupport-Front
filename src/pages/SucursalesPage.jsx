import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { SucursalTable } from "../components/sucursales/SucursalTable";
import { mockSucursales, ESTADO_OPTIONS } from "../utils/mocks/sucursales.mock";

export function SucursalesPage() {
  const navigate = useNavigate();
  // Simular datos de API con useState
  const [sucursales, setSucursales] = useState(mockSucursales);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "",
  });

  const filteredSucursales = useMemo(() => {
    let filtered = [...sucursales];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sucursal) =>
          sucursal.nombre?.toLowerCase().includes(query) ||
          sucursal.zona?.toLowerCase().includes(query) ||
          sucursal.contacto?.toLowerCase().includes(query)
      );
    }

    // Apply estado filter
    if (filters.estado) {
      filtered = filtered.filter(
        (sucursal) => sucursal.estado === filters.estado
      );
    }

    return filtered;
  }, [searchQuery, filters, sucursales]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ estado: "" });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const handleNuevaSucursal = () => {
    navigate("/sucursales/nueva");
  };

  const handleEditar = (id) => {
    console.log("Editar sucursal:", id);
  };

  const handleToggleEstado = (id) => {
    console.log("Cambiar estado sucursal:", id);
  };

  return (
    <div className="space-y-6">
      {/* Contenedor Principal: flex flex-col gap-6 */}
      
      {/* Fila Superior: flex justify-between items-start */}
      <div className="flex justify-between items-start">
        {/* Lado Izquierdo: Título y Subtítulo */}
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Sucursales</h1>
          <p className="text-text-secondary mt-1">
            Administra las sedes operativas de la empresa
          </p>
        </div>

        {/* Lado Derecho: flex items-center gap-4 */}
        <div className="flex items-center gap-4">
          {/* Input Buscador */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar sucursal..."
              className="w-64 bg-dark-purple-800 border border-dark-purple-700 text-text-primary rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-purple-electric focus:border-purple-electric transition-all"
            />
          </div>

          {/* Botón Principal "+ Nueva Sucursal" */}
          <Button onClick={handleNuevaSucursal}>
            + Nueva Sucursal
          </Button>
        </div>
      </div>

      {/* Fila Inferior: flex items-center gap-4 */}
      <div className="flex items-center gap-4">
        {/* Botón de Filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${
            showFilters || hasActiveFilters
              ? "bg-dark-purple-800 border-dark-purple-700"
              : "bg-dark-purple-800/50 border-dark-purple-700"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm text-text-secondary">Filtros</span>
          {hasActiveFilters && (
            <span className="bg-purple-electric text-white text-xs px-1.5 py-0.5 rounded-full">
              {Object.values(filters).filter(v => v !== "").length}
            </span>
          )}
        </button>

        {/* Select de Estado - Ancho fijo, mismo estilo que Tickets */}
        {showFilters && (
          <>
            <select
              value={filters.estado}
              onChange={(e) => handleFilterChange("estado", e.target.value)}
              className="w-48 bg-dark-purple-800 border border-dark-purple-700 text-text-primary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-electric focus:border-purple-electric transition-all"
            >
              {ESTADO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-accent-pink"
              >
                Limpiar
              </button>
            )}
          </>
        )}
      </div>

      {/* Tabla */}
      {filteredSucursales.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="w-16 h-16 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <p className="text-text-secondary text-lg">
              No hay sucursales registradas
            </p>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <SucursalTable
            sucursales={filteredSucursales}
            onEditar={handleEditar}
            onToggleEstado={handleToggleEstado}
          />
        </div>
      )}
    </div>
  );
}

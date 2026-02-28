import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { AreaTable } from "../components/areas/AreaTable";
import { mockAreas, ESTADO_OPTIONS } from "../utils/mocks/areas.mock";

export function AreasPage() {
  const navigate = useNavigate();
  
  const [areas] = useState(mockAreas);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    estado: "",
  });

  const filteredAreas = useMemo(() => {
    let filtered = [...areas];

    // Buscar por nombre del área o nombre de sucursal
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (area) =>
          area.nombreArea?.toLowerCase().includes(query) ||
          area.nombreSucursal?.toLowerCase().includes(query)
      );
    }

    // Filtro por estado
    if (filters.estado) {
      filtered = filtered.filter(
        (area) => area.estado === filters.estado
      );
    }

    return filtered;
  }, [searchQuery, filters, areas]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ estado: "" });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const handleNuevaArea = () => {
    navigate("/areas/nueva");
  };

  const handleEditar = (id) => {
    navigate(`/areas/editar/${id}`);
  };

  const handleToggleEstado = (id) => {
    console.log("Cambiar estado área:", id);
  };

  return (
    <div className="space-y-6">
      {/* Fila Superior */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Áreas</h1>
          <p className="text-text-secondary mt-1">
            Administra las áreas operativas de cada sucursal
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Buscador */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar área o sucursal..."
              className="w-64 bg-dark-purple-800 border border-dark-purple-700 text-text-primary rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-purple-electric focus:border-purple-electric transition-all"
            />
          </div>

          <Button onClick={handleNuevaArea}>
            + Nueva Área
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
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

        {showFilters && (
          <>
            <select
              value={filters.estado}
              onChange={(e) => handleFilterChange("estado", e.target.value)}
              className="w-48 bg-dark-purple-800 border border-dark-purple-700 text-text-primary rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-electric focus:border-purple-electric"
            >
              {ESTADO_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-sm text-accent-pink">
                Limpiar
              </button>
            )}
          </>
        )}
      </div>

      {/* Tabla */}
      {filteredAreas.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-16 h-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-text-secondary text-lg">No hay áreas registradas</p>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <AreaTable
            areas={filteredAreas}
            onEditar={handleEditar}
            onToggleEstado={handleToggleEstado}
          />
        </div>
      )}
    </div>
  );
}

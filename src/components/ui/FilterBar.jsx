import { Select } from "./Select";
import { ROLES } from "../../constants/roles";
import { TICKET_STATUS } from "../../constants/ticketStatus";
import { PRIORIDAD } from "../../constants/ticketPrioridad";

const ESTADO_OPTIONS = [
  { value: "", label: "Todos" },
  { value: TICKET_STATUS.ABIERTO, label: "Sin tecnico" },
  { value: TICKET_STATUS.EN_PROCESO, label: "Con tecnico" },
  { value: TICKET_STATUS.CERRADO, label: "Resuelto" },
];

const PRIORIDAD_OPTIONS = [
  { value: "", label: "Todas" },
  { value: PRIORIDAD.ALTA, label: "Alta" },
  { value: PRIORIDAD.MEDIA, label: "Media" },
  { value: PRIORIDAD.BAJA, label: "Baja" },
];

export function FilterBar({
  filters,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
  showFilters,
  onToggleFilters,
  hideStatus = false,
  role,
  areaOptions = [],
  sucursalOptions = [],
  tecnicoOptions = [],
}) {
  return (
    <div className="mb-4 w-full">
      <div className="flex w-full flex-wrap items-center gap-3">
        <button
          onClick={onToggleFilters}
          className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${
            showFilters || hasActiveFilters
              ? "border-dark-purple-700 bg-dark-purple-800"
              : "border-dark-purple-700 bg-dark-purple-800/50"
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm text-text-secondary">Filtros</span>
          {hasActiveFilters && (
            <span className="rounded-full bg-purple-electric px-1.5 py-0.5 text-xs text-white">
              {Object.values(filters).filter((value) => value !== "").length}
            </span>
          )}
        </button>

        {showFilters && (
          <>
            {!hideStatus && (
              <Select
                value={filters.estado}
                onChange={(value) => onFilterChange("estado", value)}
                options={ESTADO_OPTIONS}
                placeholder="Estado"
                className="w-full flex-none sm:w-[170px]"
              />
            )}

            <Select
              value={filters.prioridad}
              onChange={(value) => onFilterChange("prioridad", value)}
              options={PRIORIDAD_OPTIONS}
              placeholder="Prioridad"
              className="w-full flex-none sm:w-[170px]"
            />

            {(role === ROLES.ADMIN || role === ROLES.ENCARGADO || role === ROLES.TECNICO) && (
              <Select
                value={filters.area}
                onChange={(value) => onFilterChange("area", value)}
                options={areaOptions.map((area) => ({ value: area, label: area }))}
                placeholder="Area"
                className="w-full flex-none sm:w-[170px]"
              />
            )}

            {(role === ROLES.ADMIN || role === ROLES.ENCARGADO || role === ROLES.TECNICO) && (
              <Select
                value={filters.sucursal}
                onChange={(value) => onFilterChange("sucursal", value)}
                options={sucursalOptions.map((sucursal) => ({ value: sucursal, label: sucursal }))}
                placeholder="Sucursal"
                className="w-full flex-none sm:w-[170px]"
              />
            )}

            {role === ROLES.ADMIN && (
              <Select
                value={filters.tecnico}
                onChange={(value) => onFilterChange("tecnico", value)}
                options={tecnicoOptions.map((tecnico) => ({ value: tecnico, label: tecnico }))}
                placeholder="Tecnico"
                className="w-full flex-none sm:w-[170px]"
              />
            )}
          </>
        )}

        {hasActiveFilters && (
          <button onClick={onClearFilters} className="text-sm text-accent-pink">
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}

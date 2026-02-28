import { Select } from "./Select";
import { ROLES } from "../../constants/roles";
import { TICKET_STATUS } from "../../constants/ticketStatus";
import { PRIORIDAD } from "../../constants/ticketPrioridad";
import { AREAS, SUCURSALES, TECNICOS } from "../../utils/mockTickets";

const ESTADO_OPTIONS = [
  { value: "", label: "Todos" },
  { value: TICKET_STATUS.ABIERTO, label: "Abierto" },
  { value: TICKET_STATUS.EN_PROCESO, label: "En proceso" },
  { value: TICKET_STATUS.CERRADO, label: "Cerrado" },
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
  role 
}) {
  return (
    <div className="w-full mb-4">
      <div className="flex flex-wrap items-center gap-3 w-full">
        <button
          onClick={onToggleFilters}
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
            {!hideStatus && (
              <Select
                value={filters.estado}
                onChange={(val) => onFilterChange("estado", val)}
                options={ESTADO_OPTIONS}
                placeholder="Estado"
                className="min-w-[150px] flex-1"
              />
            )}
            <Select
              value={filters.prioridad}
              onChange={(val) => onFilterChange("prioridad", val)}
              options={PRIORIDAD_OPTIONS}
              placeholder="Prioridad"
              className="min-w-[150px] flex-1"
            />
            {(role === ROLES.ADMIN || role === ROLES.RESPONSABLE) && (
              <>
                <Select
                  value={filters.area}
                  onChange={(val) => onFilterChange("area", val)}
                  options={AREAS.map(a => ({ value: a, label: a }))}
                  placeholder="Área"
                  className="min-w-[150px] flex-1"
                />
                <Select
                  value={filters.sucursal}
                  onChange={(val) => onFilterChange("sucursal", val)}
                  options={SUCURSALES.map(s => ({ value: s, label: s }))}
                  placeholder="Sucursal"
                  className="min-w-[150px] flex-1"
                />
              </>
            )}
            {role === ROLES.ADMIN && (
              <Select
                value={filters.tecnico}
                onChange={(val) => onFilterChange("tecnico", val)}
                options={TECNICOS.map(t => ({ value: t.nombre, label: t.nombre }))}
                placeholder="Técnico"
                className="min-w-[150px] flex-1"
              />
            )}
            {role === ROLES.SOPORTE && (
              <>
                <Select
                  value={filters.area}
                  onChange={(val) => onFilterChange("area", val)}
                  options={AREAS.map(a => ({ value: a, label: a }))}
                  placeholder="Área"
                  className="min-w-[150px] flex-1"
                />
                <Select
                  value={filters.sucursal}
                  onChange={(val) => onFilterChange("sucursal", val)}
                  options={SUCURSALES.map(s => ({ value: s, label: s }))}
                  placeholder="Sucursal"
                  className="min-w-[150px] flex-1"
                />
              </>
            )}
          </>
        )}

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-accent-pink"
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}

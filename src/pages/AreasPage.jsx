import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { FilterBar } from "../components/ui/FilterBar";
import { LoadingState } from "../components/ui/LoadingState";
import { Modal } from "../components/ui/Modal";
import { AreaTable } from "../components/areas/AreaTable";
import { areaService } from "../services/areaService";
import { getFeedbackMessage } from "../utils/feedback"; 

export function AreasPage() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    estado: "",
  });

  const loadAreas = async (cancelled = false) => {
    setLoading(true);

      try {
        const data = await areaService.getAll();
        if (!cancelled) setAreas(data);
      } catch (error) {
        if (!cancelled) {
          setAreas([]);
        }
      } finally {
      if (!cancelled) setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    loadAreas();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredAreas = useMemo(() => {
    let filtered = [...areas];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (area) =>
          area.nombreArea?.toLowerCase().includes(query) ||
          area.nombreSucursal?.toLowerCase().includes(query)
      );
    }

    if (filters.estado) {
      filtered = filtered.filter((area) => area.estado === filters.estado);
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

  const handleVer = (id) => {
    navigate(`/areas/${id}`);
  };

  const handleToggleEstado = (id) => {
    const area = areas.find((item) => item.id === id);
    if (!area) return;

    const isActive = area.estado === "Activa";
    const nextEstado = isActive ? "Inactiva" : "Activa";
    const actionLabel = nextEstado === "Inactiva" ? "desactivar" : "activar";

    setConfirmAction({
      title: nextEstado === "Inactiva" ? "Confirmar desactivacion" : "Confirmar activacion",
      actionLabel,
      targetName: area.nombreArea,
      confirmText: nextEstado === "Inactiva" ? "Desactivar area" : "Activar area",
      onConfirm: async () => {
        try {
          if (isActive) {
            await areaService.deactivate(id);
          } else {
            await areaService.activate(id);
          }
          await loadAreas();
          toast.success(nextEstado === "Inactiva" ? "Area desactivada" : "Area activada", {
            description: area.nombreArea,
          });
        } catch (error) {
          toast.error("No pudimos actualizar el area", {
            description: getFeedbackMessage(error, "Intenta nuevamente."),
          });
        } finally {
          setConfirmAction(null);
        }
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Areas</h1>
          <p className="text-text-secondary mt-1">Administra las areas operativas de cada sucursal</p>
        </div>

        <div className="flex items-center gap-4">
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
              placeholder="Buscar area o sucursal..."
              className="w-64 bg-dark-purple-800 border border-dark-purple-700 text-text-primary rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-purple-electric focus:border-purple-electric transition-all"
            />
          </div>

          <Button onClick={handleNuevaArea}>+ Nueva Area</Button>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        hideStatus={true}
      />

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar area o sucursal..."
            className="w-full bg-dark-purple-800 border border-dark-purple-700 text-text-primary rounded-xl pl-10 pr-4 py-2.5 text-sm placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-purple-electric focus:border-purple-electric transition-all"
          />
        </div>
        <Button onClick={handleNuevaArea}>+ Nueva Area</Button>
      </div>

      {loading ? (
        <LoadingState
          title="Cargando areas"
          description="Estamos organizando la informacion operativa."
        />
      ) : filteredAreas.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="w-16 h-16 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-text-secondary text-lg">No hay areas registradas</p>
          </div>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <AreaTable
            areas={filteredAreas}
            onEditar={handleEditar}
            onToggleEstado={handleToggleEstado}
            onVer={handleVer}
          />
        </div>
      )}

      <Modal isOpen={Boolean(confirmAction)} onClose={() => setConfirmAction(null)} title={confirmAction?.title || "Confirmar accion"}>
        <p className="text-text-secondary text-sm mb-6">
          {confirmAction
            ? `Estas seguro de que deseas ${confirmAction.actionLabel} a ${confirmAction.targetName}? Esta accion no se puede deshacer.`
            : ""}
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => setConfirmAction(null)} className="w-auto px-5">
            Cancelar
          </Button>
          <Button type="button" onClick={() => confirmAction?.onConfirm?.()} className="w-auto px-5 bg-accent-pink hover:bg-accent-pink/90">
            {confirmAction?.confirmText || "Confirmar"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

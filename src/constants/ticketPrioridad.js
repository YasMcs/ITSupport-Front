export const PRIORIDAD = {
  ALTA: "alta",
  MEDIA: "media",
  BAJA: "baja",
};

export const PRIORIDAD_OPTIONS = [
  { value: PRIORIDAD.BAJA, label: "Baja" },
  { value: PRIORIDAD.MEDIA, label: "Media" },
  { value: PRIORIDAD.ALTA, label: "Alta" },
];

export const getPriorityConfig = (prioridad) => {
  switch (prioridad) {
    case PRIORIDAD.ALTA:
      return {
        color: "text-pink-200",
        bg: "bg-pink-500/80",
        ring: "ring-pink-400/35",
        dot: "bg-pink-300",
        label: "Alta",
      };
    case PRIORIDAD.MEDIA:
      return {
        color: "text-orange-200",
        bg: "bg-orange-500/80",
        ring: "ring-orange-400/35",
        dot: "bg-orange-300",
        label: "Media",
      };
    case PRIORIDAD.BAJA:
      return {
        color: "text-blue-200",
        bg: "bg-blue-500/80",
        ring: "ring-blue-400/35",
        dot: "bg-blue-300",
        label: "Baja",
      };
    default:
      return {
        color: "text-orange-200",
        bg: "bg-orange-500/80",
        ring: "ring-orange-400/35",
        dot: "bg-orange-300",
        label: "Media",
      };
  }
};

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
      return { color: "text-accent-pink", bg: "bg-accent-pink", label: "Alta" };
    case PRIORIDAD.MEDIA:
      return { color: "text-accent-orange", bg: "bg-accent-orange", label: "Media" };
    case PRIORIDAD.BAJA:
      return { color: "text-text-secondary", bg: "bg-text-secondary", label: "Baja" };
    default:
      return { color: "text-text-secondary", bg: "bg-text-secondary", label: "Media" };
  }
};

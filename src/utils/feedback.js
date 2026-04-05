function sanitizeMessage(message) {
  if (!message) return "";

  const text = String(message).trim();
  const lower = text.toLowerCase();

  if (
    lower.includes("backend") ||
    lower.includes("frontend") ||
    lower.includes("cors") ||
    lower.includes("network") ||
    lower.includes("timeout") ||
    lower.includes("exception") ||
    lower.includes("stack") ||
    lower.includes("sql") ||
    lower.includes("java.lang") ||
    lower.includes("axios") ||
    lower.includes("servidor")
  ) {
    return "";
  }

  return text;
}

export function getFeedbackMessage(error, fallback = "No pudimos completar la solicitud. Intenta nuevamente.") {
  const status = error?.response?.status;
  const apiMessage = sanitizeMessage(error?.response?.data?.message || error?.message);

  if (apiMessage) return apiMessage;

  if (status === 400 || status === 422) return fallback;
if (status === 401) return "Correo o contraseña incorrectos. Por favor, verifica tus datos.";
  if (status === 403) return "No tienes permiso para realizar esta accion.";
  if (status === 404) return "No encontramos la informacion solicitada.";
  if (status === 409) return "Ya existe un registro con esos datos.";

  if (error?.code === "ERR_NETWORK") {
    return "No fue posible comunicarnos en este momento. Intenta nuevamente.";
  }

  return fallback;
}

export const feedbackText = {
  invalidContent: "Usa solo texto valido en este campo.",
  saveGeneric: "No pudimos guardar los cambios. Intenta nuevamente.",
  createGeneric: "No pudimos guardar la informacion. Revisa los datos e intenta nuevamente.",
  loadGeneric: "No pudimos cargar la informacion solicitada.",
};

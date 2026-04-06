const SUSPICIOUS_HTML_PATTERN = /<\s*\/?\s*(script|iframe|object|embed|svg|math|style|link|meta)[^>]*>/gi;
const GENERIC_HTML_TAG_PATTERN = /<[^>]+>/g;
const INLINE_EVENT_PATTERN = /\bon\w+\s*=/gi;
const JS_PROTOCOL_PATTERN = /javascript:/gi;
const DATA_HTML_PATTERN = /data\s*:\s*text\/html/gi;
const HTML_BRACKET_PATTERN = /[<>]/g;
const SUSPICIOUS_HTML_CHECK = /<\s*\/?\s*(script|iframe|object|embed|svg|math|style|link|meta)[^>]*>/i;
const GENERIC_HTML_TAG_CHECK = /<[^>]+>/i;
const INLINE_EVENT_CHECK = /\bon\w+\s*=/i;
const JS_PROTOCOL_CHECK = /javascript:/i;
const DATA_HTML_CHECK = /data\s*:\s*text\/html/i;
const HTML_BRACKET_CHECK = /[<>]/;

const NAME_PATTERN = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s'-]{2,60}$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,30}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function stripUnsafeFragments(value = "") {
  return String(value)
    .replace(SUSPICIOUS_HTML_PATTERN, "")
    .replace(GENERIC_HTML_TAG_PATTERN, "")
    .replace(INLINE_EVENT_PATTERN, "")
    .replace(JS_PROTOCOL_PATTERN, "")
    .replace(DATA_HTML_PATTERN, "");
}

export function normalizeTextInput(value = "") {
  return stripUnsafeFragments(value)
    .replace(/[<>]/g, "")
    .trim();
}

export function containsForbiddenInput(value = "") {
  const raw = String(value);
  return (
    SUSPICIOUS_HTML_CHECK.test(raw) ||
    GENERIC_HTML_TAG_CHECK.test(raw) ||
    INLINE_EVENT_CHECK.test(raw) ||
    JS_PROTOCOL_CHECK.test(raw) ||
    DATA_HTML_CHECK.test(raw) ||
    HTML_BRACKET_CHECK.test(raw)
  );
}

export function validateRequiredText(value, { min = 1, max = 3000 } = {}) {
  const cleanValue = normalizeTextInput(value);

  if (!cleanValue) {
    return "Este campo es obligatorio";
  }

  if (cleanValue.length < min) {
    return `Este campo debe tener al menos ${min} caracteres`;
  }

  if (cleanValue.length > max) {
    return `Este campo no puede superar ${max} caracteres`;
  }

  return "";
}

export function validateName(value, label = "El nombre") {
  const cleanValue = normalizeTextInput(value);

  if (!cleanValue) return `${label} es obligatorio`;
  if (!NAME_PATTERN.test(cleanValue)) return `${label} contiene caracteres no permitidos`;

  return "";
}

export function validateUsername(value) {
  const cleanValue = normalizeTextInput(value);

  if (!cleanValue) return "El nombre de usuario es obligatorio";
  if (!USERNAME_PATTERN.test(cleanValue)) return "El nombre de usuario solo permite letras, numeros, punto, guion y guion bajo";

  return "";
}

export function validateEmail(value) {
  const cleanValue = normalizeTextInput(value).toLowerCase();

  if (!cleanValue) return "El correo electronico es obligatorio";
  if (!EMAIL_PATTERN.test(cleanValue)) return "El correo electronico no es valido";

  return "";
}

export function sanitizeSessionUser(user) {
  if (!user) return null;

  const {
    contrasena_hash,
    password,
    accessToken,
    refreshToken,
    ...safeUser
  } = user;

  return safeUser;
}

export function maskSecret(secret = "") {
  const trimmed = String(secret).trim();
  if (!trimmed) return undefined;

  return `masked_${trimmed.length}_chars`;
}

export function parseJwtPayload(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const decoded = window.atob(normalized);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function isTokenExpired(token, skewSeconds = 30) {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return Number(payload.exp) <= nowInSeconds + skewSeconds;
}

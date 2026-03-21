import { mockAreas } from "./mocks/areas.mock";

export const mockUsers = [
  {
    id: 1,
    nombre: "Joel",
    apellido: "Decoz",
    nombre_usuario: "joel.decoz",
    email: "admin@itsupport.com",
    contrasena_hash: "hash_admin_123",
    rol: "admin",
    estado_cuenta: "activo",
    area_id: null,
  },
  {
    id: 2,
    nombre: "Juan",
    apellido: "Lopez",
    nombre_usuario: "juan.lopez",
    email: "encargado@itsupport.com",
    contrasena_hash: "hash_encargado_123",
    rol: "encargado",
    estado_cuenta: "activo",
    area_id: 4,
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "Ruiz",
    nombre_usuario: "carlos.ruiz",
    email: "tecnico@itsupport.com",
    contrasena_hash: "hash_tecnico_123",
    rol: "tecnico",
    estado_cuenta: "activo",
    area_id: null,
  },
  {
    id: 4,
    nombre: "Ana",
    apellido: "Martinez",
    nombre_usuario: "ana.martinez",
    email: "tecnico2@itsupport.com",
    contrasena_hash: "hash_tecnico2_123",
    rol: "tecnico",
    estado_cuenta: "activo",
    area_id: null,
  },
  {
    id: 5,
    nombre: "Maria",
    apellido: "Garcia",
    nombre_usuario: "maria.garcia",
    email: "encargado2@itsupport.com",
    contrasena_hash: "hash_encargado2_123",
    rol: "encargado",
    estado_cuenta: "suspendido",
    area_id: 10,
  },
];

export const mockUserCredentials = [
  { email: "admin@itsupport.com", password: "admin123", user_id: 1 },
  { email: "encargado@itsupport.com", password: "encargado123", user_id: 2 },
  { email: "tecnico@itsupport.com", password: "tecnico123", user_id: 3 },
  { email: "tecnico2@itsupport.com", password: "tecnico2123", user_id: 4 },
  { email: "encargado2@itsupport.com", password: "encargado2123", user_id: 5 },
];

export function getMockUserById(id) {
  return mockUsers.find((user) => user.id === Number(id)) ?? null;
}

export function getAreaById(areaId) {
  return mockAreas.find((area) => area.id === Number(areaId)) ?? null;
}

export function getAreaDisplay(areaId) {
  const area = getAreaById(areaId);
  return area?.nombreArea ?? null;
}

export function getSucursalDisplayByAreaId(areaId) {
  const area = getAreaById(areaId);
  return area?.nombreSucursal ?? null;
}

export function getUserDisplayName(user) {
  if (!user) return "Sin nombre";
  if (user.nombre && user.apellido) return `${user.nombre} ${user.apellido}`;
  return user.nombre_usuario ?? "Sin nombre";
}

export function enrichMockUser(user) {
  if (!user) return null;

  const area = getAreaById(user.area_id);
  return {
    ...user,
    area: area?.nombreArea ?? null,
    sucursal: area?.nombreSucursal ?? null,
  };
}

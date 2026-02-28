/**
 * Mock de Áreas - Versión simplificada
 * 
 * Campos:
 * - id: Identificador único del área
 * - nombreArea: Nombre del área
 * - sucursalId: ID de la sucursal a la que pertenece
 * - nombreSucursal: Nombre de la sucursal (para mostrar en tabla)
 * - estado: Estado del área ("Activa" o "Inactiva")
 */

import { mockSucursales } from "./sucursales.mock";

// Generar opciones de sucursal para el select
export const SUCURSAL_OPTIONS = mockSucursales
  .filter(s => s.estado === "Activa")
  .map(s => ({ value: s.id, label: s.nombre }));

export const mockAreas = [
  { id: 1, nombreArea: "Recepción Principal", sucursalId: 1, nombreSucursal: "Centro", estado: "Activa" },
  { id: 2, nombreArea: "Almacén A", sucursalId: 1, nombreSucursal: "Centro", estado: "Activa" },
  { id: 3, nombreArea: "Sala de Juntas", sucursalId: 1, nombreSucursal: "Centro", estado: "Activa" },
  { id: 4, nombreArea: "Producción", sucursalId: 2, nombreSucursal: "Norte", estado: "Activa" },
  { id: 5, nombreArea: "Control de Calidad", sucursalId: 2, nombreSucursal: "Norte", estado: "Activa" },
  { id: 6, nombreArea: "Bodega", sucursalId: 4, nombreSucursal: "Oriente", estado: "Activa" },
  { id: 7, nombreArea: "Atención al Cliente", sucursalId: 4, nombreSucursal: "Oriente", estado: "Activa" },
  { id: 8, nombreArea: "Laboratorio", sucursalId: 4, nombreSucursal: "Oriente", estado: "Activa" },
  { id: 9, nombreArea: "Archivo", sucursalId: 4, nombreSucursal: "Oriente", estado: "Inactiva" },
  { id: 10, nombreArea: "Empaque", sucursalId: 5, nombreSucursal: "Poniente", estado: "Activa" },
  { id: 11, nombreArea: "Distribución", sucursalId: 5, nombreSucursal: "Poniente", estado: "Activa" },
  { id: 12, nombreArea: "Mantenimiento", sucursalId: 5, nombreSucursal: "Poniente", estado: "Activa" },
  { id: 13, nombreArea: "Recepción", sucursalId: 6, nombreSucursal: "Noroeste", estado: "Activa" },
  { id: 14, nombreArea: "Sala de Reuniones", sucursalId: 6, nombreSucursal: "Noroeste", estado: "Inactiva" }
];

// Opciones de estado para filtros
export const ESTADO_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "Activa", label: "Activas" },
  { value: "Inactiva", label: "Inactivas" },
];

// Función para obtener el nombre de la sucursal por ID
export const getNombreSucursal = (sucursalId) => {
  const sucursal = mockSucursales.find(s => s.id === sucursalId);
  return sucursal ? sucursal.nombre : "Sin asignar";
};

/**
 * Mock de Sucursales - Simula respuesta de API REST
 * 
 * Campos:
 * - id: Identificador único de la sucursal
 * - nombre: Nombre de la sucursal
 * - zona: Zona o colonia donde se ubica
 * - contacto: Nombre del contacto local
 * - extension: Extensión telefónica
 * - usuariosCount: Número de usuarios en la sucursal
 * - areasCount: Número de áreas operativas
 * - estado: Estado de la sucursal ("Activa" o "Desactivada")
 */

export const mockSucursales = [
  {
    id: 1,
    nombre: "Centro",
    zona: "Centro Histórico",
    direccion: "Av. Principal #123, Col. Centro",
    contacto: "Juan Pérez",
    telefono: "555-0101",
    extension: "Ext. 105",
    horaApertura: "09:00",
    horaCierre: "18:00",
    usuariosCount: 15,
    areasCount: 3,
    estado: "Activa"
  },
  {
    id: 2,
    nombre: "Norte",
    zona: "Zona Industrial",
    direccion: "Blvd. Industrial #456, Nave 3",
    contacto: "María García",
    telefono: "555-0202",
    extension: "Ext. 201",
    horaApertura: "08:00",
    horaCierre: "17:00",
    usuariosCount: 8,
    areasCount: 2,
    estado: "Activa"
  },
  {
    id: 3,
    nombre: "Sur",
    zona: "Residencial Sur",
    direccion: "Calle 5 de Mayo #789",
    contacto: "-",
    telefono: "-",
    extension: "-",
    horaApertura: "",
    horaCierre: "",
    usuariosCount: 0,
    areasCount: 0,
    estado: "Desactivada"
  },
  {
    id: 4,
    nombre: "Oriente",
    zona: "Zona Comercial Oriente",
    direccion: "Plaza Las Américas #101",
    contacto: "Carlos López",
    telefono: "555-0303",
    extension: "Ext. 305",
    horaApertura: "10:00",
    horaCierre: "20:00",
    usuariosCount: 22,
    areasCount: 5,
    estado: "Activa"
  },
  {
    id: 5,
    nombre: "Poniente",
    zona: "Parque Industrial Poniente",
    direccion: "Carretera 40 #Km 5",
    contacto: "Ana Martínez",
    telefono: "555-0404",
    extension: "Ext. 410",
    horaApertura: "07:00",
    horaCierre: "16:00",
    usuariosCount: 12,
    areasCount: 4,
    estado: "Activa"
  },
  {
    id: 6,
    nombre: "Noroeste",
    zona: "Fraccionamiento Vista Bella",
    direccion: "Av. Vista Bella #202",
    contacto: "Roberto Sánchez",
    telefono: "555-0505",
    extension: "Ext. 502",
    horaApertura: "09:00",
    horaCierre: "19:00",
    usuariosCount: 6,
    areasCount: 2,
    estado: "Activa"
  }
];

// Opciones de estado para filtros
export const ESTADO_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "Activa", label: "Activas" },
  { value: "Desactivada", label: "Desactivadas" },
];

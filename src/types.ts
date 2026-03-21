// Tipos TypeScript alineados con esquema DB (snake_case, FKs correctas)

export type RolUsuario = 'admin' | 'encargado' | 'tecnico';

export interface CreateUsuario {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombre_usuario: string;
  email: string;
  contrasena_hash: string;
  rol: RolUsuario;
  estado_cuenta: 'activo' | 'suspendido';
  area_id: number | null;
}

export interface UpdateUsuario {
  nombre?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  nombre_usuario?: string;
  email?: string;
  contrasena_hash?: string;
  rol?: RolUsuario;
  estado_cuenta?: 'activo' | 'suspendido';
  area_id?: number | null;
}

export type PrioridadTicket = 'alta' | 'media' | 'baja';
export type EstadoTicket = 'abierto' | 'en_proceso' | 'cerrado' | 'anulado';

export interface CreateTicket {
  titulo: string;
  descripcion: string;
  area_id: number;
  encargado_id: number;
  prioridad: PrioridadTicket;
  estado?: EstadoTicket;
  tecnico_id?: number | null;
}

export interface Ticket {
  id: string;
  titulo: string;
  descripcion: string;
  area_id: number;
  encargado_id: number;
  tecnico_id: number | null;
  prioridad: PrioridadTicket;
  estado: EstadoTicket;
  fecha_creacion: string;
  historial: Array<{fecha: string; accion: string; tecnico_id?: number | null}>;
  comentarios: Array<{contenido: string; ticket_id: string; usuario_id: number; fecha: string}>;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  nombre_usuario: string;
  email: string;
  contrasena_hash: string;
  rol: RolUsuario;
  estado_cuenta: 'activo' | 'suspendido';
  area_id: number | null;
  sucursal?: string | null;
  area?: string | null;
}

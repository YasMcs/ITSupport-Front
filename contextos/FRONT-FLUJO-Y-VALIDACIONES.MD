# Frontend: Flujo, Roles, Permisos y Validaciones

## Objetivo
Documento vivo del estado actual del frontend: rutas, permisos, flujos funcionales, reglas de validacion, mensajes visibles y puntos que dependen del contrato backend.

## Roles oficiales
- `admin`
- `tecnico`
- `encargado`

Todos se manejan en minusculas.

## Rutas y acceso

### Publicas
- `/login`

### Protegidas por autenticacion
- `/dashboard`
- `/estadisticas`
- `/tickets`
- `/tickets/disponibles`
- `/tickets/:id`
- `/perfil`
- `/acceso-denegado`

### Protegidas por rol `admin`
- `/usuarios`
- `/usuarios/nuevo`
- `/usuarios/editar/:id`
- `/sucursales`
- `/sucursales/nueva`
- `/sucursales/editar/:id`
- `/areas`
- `/areas/nueva`
- `/areas/editar/:id`

### Protegidas por rol `encargado`
- `/tickets/nuevo`

### Redirecciones base
- `/` redirige a `/login`
- rutas desconocidas redirigen a `/login`

## Sesion y acceso

### Login
- Usa correo y contrasena.
- Sanitiza entradas antes de enviar.
- Si la autenticacion es correcta, guarda sesion y token y redirige a `/dashboard`.
- Si hay error de acceso, muestra un mensaje breve y claro para la persona usuaria.

### Logout
- Limpia sesion local.
- Redirige a `/login` con navegacion SPA.
- Ya no usa redireccion forzada que provocaba 404 en hosting.

## Modulo de usuarios

### Listado
- Solo visible para `admin`.
- La tabla muestra unicamente usuarios con rol `tecnico` y `encargado`.
- Ya no muestra usuarios `admin`.
- La columna principal de contexto es `Area`.
- Cuando no hay area:
  - `encargado`: "Sin area asignada"
  - `tecnico`: "No requiere area"

### Crear usuario
- Visible para `admin`.
- Campos visibles:
  - Nombre
  - Apellido paterno
  - Apellido materno
  - Correo electronico
  - Contrasena temporal
  - Rol
  - Area asignada solo si el rol es `encargado`
- Regla de interfaz:
  - En frontend no se muestra un campo llamado "nombre de usuario".
  - El campo `Nombre` del front se mapea al `nombreUsuario` del backend.
- Aviso funcional:
  - El cargo se define al crear el usuario y despues no se modifica desde edicion.

### Editar usuario
- Visible para `admin`.
- Campos editables:
  - Nombre
  - Apellido paterno
  - Apellido materno
  - Correo electronico
  - Contrasena opcional
- Campos no editables:
  - Rol
  - Estado de cuenta
  - Area
- Si la contrasena se deja vacia, no se envia.

### Activar y suspender
- Visible para `admin`.
- Se ejecuta desde listado.
- La tabla se refresca con el resultado real y muestra aviso breve de exito o fallo.

## Modulo de sucursales

### Listado
- Solo visible para `admin`.
- Muestra datos alineados al contrato nuevo:
  - nombre
  - direccion fisica
  - telefono
  - horario de operacion
  - zona
  - estado
  - total de areas
  - total de tickets

### Crear y editar
- Visible para `admin`.
- Campos activos:
  - nombre
  - zona
  - direccion fisica
  - telefono
  - horario de operacion
- Campos eliminados del front por no usarse:
  - extension
  - contacto local
- La edicion ya usa payload completo, no solo renombrado.

### Activar y desactivar
- Visible para `admin`.
- Al ejecutar la accion se refresca la lista completa para evitar inconsistencias.

## Modulo de areas

### Listado
- Solo visible para `admin`.
- Muestra nombre del area, sucursal y estado.

### Crear y editar
- Visible para `admin`.
- Campos activos:
  - nombre del area
  - sucursal
- La edicion puede mover el area a otra sucursal usando el endpoint especifico de cambio de sucursal.

### Activar y desactivar
- Visible para `admin`.
- La lista se recarga despues de la accion.

## Modulo de tickets

### Vista de `encargado`
- Puede crear tickets en `/tickets/nuevo`.
- Ve sus tickets creados en `/tickets`.
- Puede abrir detalle del ticket.
- Puede comentar en el detalle.

### Vista de `tecnico`

#### Mis tickets
- `/tickets`
- Se muestra como bandeja de trabajo en tabla.
- Ya no usa kanban.
- El objetivo es revisar, abrir y cerrar tickets reales.

#### Tickets disponibles
- `/tickets/disponibles`
- Se muestran en cards.
- Cada card incluye:
  - folio
  - titulo
  - descripcion breve
  - area
  - sucursal
  - prioridad
  - fecha de creacion
  - boton `Tomar ticket`
- Esta vista ya no muestra contadores ni bloques repetidos que compitan con las cards.

#### Tomar ticket
- Al tomar un ticket:
  - desaparece de disponibles
  - entra a mis tickets
  - se muestra confirmacion breve

### Vista de `admin`
- Usa `GET /api/tickets` como fuente global confirmada.
- La tabla de tickets para admin ya muestra mejor contexto:
  - numero
  - titulo
  - area
  - prioridad
  - estado
  - responsable
  - tecnico
  - fecha
  - acciones

## Detalle de ticket

### Carga por rol
- `admin`: usa detalle directo
- `tecnico`: carga desde sus tickets asignados
- `encargado`: carga desde sus tickets creados

### Estructura actual
- Header con:
  - folio
  - situacion
  - prioridad
  - boton `Cerrar ticket` solo cuando realmente aplica
- Seccion de descripcion
- Seccion de comentarios
- Sidebar con:
  - resumen operativo
  - contexto del ticket

### Reglas actuales
- Ya no existe selector falso de estados.
- Si la unica accion real es cerrar, solo se expone esa accion.
- Historial fue eliminado por no aportar datos utiles.
- Se ocultan comentarios automaticos ruidosos de asignacion cuando no aportan valor conversacional.
- El contacto solo se muestra para `tecnico` y se presenta como contacto del encargado del area.

## Dashboard
- Usa tickets acotados por rol.
- Muestra resumenes segun el contexto:
  - `admin`: vision global
  - `tecnico`: tickets asignados
  - `encargado`: tickets creados

## Estadisticas
- Usa tickets acotados por rol.
- Ya no muestra metricas engañosas como tiempo de respuesta o SLA falso.
- Ahora prioriza metricas directas:
  - pendientes
  - cerrados
  - anulados
  - total registrados
- Se corrigieron comparaciones de ids para evitar fallos por tipo string o number.

## Navbar y elementos omitidos
- La campanita de notificaciones fue retirada temporalmente.
- Se retomara cuando exista un flujo real de notificaciones.
- Se removio el boton de "Generar reporte" en tickets por ser solo placeholder.

## Validaciones y estilo de feedback

### Principios actuales
- Los mensajes visibles deben ser breves, claros y no tecnicos.
- No deben hablar de backend, servidor, stack trace ni detalles internos.
- Las validaciones por campo deben mostrarse cerca del campo cuando aplica.
- Los fallos generales deben mostrarse con mensajes resumidos.

### Reglas ya usadas
- Sanitizacion de texto en entradas libres.
- Bloqueo de contenido sospechoso tipo etiquetas o scripts.
- Validacion de correo.
- Validacion de longitud minima y maxima.
- Validacion condicional por rol o contexto.

### Formularios que ya siguen este enfoque
- Login
- Crear ticket
- Crear y editar usuario
- Crear y editar area
- Crear y editar sucursal

### Comportamiento esperado de feedback
- Error por campo: inline
- Error general de guardado: breve y accionable
- Exito: confirmacion corta
- Carga: mensaje simple

## Estado actual de consistencia de formularios

### Ya alineados
- Login
- Ticket
- Usuario
- Area
- Sucursal

### Que ya se ajusto
- Los formularios de area y sucursal ya usan el mismo criterio base:
  - campos obligatorios
  - contenido valido
  - mensajes simples
  - boton en estado `Validando...`
- El formulario de usuario ya muestra error general del guardado dentro de la vista.

## Dependencias backend que siguen siendo relevantes
- Confirmar autorizacion real de `GET /api/tickets` para `admin` en produccion si vuelve a aparecer `403`.
- Mantener consistencia de DTOs de usuario, area, sucursal y ticket para evitar fallos de mapeo.

## Resumen ejecutivo
- Login funcional y protegido.
- Roles y rutas principales alineados.
- CRUD de usuarios, areas y sucursales operativo.
- Tickets funcionales para encargado y tecnico con flujo mas honesto y usable.
- Admin ya usa fuente global de tickets.
- Detalle de ticket simplificado y mas util.
- Mensajes y validaciones mas consistentes en toda la app.

# Frontend: Flujo, Roles, Permisos y Validaciones

## Objetivo
Documento vivo del estado actual del frontend: rutas, permisos, flujos funcionales, validaciones, notificaciones y decisiones visibles para la persona usuaria.

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
- `/usuarios/:id`
- `/usuarios/editar/:id`
- `/sucursales`
- `/sucursales/nueva`
- `/sucursales/:id`
- `/sucursales/editar/:id`
- `/areas`
- `/areas/nueva`
- `/areas/:id`
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
- Usa helpers de `security.js` para validar contenido y correo.
- Si la autenticacion es correcta:
  - guarda usuario en `sessionStorage`
  - guarda token
  - actualiza contexto de autenticacion
  - redirige a `/dashboard`
- Si hay error de acceso, muestra un mensaje breve y claro.

### Logout
- Limpia sesion local.
- Elimina token.
- Redirige a `/login` con navegacion SPA.

### Sesion expirada o invalida
- Si el token JWT ya expiro al abrir la app:
  - el frontend limpia sesion local
  - no monta al usuario como autenticado
- Si una request protegida responde `401` o `403`:
  - el frontend limpia sesion
  - muestra `Tu sesion expiro`
  - y obliga a volver a login

## Arquitectura funcional resumida

### Layout global
- `AppLayout` controla:
  - navbar
  - sidebar
  - fondo global
  - scroll principal del `main`
- El detalle de ticket usa una excepcion de layout para evitar doble scroll.

### Contextos activos
- `AuthContext`
  - sesion, rol y login/logout
- `WebSocketContext`
  - conexion socket
  - toasts
  - bandeja ligera de notificaciones
- `TicketContext`
  - existe, pero hoy tiene uso minimo frente al flujo real basado en servicios por vista

### Servicios
- `api.js`
  - cliente axios y token
  - interceptor global de autenticacion
- `authService.js`
- `ticketService.js`
- `commentService.js`
- `userService.js`
- `areaService.js`
- `sucursalService.js`
- `websocketService.js`

## Modulo de usuarios

### Listado
- Solo visible para `admin`.
- La tabla muestra usuarios `tecnico` y `encargado`.
- La fila completa lleva a vista de visualizacion.
- Los botones de accion se conservan.

### Visualizar usuario
- Ruta: `/usuarios/:id`
- Usa la misma base visual del formulario en modo solo lectura.
- Tiene boton para ir a editar.

### Crear usuario
- Visible para `admin`.
- Campos:
  - nombre
  - apellido paterno
  - apellido materno
  - correo electronico
  - contrasena temporal
  - rol
  - area asignada solo si el rol es `encargado`
- Regla visual y funcional:
  - el cargo se define al crear y no se cambia en edicion

### Editar usuario
- Visible para `admin`.
- Campos editables:
  - nombre
  - apellido paterno
  - apellido materno
  - correo electronico
  - contrasena opcional
- Campos no editables:
  - rol
  - area
  - estado de cuenta

### Activar y suspender
- Visible para `admin`.
- Se ejecuta desde listado.
- La lista se refresca despues de la accion.

## Modulo de sucursales

### Listado
- Solo visible para `admin`.
- La fila completa lleva a vista de visualizacion.
- Los botones de accion se conservan.

### Visualizar sucursal
- Ruta: `/sucursales/:id`
- Reutiliza estructura de formulario en modo solo lectura.
- Tiene boton para ir a editar.

### Crear y editar
- Visible para `admin`.
- Campos activos:
  - nombre
  - zona
  - direccion fisica
  - telefono
  - horario de operacion
- Campos omitidos en frontend:
  - extension
  - contacto local

### Activar y desactivar
- Visible para `admin`.
- La lista se recarga despues de la accion.

## Modulo de areas

### Listado
- Solo visible para `admin`.
- La fila completa lleva a vista de visualizacion.
- Los botones de accion se conservan.

### Visualizar area
- Ruta: `/areas/:id`
- Reutiliza estructura de formulario en modo solo lectura.
- Tiene boton para ir a editar.

### Crear y editar
- Visible para `admin`.
- Campos activos:
  - nombre del area
  - sucursal

### Activar y desactivar
- Visible para `admin`.
- La lista se recarga despues de la accion.

## Modulo de tickets

## Vista de `admin`
- Usa `GET /api/tickets` como fuente global.
- Mantiene tabla, porque su trabajo sigue siendo mas administrativo y de supervision.
- La fila completa lleva al detalle.

## Vista de `tecnico`

### Mis tickets
- Ruta: `/tickets`
- Se muestra como bandeja de trabajo en cards.
- Ya no usa kanban.
- Por defecto muestra activos primero.
- Tiene control:
  - `Activos`
  - `Todos`
- Los cerrados quedan fuera del foco por defecto.
- Cada card:
  - es clickeable a detalle
  - muestra prioridad
  - muestra situacion
  - muestra area
  - muestra fecha

### Tickets disponibles
- Ruta: `/tickets/disponibles`
- Se muestran en cards.
- Cada card incluye:
  - folio
  - titulo
  - descripcion breve
  - area
  - sucursal
  - prioridad
  - fecha
  - boton `Tomar ticket`
- Mantiene boton explicito para evitar asignaciones accidentales.

### Tomar ticket
- Al tomar un ticket:
  - desaparece de disponibles
  - entra a mis tickets
  - se muestra confirmacion breve

## Vista de `encargado`

### Mis tickets
- Ruta: `/tickets`
- Ya no usa tabla.
- Ahora se muestra como panel de seguimiento en cards.
- Tiene control:
  - `Activos`
  - `Todos`
- Los tickets cerrados quedan fuera del foco por defecto.
- Cada card muestra:
  - folio
  - titulo
  - descripcion breve
  - prioridad
  - situacion
  - sucursal
  - area
  - tecnico asignado si ya existe
  - fecha de creacion
  - fecha de cierre si aplica
- Toda la card abre el detalle.

### Crear ticket
- Ruta: `/tickets/nuevo`
- Solo `encargado`.
- Despues de crear, vuelve al modulo de tickets.

## Detalle de ticket

### Carga por rol
- `admin`: usa detalle global
- `tecnico`: carga desde sus tickets asignados
- `encargado`: carga desde sus tickets creados

### Estructura visual actual
- Columna izquierda:
  - descripcion del fallo
  - contexto del ticket
  - ubicacion y contacto
  - boton `Cerrar ticket` cuando aplica
- Columna derecha:
  - panel fijo de comentarios
  - scroll interno
  - area de escritura fija al fondo

### Reglas funcionales
- Ya no existe selector falso de estados.
- Si la unica accion real es cerrar, solo se expone esa accion.
- Cuando el ticket se cierra:
  - se bloquea el comentario
  - se muestra aviso breve en el area de escritura
- El historial viejo fue eliminado por no aportar datos reales.
- El chat alinea mensajes asi:
  - mensaje propio a la derecha
  - mensaje ajeno a la izquierda
  - `admin` ve todo a la izquierda como observador

## Dashboard
- Usa tickets acotados por rol.
- `Tickets criticos` ya no muestra tickets cerrados.

## Estadisticas
- Usa tickets acotados por rol.
- Ya no muestra metricas engañosas como tiempo de respuesta o SLA falso.
- Priorizan metricas directas:
  - pendientes
  - cerrados
  - anulados
  - total registrados

## WebSockets y notificaciones

### Conexion
- Se conecta con SockJS + STOMP.
- Endpoint actual:
  - `/api/ws`
- Librerias usadas:
  - `@stomp/stompjs`
  - `sockjs-client`

### Suscripciones activas
- globales:
  - `/topic/tickets/nuevo`
  - `/topic/tickets/actualizacion`
  - `/topic/tickets/cerrado`
- privadas:
  - `/user/queue/asignacion`
  - `/user/queue/comentarios`
- por ticket:
  - `/topic/tickets/{id}/comentarios`

### Que hace hoy
- muestra toasts en tiempo real
- agrega comentarios en vivo en detalle
- mantiene una bandeja ligera en la campanita del navbar

### Reglas por rol
- `admin`
  - nuevo ticket
  - ticket cerrado
- `tecnico`
  - nuevo ticket
  - ticket actualizado
  - ticket asignado
  - comentario nuevo
  - ticket cerrado
- `encargado`
  - ticket asignado
  - comentario nuevo
  - ticket cerrado

### Ejemplos de copy actual
- `Nuevo ticket`: `Hay un ticket nuevo por atender en la bandeja: #...`
- `Ticket asignado`: `Un tecnico ya esta atendiendo el ticket #...`
- `Nuevo comentario`: `Nombre agrego un comentario en el ticket #...`

## Navbar y bandeja de notificaciones
- La campanita ya no es decorativa.
- Muestra:
  - contador de no leidas
  - ultimas notificaciones recientes
  - tiempo relativo
- Al abrirla:
  - marca la bandeja como leida
- Si la notificacion tiene ticket asociado:
  - puede llevar al detalle

## Validaciones y feedback

### Principios actuales
- mensajes breves
- no tecnicos
- sin mencionar backend, stack o detalles internos
- errores por campo cerca del campo cuando aplica
- errores generales resumidos y accionables

### Reglas ya usadas
- sanitizacion de texto
- bloqueo de contenido sospechoso
- validacion de correo
- validacion de longitud
- validacion condicional por rol o contexto
- validacion local de expiracion JWT

### Formularios ya alineados
- login
- ticket
- usuario
- area
- sucursal

### Comportamiento esperado
- error por campo: inline
- error general: breve
- exito: corto
- carga: simple

## Filtros y componentes compartidos

### FilterBar
- Usa tamaños mas uniformes.
- Ya no se estira de forma distinta segun cuantas opciones haya.
- En tickets, el estado ya responde a la logica actual:
  - `Sin tecnico`
  - `Con tecnico`
  - `Resuelto`

### Select compartido
- Ya no usa el desplegable nativo del navegador.
- Tiene dropdown propio oscuro y redondeado.
- Si el valor actual es `Todos` o `Todas`, el campo minimizado vuelve a mostrar el nombre real del filtro.

### Table compartida
- Soporta fila completa clickeable.
- Respeta acciones internas con `data-row-action="true"`.

## Estado actual de consistencia

### Solido
- autenticacion
- rutas por rol
- CRUD base de usuarios, areas y sucursales
- flujo real de tickets para tecnico y encargado
- detalle de ticket mas honesto
- notificaciones websocket funcionales
- mensajes visibles mas consistentes

### Puntos de mantenimiento
- `TicketContext` hoy tiene uso bajo frente al flujo real por servicios
- la documentacion vieja de `utils/README.md` ya no refleja del todo el estado actual del proyecto

## Resumen ejecutivo
- Login funcional y protegido.
- Roles y rutas principales alineados.
- CRUD de usuarios, areas y sucursales operativo con vistas de solo lectura.
- Tickets funcionales para admin, tecnico y encargado con flujos mas claros por rol.
- Detalle de ticket simplificado, mas util y con comentarios en tiempo real.
- WebSockets conectados y visibles en campanita y toasts.
- Validaciones y feedback bastante mas consistentes que al inicio del proyecto.

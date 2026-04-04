# Frontend: Flujo, Roles, Permisos y Validaciones

## Objetivo
Este documento resume el estado actual del frontend, los flujos funcionales, los permisos por rol, las validaciones visibles para el usuario y los puntos que siguen dependiendo del backend.

No sustituye `ENDPOINTS.MD`.  
`ENDPOINTS.MD` documenta la API.  
Este archivo documenta el comportamiento real del frontend.

---

## Estado actual del enrutado

### Inicio
- La ruta `/` redirige a `/login`.
- El login principal es la pantalla de acceso de entrada.

### Proteccion de rutas
- Temporalmente las rutas del frontend estan desprotegidas para facilitar pruebas.
- `ProtectedRoute` solo envuelve las vistas con `AppLayout`.
- La proteccion real hoy la sigue imponiendo el backend por token y permisos.

### Implicacion
- Se puede navegar a pantallas sin bloqueo del router.
- Si el endpoint no permite la accion, la API responde con error y el frontend lo muestra.

---

## Roles del sistema

Los roles normalizados en frontend son:

- `admin`
- `tecnico`
- `encargado`

El frontend trabaja internamente con esos valores en minusculas.

---

## Reglas generales de UX y feedback

### Mensajes al usuario
- Los mensajes visibles se estan unificando para que sean:
  - claros
  - breves
  - no tecnicos
  - sin mencionar backend, CORS, servidor o detalles internos

### Alertas y toasts
- Se priorizan mensajes utiles para:
  - guardado exitoso
  - activacion / desactivacion
  - suspension / reactivacion
  - cierre de ticket
  - errores de validacion o permisos

- Se evitaron toasts redundantes en:
  - validaciones que ya se ven en formulario
  - cargas silenciosas
  - acciones sin valor real

### Consola y errores internos
- El usuario no debe ver mensajes tecnicos.
- Cuando una accion falla, se intenta mostrar una causa simple o un fallback claro.

---

## Login y sesion

### Flujo actual
- El usuario entra por `/login`.
- Se valida:
  - email valido
  - contrasena obligatoria
  - bloqueo de contenido no permitido

### Resultado esperado
- Login correcto:
  - guarda sesion
  - guarda token
  - redirige a `/dashboard`

- Login incorrecto:
  - muestra mensaje inline en el formulario

### Nota
- El cierre de sesion ya no hace recarga dura a `/login`.
- Se navega por React Router y ya no debe provocar 404 del hosting.

---

## Usuarios

## Vista de listado
- El listado de usuarios muestra solo:
  - `tecnico`
  - `encargado`

- Los usuarios `admin` no se muestran en la tabla.

### Columnas principales
- Usuario
- Rol
- Area
- Estado
- Acciones

### Comportamiento del campo Area
- Si el usuario es `encargado` y no tiene area:
  - se muestra `Sin area asignada`
- Si el usuario no requiere area, por ejemplo `tecnico`:
  - se muestra `No requiere area`

## Creacion de usuario

### Funciona actualmente
- Crear usuario desde admin.
- El cargo se define al crear.
- El cargo no se modifica despues desde la edicion.

### Validaciones visibles
- Nombre obligatorio
- Apellido paterno obligatorio
- Apellido materno obligatorio
- Email valido
- Contrasena minima
- Rol obligatorio
- Si el rol es `encargado`, area obligatoria
- Se bloquea contenido no permitido

### Contrato actual esperado
- El frontend envia:
  - `nombreUsuario`
  - `apellidoPaterno`
  - `apellidoMaterno`
  - `email`
  - `contrasena`
  - `rol`
  - `areaId` cuando aplica

## Edicion de usuario

### Permitido en frontend
- Nombre
- Apellido paterno
- Apellido materno
- Correo
- Contrasena opcional

### No permitido
- Cambio de cargo / rol desde la edicion

### Motivo funcional
- El cargo queda fijo por seguridad.
- Si en backend se requiere reasignacion de area o encargado, ese flujo debe definirse aparte.

### Endpoint actual usado
- `PUT /api/usuarios/admin/{id}`

### Nota importante
- Si el backend exige actualizacion completa, aunque el usuario cambie un solo campo, el frontend debe seguir enviando todos los campos requeridos por ese endpoint.

## Suspender / activar usuario
- Funciona desde la tabla de usuarios.
- Muestra confirmacion modal.
- Actualiza visualmente el estado del registro.

---

## Sucursales

## Listado
- Muestra datos reales segun DTO actual.
- Incluye informacion operativa como nombre, zona, telefono, direccion y totales.

## Crear sucursal
- Funciona con contrato actualizado.
- Campos requeridos:
  - nombre
  - zona
  - direccion fisica
  - telefono
  - horario de operacion

## Editar sucursal
- Funciona con endpoint de actualizacion completa.
- Ya no se renderiza vacia si falla la carga.
- Si la carga falla, se muestra mensaje claro en vez de abrir un formulario roto.

## Activar / desactivar sucursal
- Funciona.
- La lista se refresca desde backend despues de la accion.

---

## Areas

## Listado
- Muestra areas reales.
- Permite buscar y filtrar.

## Crear area
- Funciona.
- Requiere:
  - nombre de area
  - sucursal

## Editar area
- Funciona con nombre y cambio de sucursal.
- Si falla la carga, ya no se queda en estado infinito.
- Si una parte de la actualizacion falla, el servicio intenta no dejar cambios silenciosos a medias.

## Activar / desactivar area
- Funciona.
- La lista se refresca desde backend despues de la accion.

---

## Tickets

El modulo de tickets ya no se modela como un kanban editable universal.

La logica real del frontend se esta alineando a acciones existentes:

- crear ticket
- tomar ticket
- ver detalle
- comentar
- cerrar ticket

## Encargado

### Flujo actual
- Puede crear tickets
- Puede ver sus tickets creados
- Puede entrar al detalle
- Puede comentar

### Vista
- `/tickets`
- tabla/listado de sus tickets

## Tecnico

### Flujo actual
- Puede ver `Mis tickets`
- Puede ver `Tickets disponibles`
- Puede tomar un ticket disponible
- Puede entrar al detalle
- Puede cerrar el ticket si es el tecnico asignado
- Puede comentar

### Navegacion actual
- `/tickets` -> `Mis tickets`
- `/tickets/disponibles` -> `Tickets disponibles`

### Decisiones de UX actuales
- `Mis tickets` ya no usa kanban
- Se usa una bandeja de trabajo en tabla
- `Disponibles` se mantiene en cards para explorar y tomar tickets

### Accion principal
- `Tomar ticket`
- Desaparece de disponibles y se agrega a la bandeja del tecnico

## Admin

### Flujo esperado
- Admin debe poder ver la lista global de tickets
- Admin debe usar `GET /api/tickets`
- Esa fuente tambien alimenta:
  - `Tickets`
  - `Dashboard`
  - `Estadisticas`

### Estado actual
- El frontend ya apunta a `GET /api/tickets` para admin
- Si la lista no aparece y responde `403`, el problema es de permisos o lectura de rol en backend, no de payload del frontend

## Crear ticket

### Flujo actual
- Solo `encargado`
- Requiere:
  - titulo
  - descripcion
  - prioridad
  - area

### Validaciones visibles
- titulo obligatorio
- descripcion obligatoria
- area obligatoria
- bloqueo de contenido no permitido

## Detalle de ticket

### Flujo actual
- Carga el ticket segun rol
- Si el rol es `encargado`, intenta resolver desde sus tickets creados
- Si el rol es `tecnico`, intenta resolver desde sus tickets asignados
- Si es admin, usa el detalle directo por id

### Reglas actuales
- Admin puede ver, no comentar ni cerrar
- Encargado creador puede ver y comentar
- Tecnico asignado puede ver, comentar y cerrar

### Jerarquia visual actual
- Encabezado con situacion y prioridad
- Descripcion
- Comentarios
- Resumen operativo
- Contexto del ticket

### Comentarios
- El input queda arriba
- La conversacion existente queda abajo
- Se intenta ocultar ruido como comentarios automaticos de asignacion cuando no aportan seguimiento real

### Cierre de ticket
- Solo se expone como una accion real:
  - `Cerrar ticket`
- Ya no se simula un selector completo de estados si el backend no lo soporta

### Historial
- Se elimino de la vista porque no aportaba valor real con la informacion actual

### Contacto
- En detalle del tecnico, se muestra como:
  - `Contacto del encargado del area`
- Solo se muestra para el rol `tecnico`

---

## Dashboard

## Estado actual
- Consume tickets segun rol usando `ticketService.getScoped(role)`

### Tecnico
- Resume su carga personal

### Encargado
- Resume sus tickets creados

### Admin
- Debe resumir la vista global
- Si no carga, el problema ya no es la ruta del front, sino la autorizacion real de `GET /api/tickets`

---

## Estadisticas

## Estado actual
- Consume tickets segun rol usando `ticketService.getScoped(role)`
- Ya no muestra metricas engañosas como:
  - tiempo de respuesta basado en comentarios
  - un falso SLA

### Metricas actuales
- Tickets pendientes
- Tickets cerrados
- Tickets anulados
- Total registrados

### Graficos actuales
- Tickets por prioridad
- Areas con mas incidencias
- Atencion requerida

### Nota
- `Atencion requerida` sigue siendo una heuristica basada en fechas y actividad reciente, no una regla formal de negocio.

---

## Navbar

## Estado actual
- La campanita de notificaciones se removio temporalmente
- No existe aun un flujo funcional de notificaciones en tiempo real en el frontend

---

## Validaciones comunes del frontend

En formularios principales, el frontend valida antes de enviar:

- campos obligatorios
- longitud minima y maxima
- formato de email
- contenido no permitido
- reglas condicionales por rol

### Regla general de seguridad visible
- Si se detecta contenido no permitido, el usuario ve un mensaje simple como:
  - `Usa solo texto valido en este campo.`

---

## Puntos que siguen dependiendo del backend

### 1. Tickets globales para admin
- El frontend ya usa `GET /api/tickets`
- Si responde `403`, backend debe revisar permisos reales del rol `admin`

### 2. Comentarios y datos del ticket
- El detalle depende de que el DTO del ticket incluya bien:
  - ids de tecnico y encargado
  - nombre de participantes
  - datos de contexto

### 3. Metricas avanzadas
- Si mas adelante se requieren estadisticas operativas reales, convendria que backend exponga indicadores dedicados y no depender de calculos heurísticos del frontend

---

## Resumen ejecutivo

Hoy el frontend ya tiene funcionales estos bloques:

- login y sesion
- usuarios
- areas
- sucursales
- tickets para encargado
- tickets para tecnico
- detalle de ticket
- dashboard por rol
- estadisticas basicas por rol
- mensajes y feedback visibles mas consistentes

Los principales puntos todavia sensibles son:

- permisos reales de tickets para `admin`
- cualquier flujo nuevo que dependa de eventos o datos adicionales no incluidos aun en el DTO del backend


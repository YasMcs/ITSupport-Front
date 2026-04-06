# Arquitectura Frontend Actual

## Objetivo
Resumen corto de la estructura actual del proyecto, sus decisiones sanas, los puntos fuertes y la deuda tecnica visible.

## Estructura principal

### `src/components`
Contiene piezas reutilizables y modulares.

- `ui/`
  - base visual reutilizable
  - `Button`, `Input`, `FormField`, `Badge`, `Table`, `Select`, `FilterBar`, `Modal`
- `layout/`
  - `AppLayout`
  - `Navbar`
  - `Sidebar`
  - `PageWrapper`
- `tickets/`
  - tabla, cards y formulario del modulo
- `usuarios/`, `areas/`, `sucursales/`
  - formularios y tablas por modulo

### `src/pages`
Pone el flujo real de cada vista.

- vistas de login y acceso
- dashboard y estadisticas
- tickets
- formularios y detalle de usuarios, areas y sucursales

### `src/context`
- `AuthContext`
- `WebSocketContext`
- `TicketContext`

### `src/services`
Encapsula acceso remoto y reglas de consumo:
- `api.js`
- servicios por modulo
- `websocketService.js`

### Librerias y herramientas visibles en la arquitectura
- `axios`
  - cliente HTTP e interceptores globales
- `react-router-dom`
  - ruteo, proteccion de vistas y navegacion SPA
- `sonner`
  - toasts y feedback global
- `@stomp/stompjs`
  - cliente STOMP para eventos en tiempo real
- `sockjs-client`
  - transporte websocket compatible con backend

### `src/utils`
Transformaciones, formato, seguridad, feedback y metricas.

### `src/routes`
- `AppRouter`
- `ProtectedRoute`

### `src/constants`
- `roles`
- prioridades y estados

## Decisiones de arquitectura que hoy se ven sanas

### 1. Separacion clara entre vista y consumo de datos
- las paginas consumen servicios
- los servicios concentran endpoints
- el cliente axios centraliza token
- los interceptores centralizan reaccion a sesion invalida

### 2. Componentes reutilizables bien enfocados
- `Button`, `Table`, `Select`, `Badge`, `FormField` y `FilterBar` ya sostienen gran parte de la consistencia visual
- esto evita reescribir estilos por modulo

### 3. Ruteo por rol bien aterrizado
- `ProtectedRoute` controla el acceso
- el `Sidebar` adapta navegacion por rol
- las vistas ya no dependen solo de ocultar botones

### 4. Contextos con responsabilidad concreta
- `AuthContext` para sesion
- `WebSocketContext` para actividad en tiempo real y bandeja ligera
- `AuthContext` ya valida expiracion local del token al iniciar

### 5. Lenguaje visual compartido
- cards glass
- fondo global
- badges coherentes
- dropdown propio para selects

## Buenas practicas que ya se estan cumpliendo

### Nombres y carpetas
- la estructura por dominio esta clara
- los archivos de pagina estan separados de los componentes base

### Reutilizacion
- tablas, formularios y selects comparten piezas
- las vistas de visualizacion reutilizan formularios en solo lectura

### Seguridad y feedback
- sanitizacion
- mensajes no tecnicos
- rutas protegidas
- token centralizado
- reaccion global ante `401/403`

### Integracion gradual
- la app ya no depende de mocks para el flujo principal
- WebSockets se agregaron sin romper el resto de la arquitectura
- ya se removieron restos de arranque que no tenian referencias activas

## Puntos que conviene cuidar o limpiar

### 1. `TicketContext` tiene poco peso real
Hoy existe, pero el flujo actual de tickets ya vive mas en servicios y estado local por pagina.

Recomendacion:
- decidir si se fortalece como store real
- o si se elimina para no mantener contexto con uso marginal

### 2. Documentacion utilitaria vieja
[`README.md`](c:/Users/yasbe/Downloads/ITSupport/src/utils/README.md) sigue describiendo dummies y roles antiguos.

Recomendacion:
- actualizarla
- o retirarla si ya no aporta

### 3. Conviene seguir cuidando el limite entre pagina y componente
`TicketsPage.jsx` ya concentra bastante logica de vista.

No esta mal, pero si sigue creciendo convendria extraer:
- cards de encargado
- cards de tecnico
- helpers de ordenamiento y filtros

## Recomendacion de mantenimiento

### Corto plazo
- revisar `TicketContext`
- actualizar documentacion vieja de `utils`

### Mediano plazo
- extraer piezas de `TicketsPage.jsx`
- seguir consolidando componentes de detalle y listas
- definir un criterio unico para hooks de datos por modulo

## Conclusion
La arquitectura actual ya se ve bastante mas madura que una app de maqueta inicial:
- hay separacion real de responsabilidades
- la UI base es reutilizable
- los roles estan bien aterrizados
- el proyecto ya tiene una base mantenible

La principal mejora pendiente no es rehacer la arquitectura, sino seguir modularizando las vistas mas grandes y decidir si `TicketContext` todavia aporta valor real.

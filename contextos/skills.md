# Estructura de Carpetas src/

## Descripción General

Este documento define la estructura de carpetas y organización de archivos en el directorio `src/` del proyecto IT Support. Esta estructura debe seguirse estrictamente para mantener la consistencia y facilitar el mantenimiento del código.

## Estructura Completa

```
src/
├── assets/              # Recursos estáticos
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes UI base
│   ├── layout/          # Componentes de layout
│   └── tickets/         # Componentes específicos de tickets
├── pages/               # Componentes de página
│   └── auth/            # Páginas de autenticación
├── context/             # Contextos de React (estado global)
├── hooks/               # Custom hooks
├── services/            # Servicios HTTP (Axios)
├── routes/              # Configuración de rutas
├── utils/               # Utilidades y helpers
├── constants/           # Constantes del proyecto
├── App.jsx              # Componente raíz
└── main.jsx             # Punto de entrada
```

## Descripción Detallada

### `src/assets/`
**Propósito**: Imágenes, iconos, fuentes y otros recursos estáticos.

- Imágenes del proyecto
- Iconos y SVGs
- Fuentes personalizadas (si las hay)
- Otros archivos estáticos

### `src/components/`
**Propósito**: Componentes reutilizables usados en múltiples páginas.

#### `src/components/ui/` — Componentes UI base genéricos
Componentes básicos y reutilizables que forman la base de la interfaz:

- `Button.jsx` — Botón reutilizable con variantes (primary, secondary, danger)
- `Input.jsx` — Input de formulario con label y manejo de errores
- `Modal.jsx` — Modal/dialogo reutilizable
- `Badge.jsx` — Indicador de estado de ticket (`abierto`, `en_proceso`, `cerrado`)
- `Table.jsx` — Tabla genérica y configurable. Reutilizada para tickets, usuarios, áreas, sucursales

#### `src/components/layout/` — Shell de la aplicación y layout
Componentes que definen la estructura visual de la aplicación:

- `Navbar.jsx` — Barra de navegación superior
- `Sidebar.jsx` — Menú lateral que cambia según el rol del usuario autenticado
- `PageWrapper.jsx` — Contenedor general para cada página (padding, título, layout, etc.)

#### `src/components/tickets/` — Componentes específicos de tickets
Componentes reutilizables relacionados con tickets:

- `TicketTable.jsx` — Componente de lista de tickets. Recibe datos/columnas vía props
- `TicketCard.jsx` — Vista compacta de resumen de ticket
- `TicketForm.jsx` — Formulario de crear/editar ticket. Reutilizado para ambos flujos
- `TicketDetail.jsx` — Vista completa de detalle de ticket

### `src/pages/` — Un componente de página por vista (agnóstico de rol)
**Propósito**: Componentes de página, uno por cada vista de la aplicación.

- `auth/LoginPage.jsx` — Página de inicio de sesión
- `TicketsPage.jsx` — Usa `TicketTable`; los resultados se filtran por rol vía hooks, no páginas separadas
- `TicketDetailPage.jsx` — Usa `TicketDetail`
- `NuevoTicketPage.jsx` — Usa `TicketForm`
- `UsersPage.jsx` — Solo admin
- `AreasPage.jsx` — Solo admin
- `SucursalesPage.jsx` — Solo admin

### `src/context/` — Estado global vía Context API
**Propósito**: Manejo de estado global usando React Context.

- `AuthContext.jsx` — Usuario autenticado y su rol
- `TicketContext.jsx` — Estado global de tickets, si es necesario (ej. caché, filtros compartidos)

### `src/hooks/` — Custom hooks
**Propósito**: Hooks personalizados para lógica reutilizable.

- `useAuth.js` — Acceso a `AuthContext`, usuario y rol
- `useTickets.js` — Obtiene y filtra tickets según el rol del usuario actual

### `src/services/` — Llamadas HTTP (Axios)
**Propósito**: Todas las llamadas HTTP al backend.

- `authService.js` — Servicios de autenticación
- `ticketService.js` — Servicios de tickets
- `userService.js` — Servicios de usuarios
- `areaService.js` — Servicios de áreas
- `sucursalService.js` — Servicios de sucursales

### `src/routes/`
**Propósito**: Configuración de enrutamiento.

- `AppRouter.jsx` — Configuración principal de rutas
- `ProtectedRoute.jsx` — Protege rutas por rol; redirige si no está autorizado

### `src/utils/`
**Propósito**: Funciones utilitarias y helpers.

- `formatDate.js` — Formateo de fechas
- Opcional: datos de prueba, helpers, o carpeta `mocks/` para datos dummy

### `src/constants/`
**Propósito**: Constantes centralizadas del proyecto.

- `roles.js` — Constantes de roles centralizadas
- `ticketStatus.js` — Constantes de estado de ticket centralizadas

### Archivos Raíz de `src/`
- `App.jsx` — Componente raíz de la aplicación
- `main.jsx` — Punto de entrada de la aplicación

## Filosofía de Componentes y Páginas

### Una sola `TicketsPage.jsx` para todos los roles
- **NO** crear páginas duplicadas como `TicketsAdminPage` / `TicketsSoportePage`
- El comportamiento basado en roles viene de hooks (ej. `useTickets`) y context, no de páginas separadas

### `TicketForm.jsx` = crear + editar
- Reutilizar el mismo componente de formulario para ambos flujos (crear y editar)
- Para editar, pasar valores iniciales vía props

### `Sidebar.jsx` depende del rol
- `Sidebar` lee el rol desde `AuthContext` (ej. vía `useAuth`)
- Cada rol ve solo las opciones de menú relevantes (ej. páginas solo para admin)

### `Table.jsx` es una tabla genérica y reutilizable
- Toma columnas y datos configurables vía props
- Reutilizar para:
  - Listas de tickets
  - Listas de usuarios
  - Listas de áreas
  - Listas de sucursales

### `Badge.jsx` es la única fuente de verdad para UI de estado de ticket
- Todas las visualizaciones de estado de ticket (color, etiqueta) pasan por `Badge`
- Usarlo en:
  - `TicketTable`
  - `TicketCard`
  - `TicketDetail`

## Reglas de No-Hardcode

### URLs del Backend
- **NUNCA** hardcodear URLs del backend dentro de componentes o servicios
- Almacenar URLs en `.env` y accederlas vía `import.meta.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

```js
// Ejemplo de uso dentro de servicios
const API_URL = import.meta.env.VITE_API_URL;
```

### Roles
- Los roles deben definirse **una vez** en `src/constants/roles.js`:

```js
export const ROLES = {
  ADMIN: "admin",
  SOPORTE: "soporte",
  RESPONSABLE: "responsable",
};
```

- **NUNCA** comparar roles usando literales de string como `"admin"` o `"soporte"` directamente en componentes o hooks
- Siempre importar y usar `ROLES.ADMIN`, `ROLES.SOPORTE`, `ROLES.RESPONSABLE`

### Estado de Ticket
- Los valores de estado de ticket deben definirse en `src/constants/ticketStatus.js`:

```js
export const TICKET_STATUS = {
  ABIERTO: "abierto",
  EN_PROCESO: "en_proceso",
  CERRADO: "cerrado",
};
```

- **NUNCA** hardcodear `"abierto"`, `"en_proceso"`, `"cerrado"` directamente en componentes
- Siempre importar y usar las constantes `TICKET_STATUS`

### Datos de Prueba y Mocks
- Poner datos dummy / mocks en:
  - `src/utils/` o
  - `src/mocks/` (si se crea)
- **NUNCA** incluir grandes datasets de prueba dentro de componentes o páginas

### Credenciales y Secretos
- **NUNCA** commitear o hardcodear:
  - Tokens
  - Contraseñas
  - API keys
- Estos deben ir en variables de entorno o almacenamiento seguro, **NUNCA** en el código

## Reglas Arquitectónicas Generales

### Reutilización de componentes
- Si un componente se usa en más de una página, colocarlo bajo `src/components/` (en la subcarpeta apropiada)

### Llamadas HTTP
- Todas las llamadas HTTP viven en `src/services/`
- Los componentes y hooks **NO DEBEN** realizar requests `axios` directamente
- Los componentes llaman a servicios; los servicios conocen `API_URL`

### Lógica basada en roles
- El filtrado basado en roles vive en hooks (`src/hooks/`), no dentro de páginas
- Ejemplo: `useTickets` lee de `AuthContext` y retorna tickets ya filtrados para el rol actual

### Protección de rutas
- Proteger acceso por rol a través de `src/routes/ProtectedRoute.jsx`
- Las páginas individuales deben asumir que el acceso apropiado ya ha sido aplicado por el router

### Convenciones de nombres
- Componentes: **PascalCase**, ej.:
  - `TicketTable.jsx`
  - `LoginPage.jsx`
  - `ProtectedRoute.jsx`
- Utilidades, hooks y funciones simples: **camelCase**, ej.:
  - `formatDate.js`
  - `useAuth.js`
  - `useTickets.js`

## Stack Asumido

El stack del frontend para este proyecto es:

- React + Vite
- React Router DOM
- TailwindCSS
- Context API (React Context)
- Axios (para llamadas API; integrado una vez que el backend esté listo)

Al generar código, preferir patrones idiomáticos para este stack (ej., `BrowserRouter`, `Routes`/`Route`, clases de utilidad Tailwind para estilos, y `createContext`/`useContext` para estado global).

## Estilos Modularizados

### Regla General
- **SIEMPRE** mantener los estilos en la carpeta `src/styles/`
- NO usar estilos inline ni clases de Tailwind mezcladas con JSX dentro de los componentes
- NO crear archivos CSS junto a los componentes

### Estructura de Archivos
Para cada componente o página, crear dos archivos:

```
src/components/ui/
├── Input.jsx       # Lógica y estructura JSX
└── Input.css       # Estilos específicos del componente

src/pages/auth/
├── LoginPage.jsx   # Lógica y estructura JSX
└── LoginPage.css   # Estilos específicos de la página
```

### Importar CSS en el Componente
```jsx
// Input.jsx
import "./Input.css";
```

### Beneficios
- Código más limpio y legible
- Fácil mantenimiento de estilos
- Reutilización más clara
- Separación de responsabilidades (lógica vs. presentación)
- Facilita el trabajo en equipo (menos conflictos en git)

## Checklist Rápido

Antes de finalizar cambios, verificar:

- [ ] Los archivos nuevos siguen la estructura de carpetas `src/` arriba
- [ ] Las verificaciones de rol o estado usan constantes `ROLES` y `TICKET_STATUS`
- [ ] No hay URLs de backend, credenciales o tokens hardcodeados
- [ ] Las llamadas HTTP viven solo en `src/services/`
- [ ] El filtrado basado en roles está implementado en hooks, no en páginas
- [ ] Los componentes compartidos están colocados bajo `src/components/` (o subcarpetas)

---
name: frontend-structure-react-vite
description: Defines the folder structure, reusable components, and no-hardcode rules for a React + Vite ticket management frontend (with React Router, Tailwind, Context, and Axios). Use when creating or modifying frontend files, components, hooks, routes, or services for this ticket system.
---

# Frontend Structure — React + Vite (Tickets App)

## When to Use This Skill

Use this skill whenever:

- Setting up or refactoring the React + Vite frontend for the ticket management system.
- Creating new pages, components, hooks, or services related to tickets, users, areas, sucursales, or auth.
- Deciding **where** a new file should live in `src/`.
- Implementing logic that depends on **roles** or **ticket status**.

The goal is a consistent, reusable, role-agnostic frontend architecture.

---

## Required Folder Structure (`src/`)

Follow this structure when adding or moving files:

- `src/assets/`  
  - **Purpose**: Images, icons, fonts, and other static assets.

- `src/components/`  
  - **Purpose**: Reusable components (used in multiple pages).

  - `src/components/ui/` — **Base, generic UI building blocks**
    - `Button.jsx`
    - `Input.jsx`
    - `Modal.jsx`
    - `Badge.jsx` — Ticket status indicator (`abierto`, `en_proceso`, `cerrado`).
    - `Table.jsx` — Generic, configurable table. Reused for tickets, users, areas, sucursales.

  - `src/components/layout/` — **App shell & layout**
    - `Navbar.jsx`
    - `Sidebar.jsx` — Sidebar menu changes based on the authenticated user role.
    - `PageWrapper.jsx` — General container for each page (padding, title, layout, etc.).

  - `src/components/tickets/` — **Ticket-specific reusable components**
    - `TicketTable.jsx` — Ticket list component. Receives data/columns via props.
    - `TicketCard.jsx` — Compact ticket summary view.
    - `TicketForm.jsx` — Create/edit ticket form. Reused for both flows.
    - `TicketDetail.jsx` — Full ticket detail view.

- `src/pages/` — **One page component per view (role-agnostic)**
  - `auth/LoginPage.jsx`
  - `TicketsPage.jsx` — Uses `TicketTable`; results are filtered by role via hooks, not separate pages.
  - `TicketDetailPage.jsx` — Uses `TicketDetail`.
  - `NuevoTicketPage.jsx` — Uses `TicketForm`.
  - `UsersPage.jsx` — Admin-only.
  - `AreasPage.jsx` — Admin-only.
  - `SucursalesPage.jsx` — Admin-only.

- `src/context/` — **Global state via Context API**
  - `AuthContext.jsx` — Authenticated user and their role.
  - `TicketContext.jsx` — Global ticket state, if needed (e.g., caching, shared filters).

- `src/hooks/` — **Custom hooks**
  - `useAuth.js` — Access `AuthContext`, user, and role.
  - `useTickets.js` — Fetch and filter tickets according to the current user's role.

- `src/services/` — **HTTP calls (Axios)**
  - `authService.js`
  - `ticketService.js`
  - `userService.js`
  - `areaService.js`
  - `sucursalService.js`

- `src/routes/`
  - `AppRouter.jsx` — Main route configuration.
  - `ProtectedRoute.jsx` — Guards routes by role; redirects if unauthorized.

- `src/utils/`
  - `formatDate.js`
  - Optional: test data, helpers, or `mocks/` folder for dummy data.

- `src/constants/`
  - `roles.js` — Centralized role constants.
  - `ticketStatus.js` — Centralized ticket status constants.

- `src/App.jsx`
- `src/main.jsx`

---

## Component & Page Philosophy

- **Single `TicketsPage.jsx` for all roles**
  - Do **not** create duplicated pages like `TicketsAdminPage` / `TicketsSoportePage`.
  - Role-based behavior comes from hooks (e.g., `useTickets`) and context, not separate pages.

- **`TicketForm.jsx` = create + edit**
  - Reuse the same form component for both create and edit flows.
  - For edit, pass initial values via props.

- **`Sidebar.jsx` depends on role**
  - `Sidebar` reads the role from `AuthContext` (e.g., via `useAuth`).
  - Each role sees only the relevant menu options (e.g., admin-only pages).

- **`Table.jsx` is a generic, reusable table**
  - Takes configurable columns and data via props.
  - Reuse for:
    - Ticket lists
    - User lists
    - Area lists
    - Sucursal lists

- **`Badge.jsx` is the single source of truth for ticket status UI**
  - All ticket status visuals (color, label) go through `Badge`.
  - Use it in:
    - `TicketTable`
    - `TicketCard`
    - `TicketDetail`

---

## No-Hardcode Rules

### Backend URLs

- **Never** hardcode backend URLs inside components or services.
- Store URLs in `.env` and access them via `import.meta.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

```js
// Example usage inside services
const API_URL = import.meta.env.VITE_API_URL;
```

### Roles

- Roles must be defined **once** in `src/constants/roles.js`:

```js
export const ROLES = {
  ADMIN: "admin",
  SOPORTE: "soporte",
  RESPONSABLE: "responsable",
};
```

- **Never** compare roles using string literals like `"admin"` or `"soporte"` directly in components or hooks.
- Always import and use `ROLES.ADMIN`, `ROLES.SOPORTE`, `ROLES.RESPONSABLE`.

### Ticket Status

- Ticket status values must be defined in `src/constants/ticketStatus.js`:

```js
export const TICKET_STATUS = {
  ABIERTO: "abierto",
  EN_PROCESO: "en_proceso",
  CERRADO: "cerrado",
};
```

- **Never** hardcode `"abierto"`, `"en_proceso"`, `"cerrado"` directly in components.
- Always import and use the `TICKET_STATUS` constants.

### Test Data & Mocks

- Put dummy data / mocks in:
  - `src/utils/` or
  - `src/mocks/` (if created)
- **Never** inline large test datasets inside components or pages.

### Credentials & Secrets

- **Never** commit or hardcode:
  - Tokens
  - Passwords
  - API keys
- These must go into env variables or secure storage, **never** in the codebase.

---

## General Architectural Rules

- **Component reuse**
  - If a component is used in more than one page, place it under `src/components/` (in the appropriate subfolder).

- **HTTP calls**
  - All HTTP calls live in `src/services/`.
  - Components and hooks **must not** perform `axios` requests directly.
  - Components call services; services know about `API_URL`.

- **Role-based logic**
  - Role-based filtering lives in hooks (`src/hooks/`), not inside pages.
  - Example: `useTickets` reads from `AuthContext` and returns tickets already filtered for the current role.

- **Route protection**
  - Guard access by role through `src/routes/ProtectedRoute.jsx`.
  - Individual pages should assume proper access has already been enforced by the router.

- **Naming conventions**
  - Components: **PascalCase**, e.g.:
    - `TicketTable.jsx`
    - `LoginPage.jsx`
    - `ProtectedRoute.jsx`
  - Utilities, hooks, and plain functions: **camelCase**, e.g.:
    - `formatDate.js`
    - `useAuth.js`
    - `useTickets.js`

---

## Buenas Prácticas de Desarrollo

### Principios SOLID y Clean Code

- **Single Responsibility Principle (SRP)**
  - Cada componente debe tener una única responsabilidad.
  - Si un componente hace demasiadas cosas, dividirlo en componentes más pequeños.
  - Los servicios deben manejar solo lógica relacionada con su dominio (auth, tickets, users, etc.).

- **DRY (Don't Repeat Yourself)**
  - Extraer lógica repetida en hooks personalizados o funciones utilitarias.
  - Reutilizar componentes en lugar de duplicar código.

- **Nombres descriptivos**
  - Usar nombres que expliquen claramente qué hace el componente, función o variable.
  - Evitar abreviaciones innecesarias.
  - Ejemplos buenos: `TicketStatusBadge`, `useTicketFilters`, `validateTicketForm`.
  - Ejemplos malos: `TSB`, `useTF`, `val`.

### Manejo de Errores

- **Siempre manejar errores en llamadas HTTP**
  - Usar try-catch en servicios y hooks.
  - Mostrar mensajes de error amigables al usuario.
  - Registrar errores para debugging (console.error o servicio de logging).

```js
// ✅ Buen ejemplo
try {
  const tickets = await ticketService.getAll();
  setTickets(tickets);
} catch (error) {
  console.error('Error fetching tickets:', error);
  setError('No se pudieron cargar los tickets. Por favor, intenta de nuevo.');
}

// ❌ Mal ejemplo
const tickets = await ticketService.getAll(); // Sin manejo de errores
```

- **Estados de carga y error**
  - Implementar estados de `loading`, `error`, y `data` en hooks y componentes.
  - Mostrar indicadores de carga mientras se obtienen datos.
  - Mostrar mensajes de error claros cuando algo falla.

### Validación de Datos

- **Validar en el frontend antes de enviar al backend**
  - Validar formularios antes de submit.
  - Usar validación tanto en el cliente como confiar en la validación del backend.
  - Mostrar mensajes de error de validación claros y específicos.

- **Validar datos recibidos del backend**
  - No asumir que el backend siempre devuelve datos válidos.
  - Validar tipos y estructura de datos antes de usarlos.
  - Manejar casos donde los datos pueden ser `null` o `undefined`.

### Performance y Optimización

- **React.memo para componentes pesados**
  - Usar `React.memo` en componentes que se re-renderizan frecuentemente.
  - Especialmente útil para listas grandes (tablas de tickets, usuarios, etc.).

- **useMemo y useCallback cuando sea necesario**
  - Usar `useMemo` para cálculos costosos.
  - Usar `useCallback` para funciones pasadas como props a componentes memoizados.
  - No sobre-optimizar: solo cuando hay problemas de performance reales.

- **Lazy loading de rutas**
  - Usar `React.lazy` y `Suspense` para cargar páginas bajo demanda.
  - Reducir el bundle inicial y mejorar tiempos de carga.

```js
// ✅ Ejemplo de lazy loading
const TicketsPage = React.lazy(() => import('./pages/TicketsPage'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/tickets" element={<TicketsPage />} />
  </Routes>
</Suspense>
```

- **Optimización de imágenes**
  - Usar formatos modernos (WebP) cuando sea posible.
  - Lazy loading de imágenes fuera del viewport.
  - Tamaños apropiados de imágenes.

### Accesibilidad (a11y)

- **Semántica HTML correcta**
  - Usar elementos HTML semánticos (`<nav>`, `<main>`, `<header>`, `<button>`, etc.).
  - Evitar `<div>` y `<span>` cuando hay elementos semánticos apropiados.

- **ARIA labels y roles**
  - Agregar `aria-label` a botones sin texto visible.
  - Usar `role` cuando sea necesario para elementos no semánticos.
  - Asegurar que los formularios tengan labels asociados.

- **Navegación por teclado**
  - Asegurar que todos los elementos interactivos sean accesibles con teclado.
  - Implementar focus visible y orden lógico de tabulación.

- **Contraste de colores**
  - Verificar que el contraste de texto cumpla con WCAG AA mínimo.
  - No depender solo del color para transmitir información.

### Seguridad

- **Sanitización de inputs**
  - Nunca renderizar HTML crudo del usuario sin sanitizar.
  - Usar librerías como DOMPurify si es necesario renderizar HTML.

- **Protección de rutas**
  - Verificar autenticación y autorización tanto en el frontend como confiar en el backend.
  - El frontend protege la UX; el backend protege los datos reales.

- **Tokens y credenciales**
  - Nunca almacenar tokens en localStorage si contienen información sensible.
  - Considerar httpOnly cookies para tokens cuando sea posible.
  - Limpiar tokens al hacer logout.

### Testing

- **Escribir tests para lógica crítica**
  - Tests unitarios para funciones utilitarias y hooks.
  - Tests de integración para flujos importantes (login, creación de tickets, etc.).
  - Tests de componentes para UI crítica.

- **Cobertura razonable**
  - Enfocarse en código crítico para el negocio.
  - No buscar 100% de cobertura, pero sí cubrir casos edge importantes.

### Documentación y Código Limpio

- **Comentarios cuando sea necesario**
  - Comentar código complejo o lógica de negocio no obvia.
  - Evitar comentarios obvios que solo repiten el código.
  - Usar JSDoc para funciones y componentes públicos.

```js
/**
 * Filtra los tickets según el rol del usuario autenticado.
 * @param {Array} tickets - Lista de todos los tickets
 * @param {string} userRole - Rol del usuario actual
 * @returns {Array} Tickets filtrados según el rol
 */
export const filterTicketsByRole = (tickets, userRole) => {
  // Implementación...
};
```

- **Código auto-documentado**
  - Preferir código claro con nombres descriptivos sobre comentarios.
  - Estructurar el código de manera lógica y fácil de seguir.

### Versionado y Git

- **Commits descriptivos**
  - Usar mensajes de commit claros y descriptivos.
  - Seguir convenciones como Conventional Commits si el equipo lo requiere.
  - Ejemplo: `feat: agregar filtro de tickets por estado` o `fix: corregir validación de formulario de tickets`.

- **Branching strategy**
  - Usar branches para features nuevas.
  - Mantener `main` o `master` estable.
  - Hacer merge requests/PRs para revisión de código.

### Manejo de Estado

- **Estado local vs global**
  - Usar estado local (`useState`) para estado que solo afecta un componente.
  - Usar Context API para estado compartido entre múltiples componentes.
  - Considerar librerías de estado (Redux, Zustand) solo si Context se vuelve complejo.

- **Inmutabilidad**
  - No mutar objetos o arrays directamente.
  - Usar spread operator, `map`, `filter`, etc., para crear nuevos objetos/arrays.

```js
// ✅ Buen ejemplo
setTickets([...tickets, newTicket]);
setUser({ ...user, name: newName });

// ❌ Mal ejemplo
tickets.push(newTicket); // Mutación directa
user.name = newName; // Mutación directa
```

### Consistencia de Código

- **Formato consistente**
  - Usar Prettier o similar para formateo automático.
  - Configurar ESLint para mantener estándares de código.
  - Seguir las convenciones del proyecto existente.

- **Estructura de archivos**
  - Mantener la estructura de carpetas definida en esta skill.
  - Agrupar archivos relacionados.
  - Mantener archivos pequeños y enfocados.

---

## Stack Assumptions

The frontend stack for this project is:

- React + Vite
- React Router DOM
- TailwindCSS
- Context API (React Context)
- Axios (for API calls; integrated once the backend is ready)

When generating code, prefer idiomatic patterns for this stack (e.g., `BrowserRouter`, `Routes`/`Route`, Tailwind utility classes for styling, and `createContext`/`useContext` for global state).

---

## Quick Checklist

Before finalizing changes, verify:

- [ ] New files follow the `src/` folder structure above.
- [ ] Role or status checks use `ROLES` and `TICKET_STATUS` constants.
- [ ] No backend URLs, credentials, or tokens are hardcoded.
- [ ] HTTP calls live only in `src/services/`.
- [ ] Role-based filtering is implemented in hooks, not pages.
- [ ] Shared components are placed under `src/components/` (or subfolders).

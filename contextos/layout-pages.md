# Estructura de Layout y Páginas

## Descripción General

Este documento describe la estructura visual y de layout de la interfaz del sistema IT Support. La aplicación sigue un diseño consistente con sidebar lateral, navbar superior y área de contenido principal.

## Estructura Principal

### Layout General

La aplicación utiliza un layout de tres secciones principales:

```
┌─────────────────────────────────────────┐
│              Navbar (Superior)          │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │    Área de Contenido        │
│ (Izq)    │    Principal                 │
│          │                              │
│          │                              │
└──────────┴──────────────────────────────┘
```

## Componentes de Layout

### 1. Sidebar (Barra Lateral Izquierda)

**Ubicación**: Lado izquierdo de la pantalla
**Ancho**: 256px (`w-64`)
**Fondo**: `bg-dark-purple-800` con borde `border-dark-purple-700`

#### Características:
- **Navegación principal**: Menú de navegación con iconos minimalistas
- **Indicador de selección**: Elementos activos muestran un degradado morado eléctrico (`from-purple-electric to-purple-electric-hover`)
- **Secciones**:
  - Sección principal: Tickets, Nuevo ticket
  - Sección de administración (solo para admin): Usuarios, Áreas, Sucursales
- **Información de usuario**: En la parte inferior muestra email y rol del usuario autenticado
- **Estados**:
  - Activo: Degradado morado con sombra
  - Hover: Fondo `dark-purple-700` con transición suave
  - Normal: Texto secundario (`text-text-secondary`)

#### Estructura del Menú:
```
IT Support
Sistema de Tickets
─────────────────
📋 Tickets
➕ Nuevo ticket
─────────────────
👥 Usuarios (Admin)
🏢 Áreas (Admin)
📍 Sucursales (Admin)
─────────────────
[Usuario Info]
```

### 2. Navbar (Barra Superior)

**Ubicación**: Parte superior de la pantalla
**Altura**: Variable según contenido
**Fondo**: `bg-dark-purple-800/95` con efecto glassmorphism (`backdrop-blur-glass`)
**Borde**: `border-b border-dark-purple-700`

#### Características:
- **Título**: "Dashboard" con subtítulo "Bienvenido de vuelta"
- **Acciones**: Botón de "Cerrar sesión" alineado a la derecha
- **Padding**: `px-6 py-4`
- **Responsive**: Se adapta al contenido

### 3. Área de Contenido Principal

**Ubicación**: Centro-derecha de la pantalla
**Fondo**: `bg-dark-purple-900` (fondo principal)
**Padding**: `p-8` (definido en `PageWrapper`)

#### Características:
- **Contenedor**: `PageWrapper` proporciona padding y título de página
- **Títulos de página**: `text-3xl font-bold text-text-primary`
- **Espaciado**: Generoso entre elementos para legibilidad
- **Scroll**: Área scrollable cuando el contenido excede el viewport

## Páginas Específicas

### LoginPage

**Layout especial**: No muestra Sidebar ni Navbar
- **Fondo**: `bg-dark-purple-900` con efectos decorativos de fondo
- **Centrado**: Formulario centrado vertical y horizontalmente
- **Card de login**: 
  - Fondo: `bg-dark-purple-800/95` con glassmorphism
  - Borde: `border-dark-purple-700`
  - Border radius: `rounded-2xl`
  - Ancho máximo: `max-w-md`
  - Padding: `p-8`

### Páginas con Layout Completo

Todas las demás páginas (TicketsPage, UsersPage, etc.) utilizan el layout completo con:
- Sidebar visible
- Navbar visible
- Área de contenido con `PageWrapper`

## Responsive Design

### Breakpoints (Tailwind por defecto):
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

### Comportamiento Responsive:
- **Desktop**: Layout completo con sidebar fijo
- **Tablet/Mobile**: (Futuro) Sidebar colapsable o drawer

## Componentes Relacionados

### PageWrapper
- Componente contenedor para todas las páginas
- Proporciona padding consistente (`p-8`)
- Renderiza título de página si se proporciona
- Fondo transparente (hereda del layout principal)

### AppLayout
- Componente que estructura el layout completo
- Contiene Sidebar, Navbar y área de contenido
- Maneja la lógica de mostrar/ocultar layout según la ruta

## Flujo de Navegación

1. **Usuario no autenticado**: Redirigido a `/login` (sin layout)
2. **Usuario autenticado**: Ve layout completo con sidebar y navbar
3. **Navegación**: Los enlaces en el sidebar cambian la ruta y actualizan el contenido principal
4. **Indicador activo**: El elemento del menú correspondiente a la ruta actual se resalta

## Estilos Visuales

### Transiciones
- Todas las interacciones tienen transiciones suaves (`transition-all duration-200`)
- Hover effects con escalado sutil (`hover:scale-[1.02]`)

### Espaciado
- Padding consistente en todos los componentes
- Espaciado generoso para legibilidad
- Separación clara entre secciones

### Bordes y Sombras
- Bordes sutiles con `border-dark-purple-700`
- Sombras con color morado para elementos activos
- Border radius grande (`rounded-2xl`) para un look moderno

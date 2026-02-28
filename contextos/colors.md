# Paleta de Colores - Dark Purple Premium

## Descripción General

Esta paleta de colores define la identidad visual "Dark Purple Premium" del proyecto IT Support. Todos los componentes deben seguir esta guía de colores para mantener la consistencia visual.

## Colores Principales

### Fondo Principal
- **dark-purple-900**: `#0f0a19`
  - Morado casi negro muy profundo
  - Usado como fondo principal de la aplicación
  - Aplicado en `body` y contenedores principales

### Superficies y Cards
- **dark-purple-800**: `#1e162d`
  - Morado oscuro ligeramente más claro que el fondo principal
  - Usado para cards, modales, inputs y superficies elevadas
  - Bordes sutiles con `dark-purple-700`

- **dark-purple-700**: `#2d1f42`
  - Usado para estados hover y bordes sutiles
  - Transiciones suaves entre estados

## Color Primario (Acción)

- **purple-electric**: `#7c3aed`
  - Morado vibrante/eléctrico
  - Usado para botones principales, elementos activos, enlaces importantes
  - Focus states en inputs y elementos interactivos

- **purple-electric-hover**: `#6d28d9`
  - Variante más oscura para estados hover del color primario

## Acentos de Estado

### Rosa Vibrante
- **accent-pink**: `#ec4899`
  - Usado para estados de "Alta" prioridad
  - Mensajes de error importantes
  - Elementos que requieren atención inmediata

### Azul Brillante
- **accent-blue**: `#3b82f6`
  - Usado para estado "Abierto" en tickets
  - Información destacada
  - Enlaces y acciones secundarias

### Naranja
- **accent-orange**: `#f97316`
  - Usado para estado "En proceso" en tickets
  - Advertencias moderadas
  - Estados intermedios

## Texto

### Texto Primario
- **text-primary**: `#ffffff`
  - Blanco puro
  - Usado para encabezados principales (h1, h2)
  - Texto importante en cards y superficies oscuras

### Texto Secundario
- **text-secondary**: `#ffffff`
  - Blanco puro
  - Usado para textos secundarios, descripciones
  - Labels y textos de apoyo

### Texto Muted
- **text-muted**: `#a78bfa`
  - Texto más suave que el secundario
  - Usado para placeholders, textos deshabilitados
  - Información menos relevante

## Uso en Componentes

### Botones
- **Primario**: `bg-purple-electric` con `text-white`
- **Secundario**: `bg-dark-purple-800` con `text-text-secondary` y borde
- **Peligro**: `bg-accent-pink` con `text-white`

### Inputs
- **Fondo**: `bg-dark-purple-800`
- **Borde**: `border-dark-purple-700`
- **Focus**: `focus:ring-purple-electric` y `focus:border-purple-electric`
- **Placeholder**: `placeholder:text-text-muted/50`

### Badges de Estado
- **Abierto**: `bg-accent-blue/20` con `text-accent-blue` y borde azul
- **En proceso**: `bg-accent-orange/20` con `text-accent-orange` y borde naranja
- **Cerrado**: `bg-dark-purple-800` con `text-text-secondary` y borde oscuro

### Tablas
- **Header**: `bg-dark-purple-800`
- **Fila**: `bg-dark-purple-800/50`
- **Hover**: `hover:bg-dark-purple-700/50`
- **Bordes**: `border-dark-purple-700`

## Efectos Visuales

### Sombras
- Sombras con color morado eléctrico: `shadow-purple-electric/30`
- Sombras con color rosa para elementos de error: `shadow-accent-pink/30`

### Glassmorphism
- Backdrop blur: `backdrop-blur-glass` (10px)
- Fondo semi-transparente: `bg-dark-purple-800/95`

### Border Radius
- Cards y modales: `rounded-2xl` (20px)
- Inputs y botones: `rounded-2xl` (20px)
- Badges: `rounded-full`

## Ejemplo de Uso en Tailwind

```
jsx
// Card con tema Dark Purple Premium
<div className="bg-dark-purple-800 border border-dark-purple-700 rounded-2xl p-6">
  <h2 className="text-text-primary text-2xl font-bold">Título</h2>
  <p className="text-text-secondary mt-2">Descripción</p>
  <button className="bg-purple-electric hover:bg-purple-electric-hover text-white rounded-2xl px-6 py-3 mt-4">
    Acción
  </button>
</div>
```

## Orbes de Fondo (Background Orbs)

Esta sección define los colores para los efectos de orbes decorativos en el fondo de las páginas (especialmente en LoginPage y páginas de auth). Todos los colores mantienen opacidad baja (10-30%) para mantener oscuridad.

### Colores de Orbes - Tonos Azules y Morados

#### Morados
- **purple-700**: `#7c3aed` - Orbes principales, color primario
- **purple-800**: `#6b28d9` - Orbes secundarios, más oscuro
- **violet-800**: `#8b5cf6` - Violeta brillante para variación
- **violet-900**: `#6d28d9` - Violeta oscuro para profundidad

#### Azules
- **blue-700**: `#1d4ed8` - Orbes principales azules
- **blue-800**: `#1e40af` - Azul oscuro
- **blue-950**: `#0f172a` - Azul muy oscuro (casi negro)
- **sky-700**: `#0369a1` - Sky azul frío
- **cyan-700**: `#0e7490` - Cyan para variación

#### Índigos
- **indigo-700**: `#4338ca` - Indigo brillante
- **indigo-800**: `#3730a3` - Indigo oscuro
- **indigo-900**: `#312e81` - Indigo muy oscuro

#### Grises Oscuros (Slate)
- **slate-800**: `#1e293b` - Gris oscuro azulado
- **slate-900**: `#0f172a` - Gris muy oscuro

### Gradientes de Fondo

Para capas base de gradiente:
- `from-blue-950/40 via-transparent to-purple-950/30` - Gradiente diagonal principal
- `from-slate-900/30 via-transparent to-indigo-900/20` - Gradiente secundario

### Líneas de Gradiente Sutiles

Para líneas decorativas horizontales:
- `via-purple-500/20` - Línea morada sutil
- `via-blue-600/15` - Línea azul sutil
- `via-indigo-800/10` - Línea Índigo muy sutil

### Uso en Componentes

```
jsx
// Ejemplo de orbes para páginas de auth
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {/* Capa base de gradiente */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-transparent to-purple-950/30" />
  
  {/* Orbes principales */}
  <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl" />
  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-700/20 rounded-full blur-3xl" />
  
  {/* Orbes secundarios */}
  <div className="absolute top-[15%] right-[20%] w-64 h-64 bg-violet-800/20 rounded-full blur-3xl" />
  <div className="absolute bottom-[20%] left-[15%] w-80 h-80 bg-indigo-900/25 rounded-full blur-3xl" />
  
  {/* Orbes de profundidad */}
  <div className="absolute top-[30%] left-[10%] w-40 h-40 bg-blue-950/30 rounded-full blur-2xl" />
  <div className="absolute bottom-[30%] right-[25%] w-52 h-52 bg-violet-900/20 rounded-full blur-2xl" />
  
  {/* Líneas decorativas */}
  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
  <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-600/15 to-transparent" />
</div>
```

### Notas Importantes

- **Siempre mantener opacidad baja** (10-30%) para que los orbes sean oscuros
- **Usar blur-3xl** para orbes grandes y difusos
- **Usar blur-2xl** para orbes más pequeños y sutiles
- **Combinar morados y azules** para variedad visual
- **Agregar orbes de diferentes tamaños** para crear profundidad
- **Las líneas de gradiente** deben tener opacidad muy baja (10-20%)

# Plan de Implementación - Vista de Usuarios

## Información Recopilada:
- **dummies.json**: Estructura de usuarios con campos: id, email, nombre, apellido, rol
- **Badge.jsx**: Componente de badges con estilos para diferentes estados
- **Table.jsx**: Componente base de tabla con estilos oscuros
- **colors.md**: Paleta de colores "Dark Purple Premium" del proyecto
- **SucursalTable.jsx**: Ejemplo de uso de Table y Badge

## Plan de Ejecución:

### 1. Actualizar dummies.json
- [x] Agregar campos `sucursal`, `area`, `estado` a cada usuario
- [x] Mantener solo usuarios con rol "soporte" o "responsable" (excluir admin)

### 2. Crear UsuariosPage.tsx
- [x] Importar usuarios de dummies.json
- [x] Filtrar solo usuarios con rol soporte o responsable
- [x] Crear componente de Avatar con iniciales (círculo de color)
- [x] Definir columnas de la tabla:
  - Usuario: Nombre completo + Email (pequeño debajo)
  - Rol: Badge (soporte=morado, responsable=azul)
  - Sucursal: Nombre de sucursal
  - Área: Nombre de área
  - Estado: Badge verde (Activo) o rojo (Inactivo)
- [x] Aplicar estilos de tabla oscura con bordes gray-800 y efectos hover

### 3. Agregar ruta en AppRouter
- [x] Agregar ruta para la página de usuarios

## Colores para badges de rol:
- Soporte: Morado (bg-purple-electric/20, text-purple-electric)
- Responsable: Azul (bg-accent-blue/20, text-accent-blue)

## Colores para avatar de iniciales:
- Generar colores based on nombre hash o array predefinido

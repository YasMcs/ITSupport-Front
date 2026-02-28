# IT Support - Frontend

Frontend para el sistema de gestión de tickets IT Support, construido con React + Vite.

## Estructura del proyecto

El proyecto sigue la estructura definida en `.cursor/skills/frontend-structure-react-vite/SKILL.md`.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Configuración

Copia `.env.example` a `.env` y configura la URL de tu API:

```
VITE_API_URL=http://localhost:3000/api
```

## Notas

- En modo desarrollo, si el backend no está disponible, la aplicación usará datos mock para permitir probar la UI.
- El login en desarrollo permite acceder con cualquier credencial cuando el backend no responde.

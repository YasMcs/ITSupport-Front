# Auditoria Breve de Seguridad Frontend

## Objetivo
Documento corto para identificar el estado actual de seguridad del frontend, sus fortalezas, sus riesgos y las acciones que conviene tomar para mejorar integridad, control de acceso y reduccion de superficie de ataque.

## Resumen ejecutivo
El frontend actual tiene una base razonable de seguridad para experiencia de usuario, validaciones y control visual de acceso. Sin embargo, todavia depende de forma importante del backend para la proteccion real.

Hoy el mayor riesgo no esta en la UI visible, sino en:
- manejo del token
- control de sesion expirada
- autenticacion del websocket

## Fortalezas actuales

### 1. Rutas protegidas por autenticacion y rol
- El frontend no deja navegar libremente a vistas protegidas.
- `ProtectedRoute` controla acceso por sesion y por rol.

### 2. Token centralizado en cliente HTTP
- El token se inyecta desde un solo lugar en `api.js`.
- Esto reduce errores de manejo disperso.

### 3. Validaciones y sanitizacion
- Existe una capa de utilidades en `security.js`.
- Se bloquea contenido sospechoso como:
  - etiquetas HTML
  - `javascript:`
  - eventos inline
  - fragmentos con apariencia de script

### 4. No se detecta render inseguro de HTML
- La app actual trabaja principalmente con texto plano.
- No hay una dependencia visible de render HTML crudo en vistas clave.

### 5. Sesion menos persistente que `localStorage`
- El token se guarda en `sessionStorage`.
- Eso reduce persistencia entre sesiones respecto a `localStorage`.

## Riesgos detectados

## Riesgo alto

### Token en `sessionStorage`
- Si un atacante logra inyectar JavaScript en la aplicacion, el token puede ser leido.
- `sessionStorage` no protege frente a XSS.

### Token del websocket en query string
- El websocket actual construye la URL con `?token=...`.
- Eso puede terminar:
  - en logs
  - en herramientas de monitoreo
  - en historiales internos de red o proxy

## Riesgo medio

### Sesion visual valida aunque el token ya expiro
- El frontend considera autenticado al usuario si existe objeto `user` en sesion.
- No se valida expiracion del token al montar la app.
- Esto puede generar estados inconsistentes:
  - usuario aparentemente dentro
  - peticiones reales fallando por `401`

### Falta de interceptor global de expiracion
- No existe un flujo central para:
  - detectar `401`
  - limpiar sesion
  - redirigir a login
- Esto no rompe la seguridad del backend, pero si la consistencia del front.

### La proteccion por rol del frontend no es defensa real
- Ocultar rutas o botones no impide que alguien intente requests manuales.
- El backend debe seguir siendo la unica autoridad real.

## Riesgo medio-bajo

### Sanitizacion basada en regex
- Ayuda mucho como primera barrera de UX.
- No debe considerarse defensa final.
- La validacion fuerte debe existir tambien en backend.

### Exceso de datos en payloads o eventos
- Si backend manda mas datos de los necesarios en tickets o sockets, el frontend no los filtra de forma estricta.
- Conviene seguir revisando que DTOs traigan solo lo necesario.

## Cosas que el frontend si puede proteger mejor

## 1. Mejor manejo del token

### Recomendacion ideal
- mover autenticacion a cookie `HttpOnly` si backend lo permite

### Si por ahora no se puede
- mantener `sessionStorage` pero:
  - minimizar tiempo de vida del token
  - limpiar sesion en expiracion
  - evitar exponerlo en URL

## 2. No mandar token por query string en websocket
- Lo ideal es autenticar el socket por:
  - headers
  - cookie de sesion
  - handshake del backend
- Si backend ya admite headers STOMP o autenticacion por cookie, quitar `?token=...`

## 3. Agregar interceptor global de `401` y `403`
- Cuando una peticion falle por token vencido o acceso denegado:
  - limpiar token
  - limpiar usuario
  - cerrar websocket
  - redirigir a `/login`
  - mostrar mensaje breve

## 4. Validar expiracion al iniciar la app
- Si el token es JWT:
  - leer `exp`
  - si ya expiro, no montar sesion como valida
- Esto mejora consistencia y reduce estados falsos de autenticacion.

## 5. Seguir evitando HTML inseguro
- Mantener la regla de no usar `dangerouslySetInnerHTML` salvo que sea absolutamente necesario.
- Si algun dia se necesita, sanitizar con una libreria seria y no con regex casero.

## 6. Limitar persistencia de informacion sensible en memoria visual
- Evitar mostrar o conservar datos sensibles no necesarios en contexto global.
- Mantener DTOs y estados de UI lo mas minimos posible.

## 7. Endurecer navegacion sensible
- En vistas con acciones criticas:
  - confirmar cierres o cambios destructivos
  - invalidar acciones repetidas
  - bloquear dobles submits
- Esto protege mas la integridad operativa que la seguridad dura, pero sigue siendo importante.

## 8. Cuidar la bandeja de notificaciones
- No mostrar detalles excesivos en toasts o campanita.
- Usar copy breve y folio, no informacion sensible o interna.

## Recomendaciones por prioridad

### Prioridad alta
- quitar token del query string del websocket
- agregar interceptor global para `401/403`
- validar expiracion del token al iniciar la app

### Prioridad media
- revisar si `sessionStorage` puede migrarse a cookie segura
- limitar payloads de notificaciones y DTOs
- seguir auditando formularios que aceptan texto libre

### Prioridad baja
- documentar politica de seguridad frontend
- revisar headers de seguridad del deploy junto con backend

## Conclusion
El frontend actual no esta inseguro de forma alarmante, pero tampoco esta en un punto de seguridad madura completa.

La base es buena en:
- estructura
- validaciones
- control visual de acceso
- orden de sesion y rutas

Los siguientes saltos reales de seguridad estan en:
- token
- expiracion de sesion
- websocket

Si esos tres puntos se corrigen, la postura general del frontend sube bastante.

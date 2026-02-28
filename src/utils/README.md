# Utilidades

## dummies.json

Archivo con datos de prueba para desarrollo. Contiene usuarios de prueba con diferentes roles.

### Usuarios disponibles:

1. **Admin**
   - Email: `admin@itsupport.com`
   - Password: `admin123`
   - Rol: `admin`

2. **Soporte**
   - Email: `soporte@itsupport.com`
   - Password: `soporte123`
   - Rol: `soporte`

3. **Responsable**
   - Email: `responsable@itsupport.com`
   - Password: `responsable123`
   - Rol: `responsable`

4. **Test**
   - Email: `test@test.com`
   - Password: `test123`
   - Rol: `soporte`

### Uso

Los datos dummy se usan automáticamente en modo desarrollo cuando:
- El backend no está disponible, o
- La variable `VITE_USE_DUMMIES` está en `true` (por defecto en desarrollo)

Para deshabilitar los dummies en desarrollo, agrega a tu `.env`:
```
VITE_USE_DUMMIES=false
```

### Nota

Este archivo solo se usa en desarrollo. En producción, siempre se intentará usar el backend real.

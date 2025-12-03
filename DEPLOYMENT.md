# Guía de Deployment en Hostinger

## 🔐 Configuración de Variables de Entorno

### Paso 1: Configurar Variables de Entorno en Hostinger

1. **Accede al panel de Hostinger**
2. **Ve a tu aplicación > Configuración**
3. **Busca la sección "Environment Variables" o "Variables de Entorno"**
4. **Añade la siguiente variable:**

```
Nombre: VITE_ADMIN_EMAIL
Valor: albercasvergaras@gmail.com
```

### Paso 2: Build de Producción

Cuando hagas el build para producción, Vite automáticamente incluirá las variables de entorno que empiezan con `VITE_`:

```bash
npm run build
```

El archivo `dist/` generado contendrá las variables de entorno compiladas.

### Paso 3: Subir a Hostinger

1. **Sube la carpeta `dist/` a Hostinger**
2. **Asegúrate de que la variable de entorno esté configurada**
3. **La aplicación ahora podrá autenticar al admin correctamente**

## ✅ Verificación

Para verificar que todo funciona:

1. Accede a la app en producción
2. Intenta hacer login con `albercasvergaras@gmail.com`
3. Deberías tener acceso al panel de administración

## 🔒 Seguridad

### ¿Por qué usamos variables de entorno?

1. **El email del admin NO está en el código fuente**
2. **Si subes el código a GitHub, el email queda oculto**
3. **Solo tú y el servidor conocen el email del admin**

### Archivos importantes:

- `.env` - ❌ NO se sube a GitHub (está en .gitignore)
- `.env.example` - ✅ SÍ se sube a GitHub (es solo una plantilla)

## 🚨 Importante

Si cambias el email del administrador en el futuro:

1. **Actualiza `.env` localmente**
2. **Actualiza la variable en Hostinger**
3. **NO necesitas hacer cambios en el código**

## 📌 Alternativa: Build Variables

Si Hostinger no permite configurar variables de entorno directamente, puedes:

1. Crear un archivo `.env.production` localmente:
```
VITE_ADMIN_EMAIL=albercasvergaras@gmail.com
```

2. Hacer el build con este archivo:
```bash
npm run build
```

3. El build incluirá la variable compilada

**Nota:** El archivo `.env.production` también debe estar en `.gitignore` y NO subirse a GitHub.

## 🆘 Soporte

Si tienes problemas con la autenticación de admin:

1. Verifica que la variable `VITE_ADMIN_EMAIL` esté configurada
2. Revisa la consola del navegador (debe aparecer warning si falta la variable)
3. Asegúrate de que el email coincide exactamente (case-insensitive)

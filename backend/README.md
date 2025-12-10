# Albercas y Agua - Backend API

Backend API para integración con Mercado Pago Checkout Pro.

## 🚀 Tecnologías

- **Node.js** - Runtime
- **Express** - Web framework
- **Mercado Pago SDK** - Integración de pagos
- **Firebase Admin SDK** - Base de datos Firestore
- **CORS** - Control de acceso
- **dotenv** - Variables de entorno
- **Vercel** - Deployment serverless (recomendado)

## 📋 Requisitos Previos

- Node.js 18+ instalado
- Cuenta de Mercado Pago con credenciales de producción
- Proyecto Firebase con Firestore habilitado
- Service Account de Firebase (opcional, para producción)

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install
```

## ⚙️ Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto backend basado en `.env.example`:

```bash
# Mercado Pago Credentials
MERCADOPAGO_ACCESS_TOKEN=APP_USR-5537528991577915-120314-945f38eddbb37973dc382c0691f5058e-2969789365
MERCADOPAGO_PUBLIC_KEY=APP_USR-9c59cc8c-aece-47de-9298-ddb0ac56c46e

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend URL (IMPORTANTE: cambiar en producción)
FRONTEND_URL=https://tudominio.com

# Backend URL (para webhooks - cambiar en producción)
BACKEND_URL=https://tu-backend.railway.app

# Firebase Admin SDK Configuration
# Opción 1: Usar archivo JSON de service account
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Opción 2: Usar variables individuales (para Railway/Render)
# FIREBASE_PROJECT_ID=tu-project-id
# FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-project.iam.gserviceaccount.com
# FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

### 2. Firebase Service Account

**Opción A: Archivo JSON (Local/Desarrollo)**

1. Ve a Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Guarda el archivo como `serviceAccountKey.json` en la raíz del backend
4. **NO SUBIR ESTE ARCHIVO A GIT** (ya está en .gitignore)

**Opción B: Variables de Entorno (Railway/Render - Recomendado)**

Copia las credenciales del JSON a variables de entorno individuales en tu plataforma de deployment.

## 🏃‍♂️ Ejecutar Localmente

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:3001`

## 📡 Endpoints

### Health Check
```
GET /
```
Verifica que el servidor esté funcionando.

### Crear Preferencia de Pago
```
POST /api/payment/create-preference
Content-Type: application/json

{
  "orderData": {
    "userEmail": "cliente@email.com",
    "items": [/* array de productos */],
    "shippingAddress": {/* datos de envío */},
    "shippingMethod": "local",
    "shippingCost": 0,
    "subtotal": 100,
    "total": 100
  }
}
```

### Webhook de Mercado Pago
```
POST /api/payment/webhook
```
Recibe notificaciones automáticas de Mercado Pago cuando cambia el estado de un pago.

## 🌐 Deployment a Vercel (Recomendado - 100% Gratis)

### 1. Preparar el Proyecto

El backend ya está configurado para Vercel con:
- ✅ `vercel.json` - Configuración de routing y build
- ✅ `server.js` modificado para compatibilidad serverless

### 2. Crear Cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Regístrate con GitHub (gratis)
3. Click "Add New..." → "Project"

### 3. Importar Proyecto

1. Selecciona tu repositorio de GitHub
2. **IMPORTANTE**: Configura el "Root Directory" como `backend`
3. Vercel detectará automáticamente que es un proyecto Node.js

### 4. Configurar Variables de Entorno

Antes de hacer deploy, agrega estas variables en "Environment Variables":

```bash
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token
MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key
NODE_ENV=production
FRONTEND_URL=https://tudominio.com
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@tu-proyecto.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```

> **⚠️ IMPORTANTE**: Para `FIREBASE_PRIVATE_KEY`, copia todo el contenido incluyendo `-----BEGIN PRIVATE KEY-----` y `-----END PRIVATE KEY-----`. Los `\n` representan saltos de línea.

### 5. Deploy

1. Click "Deploy"
2. Espera ~1-2 minutos
3. Vercel te dará una URL como: `https://tu-proyecto.vercel.app`

### 6. Actualizar BACKEND_URL

1. Ve a "Settings" → "Environment Variables"
2. Agrega una nueva variable:
   ```
   BACKEND_URL=https://tu-proyecto.vercel.app
   ```
3. Haz un nuevo deploy desde "Deployments" → "Redeploy"

### 7. Configurar Webhook en Mercado Pago

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.mx/developers/panel)
2. Ve a "Tus integraciones" → Tu aplicación
3. En "Webhooks" configura:
   ```
   URL: https://tu-proyecto.vercel.app/api/payment/webhook
   Eventos: Pagos
   ```

### 8. Verificar el Deploy

Visita `https://tu-proyecto.vercel.app/` y deberías ver:
```json
{
  "success": true,
  "message": "Albercas y Agua - Mercado Pago API",
  "version": "1.0.0"
}
```

### 9. Actualizar Frontend

En tu archivo `.env` del frontend, actualiza:
```bash
VITE_MERCADOPAGO_BACKEND_URL=https://tu-proyecto.vercel.app
```

---

## 🌐 Deployment a Railway (Alternativa - Requiere Pago)

### 1. Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub
3. Click "New Project"
4. Selecciona "Deploy from GitHub repo"

### 2. Configurar Variables de Entorno

En Railway dashboard, ve a la pestaña "Variables" y agrega:

```bash
MERCADOPAGO_ACCESS_TOKEN=APP_USR-tu-access-token
MERCADOPAGO_PUBLIC_KEY=APP_USR-tu-public-key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://tudominio.com
BACKEND_URL=https://tu-proyecto.up.railway.app
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Deploy y Webhook

Railway desplegará automáticamente. Configura el webhook en Mercado Pago con la URL de Railway.

> **💡 Tip**: Railway requiere pago después de agotar el tier gratuito. Considera usar Vercel para hosting 100% gratis.

---

## 🌐 Deployment a Render (Alternativa - Free Tier Limitado)

### 1. Crear Cuenta en Render

1. Ve a [render.com](https://render.com)
2. Regístrate con GitHub
3. Click "New +"  → "Web Service"

### 2. Configurar Servicio

- **Repository**: Selecciona tu repo
- **Branch**: main
- **Root Directory**: backend
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### 3. Variables de Entorno

Agrega las mismas variables que en Railway.

### 4. Deploy

Render desplegará automáticamente y te dará una URL.

## 🔒 Seguridad

- ✅ Las credenciales de Mercado Pago NUNCA se exponen al frontend
- ✅ CORS configurado solo para el dominio del frontend
- ✅ Validación de requests con express-validator
- ✅ Firebase Service Account protegido en variables de entorno
- ✅ Serverless en Vercel: cada función se ejecuta en un contenedor aislado

## 🐛 Troubleshooting

### Error: Firebase Admin not initialized
Verifica que las credenciales de Firebase estén correctamente configuradas en las variables de entorno de Vercel.

### Error: MERCADOPAGO_ACCESS_TOKEN not configured
Asegúrate de que las variables de entorno estén configuradas en Vercel (Settings → Environment Variables).

### Webhook no funciona
1. Verifica que la URL del webhook esté configurada en Mercado Pago
2. Revisa los logs en Vercel (Runtime Logs)
3. Asegúrate de que la URL sea `https://tu-proyecto.vercel.app/api/payment/webhook`

### Cold Start (Vercel)
Si el primer request tarda 1-2 segundos, es normal. Vercel usa serverless functions que se "despiertan" con el primer request. Los siguientes serán instantáneos.

### CORS Error
Verifica que `FRONTEND_URL` en Vercel coincida EXACTAMENTE con tu dominio frontend (sin barra al final).

## 📝 Logs

En Vercel, puedes ver los logs en tiempo real:
1. Ve a tu proyecto en Vercel
2. Click en "Deployments" → Selecciona el deployment activo
3. Ve a "Runtime Logs" para ver requests en tiempo real

En Railway/Render también hay logs en el dashboard.

## 📞 Soporte

Para cualquier problema, revisa:
- Logs del servidor
- Consola de Mercado Pago
- Firebase Console (Firestore)

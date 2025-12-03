# Albercas y Agua - Backend API

Backend API para integración con Mercado Pago Checkout Pro.

## 🚀 Tecnologías

- **Node.js** - Runtime
- **Express** - Web framework
- **Mercado Pago SDK** - Integración de pagos
- **Firebase Admin SDK** - Base de datos Firestore
- **CORS** - Control de acceso
- **dotenv** - Variables de entorno

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

## 🌐 Deployment a Railway

### 1. Crear Cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub
3. Click "New Project"
4. Selecciona "Deploy from GitHub repo"

### 2. Configurar Variables de Entorno

En Railway dashboard, ve a la pestaña "Variables" y agrega:

```
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

### 3. Deploy

Railway detectará automáticamente el `package.json` y desplegará la aplicación.

### 4. Obtener URL

Una vez desplegado, Railway te dará una URL como: `https://tu-proyecto.up.railway.app`

### 5. Configurar Webhook en Mercado Pago

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.mx/developers/panel)
2. Ve a "Tus integraciones" → Tu aplicación
3. En "Webhooks" configura:
   ```
   URL: https://tu-proyecto.up.railway.app/api/payment/webhook
   Eventos: Pagos
   ```

## 🌐 Deployment a Render (Alternativa)

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

## 🐛 Troubleshooting

### Error: Firebase Admin not initialized
Verifica que las credenciales de Firebase estén correctamente configuradas en `.env`.

### Error: MERCADOPAGO_ACCESS_TOKEN not configured
Asegúrate de que el `.env` tenga el Access Token correcto.

### Webhook no funciona
1. Verifica que la URL del webhook esté configurada en Mercado Pago
2. Revisa los logs del servidor
3. Asegúrate de que el `BACKEND_URL` en el .env sea correcto

## 📝 Logs

En Railway/Render, puedes ver los logs en tiempo real desde el dashboard para debug.

## 📞 Soporte

Para cualquier problema, revisa:
- Logs del servidor
- Consola de Mercado Pago
- Firebase Console (Firestore)

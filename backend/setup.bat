@echo off
echo ============================================
echo  CONFIGURACION DE MERCADO PAGO - BACKEND
echo ============================================
echo.

echo [1/4] Creando archivo .env...
(
echo # Credenciales de Mercado Pago
echo MERCADOPAGO_ACCESS_TOKEN=APP_USR-5537528991577915-120314-945f38eddbb37973dc382c0691f5058e-2969789365
echo MERCADOPAGO_PUBLIC_KEY=APP_USR-9c59cc8c-aece-47de-9298-ddb0ac56c46e
echo.
echo # Configuracion del servidor
echo PORT=3001
echo NODE_ENV=development
echo.
echo # URLs
echo FRONTEND_URL=http://localhost:5173
echo BACKEND_URL=http://localhost:3001
echo.
echo # Firebase
echo FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
) > .env

echo    OK - Archivo .env creado

echo.
echo [2/4] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo    ERROR - No se pudieron instalar las dependencias
    echo    Intenta ejecutar manualmente: npm install
    pause
    exit /b 1
)
echo    OK - Dependencias instaladas

echo.
echo [3/4] Verificando Firebase Service Account...
if not exist serviceAccountKey.json (
    echo    ADVERTENCIA - No se encontro serviceAccountKey.json
    echo.
    echo    Pasos para obtenerlo:
    echo    1. Ve a Firebase Console: https://console.firebase.google.com
    echo    2. Project Settings - Service Accounts
    echo    3. Generate new private key
    echo    4. Guarda el archivo como serviceAccountKey.json aqui
    echo.
) else (
    echo    OK - serviceAccountKey.json encontrado
)

echo.
echo [4/4] Verificacion completa
echo.
echo ============================================
echo  CONFIGURACION COMPLETADA
echo ============================================
echo.
echo Para iniciar el servidor:
echo    npm run dev
echo.
echo El servidor estara disponible en:
echo    http://localhost:3001
echo.
echo Verifica que el frontend este configurado en:
echo    d:\Albercas y Agua\Albercas_Agua\.env
echo    VITE_BACKEND_URL=http://localhost:3001
echo.
pause

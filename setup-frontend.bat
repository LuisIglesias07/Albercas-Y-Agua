@echo off
echo ============================================
echo  CONFIGURACION FRONTEND - MERCADO PAGO
echo ============================================
echo.

echo Creando archivo .env...
(
echo VITE_ADMIN_EMAIL=tu-admin@email.com
echo VITE_BACKEND_URL=http://localhost:3001
) > .env

echo    OK - Archivo .env creado
echo.
echo ============================================
echo  CONFIGURACION COMPLETADA
echo ============================================
echo.
echo IMPORTANTE: Actualiza VITE_ADMIN_EMAIL en el archivo .env
echo.
echo Para iniciar el frontend:
echo    npm run dev
echo.
echo Asegurate de que el backend este corriendo en:
echo    http://localhost:3001
echo.
pause

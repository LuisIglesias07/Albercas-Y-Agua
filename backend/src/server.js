import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1. LIMPIEZA DE VARIABLE: Quitamos espacios vacíos o saltos de línea
const frontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : 'http://localhost:5173';

// 2. DEBUG: Esto nos dirá en los logs de Railway EXACTAMENTE qué está recibiendo (con comillas visibles)
console.log('🔍 FRONTEND_URL detectada:', JSON.stringify(frontendUrl));

// CORS configuration
const corsOptions = {
    origin: frontendUrl, // Usamos la variable limpia
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Albercas y Agua - Mercado Pago API',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        cors_configured_for: frontendUrl // Te mostrará en pantalla para quién está abierto
    });
});

// Routes
app.use('/api/payment', paymentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.path
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/`);
    console.log(`🌐 CORS enabled for: ${corsOptions.origin}`);
    console.log(`💳 Mercado Pago endpoints ready`);
});

export default app;
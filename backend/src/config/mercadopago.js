import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured in environment variables');
}

// Initialize Mercado Pago client
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
    options: {
        timeout: 5000,
        idempotencyKey: 'unique-key'
    }
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

console.log('✅ Mercado Pago SDK initialized successfully');

export default client;

import express from 'express';
import { body } from 'express-validator';
import { createPreference, handleWebhook } from '../controllers/payment.controller.js';

const router = express.Router();

/**
 * POST /api/payment/create-preference
 * Create a Mercado Pago payment preference
 */
router.post('/create-preference', [
    body('orderData').exists().withMessage('Order data is required'),
    body('orderData.items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('orderData.userEmail').isEmail().withMessage('Valid email is required'),
    body('orderData.shippingAddress').exists().withMessage('Shipping address is required'),
    body('orderData.total').isNumeric().withMessage('Total must be a number')
], createPreference);

/**
 * POST /api/payment/webhook
 * Receive Mercado Pago payment notifications
 */
router.post('/webhook', handleWebhook);

export default router;

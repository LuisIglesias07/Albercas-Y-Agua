import { preferenceClient, paymentClient } from '../config/mercadopago.js';
import { db } from '../config/firebase.js';
import { validationResult } from 'express-validator';

/**
 * Create Mercado Pago payment preference
 */
export const createPreference = async (req, res) => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { orderData } = req.body;
        const { items, shippingAddress, shippingCost, subtotal, total, userEmail } = orderData;

        // Create order in Firestore first
        const orderRef = await db.collection('orders').add({
            orderNumber: generateOrderNumber(),
            userId: orderData.userId || null,
            userEmail,
            items,
            shippingAddress,
            shippingMethod: orderData.shippingMethod || 'local',
            shippingCost,
            subtotal,
            total,
            status: 'pending',
            paymentMethod: 'mercadopago',
            paymentStatus: 'pending',
            createdAt: new Date(),
            updatedAt: new Date(),
            statusHistory: [{
                status: 'pending',
                timestamp: new Date(),
                note: 'Order created, awaiting payment'
            }]
        });

        const orderId = orderRef.id;

        // Prepare items for Mercado Pago
        const mpItems = items.map(item => ({
            id: item.productId,
            title: item.productName,
            description: item.category || 'Producto',
            category_id: item.category || 'others',
            quantity: item.quantity,
            unit_price: item.price,
            currency_id: 'MXN',
            picture_url: item.productImage || undefined
        }));

        // Add shipping as an item if cost > 0
        if (shippingCost > 0) {
            mpItems.push({
                title: 'Envío',
                description: `Envío por ${orderData.shippingMethod || 'local'}`,
                category_id: 'shipping',
                quantity: 1,
                unit_price: Number(shippingCost),
                currency_id: 'MXN'
            });
        }

        // Create preference
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const preference = await preferenceClient.create({
            body: {
                items: mpItems,
                payer: {
                    name: shippingAddress.fullName,
                    email: userEmail,
                    phone: {
                        number: shippingAddress.phone
                    },
                    address: {
                        street_name: shippingAddress.street,
                        city: shippingAddress.city,
                        federal_unit: shippingAddress.state,
                        zip_code: shippingAddress.zipCode
                    }
                },
                back_urls: {
                    success: `${frontendUrl}/payment/success?order_id=${orderId}`,
                    failure: `${frontendUrl}/payment/failure?order_id=${orderId}`,
                    pending: `${frontendUrl}/payment/pending?order_id=${orderId}`
                },
                auto_return: 'approved',
                notification_url: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/payment/webhook`,
                external_reference: orderId,
                statement_descriptor: 'Albercas y Agua',
                metadata: {
                    order_id: orderId,
                    order_number: (await orderRef.get()).data().orderNumber
                }
            }
        });

        console.log(`✅ Preference created for order ${orderId}: ${preference.id}`);

        res.json({
            success: true,
            orderId,
            preferenceId: preference.id,
            initPoint: preference.init_point,
            sandboxInitPoint: preference.sandbox_init_point
        });

    } catch (error) {
        console.error('❌ Error creating preference:', error);
        res.status(500).json({
            success: false,
            error: 'Error creating payment preference',
            details: error.message
        });
    }
};

/**
 * Handle Mercado Pago webhook notifications
 */
export const handleWebhook = async (req, res) => {
    try {
        const { type, data } = req.body;

        console.log('📩 Webhook received:', { type, data });

        // Only process payment notifications
        if (type === 'payment') {
            const paymentId = data.id;

            // Get payment details from Mercado Pago
            const payment = await paymentClient.get({ id: paymentId });

            const orderId = payment.external_reference;
            const paymentStatus = payment.status;

            console.log(`💳 Payment ${paymentId} status: ${paymentStatus} for order ${orderId}`);

            // Map Mercado Pago status to our payment status
            const statusMap = {
                'approved': 'paid',
                'rejected': 'failed',
                'cancelled': 'failed',
                'refunded': 'failed',
                'charged_back': 'failed',
                'in_process': 'pending',
                'pending': 'pending',
                'authorized': 'pending',
                'in_mediation': 'pending'
            };

            const ourPaymentStatus = statusMap[paymentStatus] || 'pending';

            // Update order in Firestore
            if (orderId) {
                const orderRef = db.collection('orders').doc(orderId);
                const orderDoc = await orderRef.get();

                if (orderDoc.exists) {
                    const currentOrder = orderDoc.data();

                    await orderRef.update({
                        paymentStatus: ourPaymentStatus,
                        paymentId: paymentId,
                        updatedAt: new Date(),
                        statusHistory: [
                            ...(currentOrder.statusHistory || []),
                            {
                                status: currentOrder.status,
                                timestamp: new Date(),
                                note: `Payment ${paymentStatus} - Mercado Pago ID: ${paymentId}`
                            }
                        ]
                    });

                    // If payment approved, update order status to processing
                    if (ourPaymentStatus === 'paid') {
                        await orderRef.update({
                            status: 'processing',
                            statusHistory: [
                                ...(currentOrder.statusHistory || []),
                                {
                                    status: 'processing',
                                    timestamp: new Date(),
                                    note: 'Payment confirmed, order processing'
                                }
                            ]
                        });
                    }

                    console.log(`✅ Order ${orderId} updated with payment status: ${ourPaymentStatus}`);
                } else {
                    console.warn(`⚠️ Order ${orderId} not found in database`);
                }
            }
        }

        // Always return 200 to acknowledge webhook
        res.status(200).json({ success: true });

    } catch (error) {
        console.error('❌ Error processing webhook:', error);
        // Still return 200 to prevent Mercado Pago from retrying
        res.status(200).json({ success: false, error: error.message });
    }
};

/**
 * Generate unique order number
 */
const generateOrderNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${random}`.toUpperCase();
};

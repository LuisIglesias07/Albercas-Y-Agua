import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'albercasvergaras@gmail.com';

/**
 * Send order confirmation email to customer
 */
export const sendOrderConfirmationEmail = async (orderData) => {
    try {
        const { userEmail, orderNumber, items, shippingAddress, total, shippingCost, subtotal } = orderData;

        const itemsHtml = items.map(item => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
                    ${item.productName}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    $${item.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">
                    $${item.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </td>
            </tr>
        `).join('');

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #0077b6, #00b4d8); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">¡Gracias por tu compra!</h1>
            <p style="color: #e3f2fd; margin: 10px 0 0 0; font-size: 16px;">Orden #${orderNumber}</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 20px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Hemos recibido tu pedido y está siendo procesado. Te enviaremos una actualización cuando tu pedido sea enviado.
            </p>

            <!-- Order Details -->
            <h2 style="color: #1f2937; font-size: 20px; margin: 32px 0 16px 0;">Detalles del Pedido</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <thead>
                    <tr style="background-color: #f9fafb;">
                        <th style="padding: 12px; text-align: left; font-size: 14px; color: #6b7280; font-weight: 600;">Producto</th>
                        <th style="padding: 12px; text-align: center; font-size: 14px; color: #6b7280; font-weight: 600;">Cant.</th>
                        <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280; font-weight: 600;">Precio</th>
                        <th style="padding: 12px; text-align: right; font-size: 14px; color: #6b7280; font-weight: 600;">Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>

            <!-- Totals -->
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Subtotal:</span>
                    <span style="color: #374151; font-weight: 600;">$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Envío:</span>
                    <span style="color: #374151; font-weight: 600;">${shippingCost > 0 ? `$${shippingCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : 'Gratis'}</span>
                </div>
                <div style="border-top: 2px solid #e5e7eb; margin-top: 12px; padding-top: 12px; display: flex; justify-content: space-between;">
                    <span style="color: #1f2937; font-size: 18px; font-weight: 700;">Total:</span>
                    <span style="color: #0077b6; font-size: 18px; font-weight: 700;">$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <!-- Shipping Address -->
            <h2 style="color: #1f2937; font-size: 20px; margin: 32px 0 16px 0;">Dirección de Envío</h2>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; color: #374151; line-height: 1.6;">
                <strong>${shippingAddress.fullName}</strong><br>
                ${shippingAddress.street}<br>
                ${shippingAddress.city}, ${shippingAddress.state}<br>
                CP: ${shippingAddress.zipCode}<br>
                Tel: ${shippingAddress.phone}
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin: 40px 0;">
                <p style="color: #6b7280; margin-bottom: 16px;">¿Tienes alguna pregunta sobre tu pedido?</p>
                <a href="https://wa.me/523121165367" style="background-color: #25D366; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
                    💬 Contáctanos por WhatsApp
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">
                Albercas y Agua - Expertos en equipos para albercas
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Este es un correo automático, por favor no respondas a este mensaje.
            </p>
        </div>
    </div>
</body>
</html>
        `;

        const { data, error } = await resend.emails.send({
            from: 'Albercas y Agua <onboarding@resend.dev>',
            to: [userEmail],
            subject: `Confirmación de Pedido - ${orderNumber}`,
            html: html
        });

        if (error) {
            console.error('❌ Error sending customer email:', error);
            throw error;
        }

        console.log(`✅ Customer confirmation email sent to ${userEmail}:`, data.id);
        return data;

    } catch (error) {
        console.error('❌ Failed to send customer email:', error);
        throw error;
    }
};

/**
 * Send new order notification to admin
 */
export const sendAdminNotificationEmail = async (orderData) => {
    try {
        const { orderNumber, items, shippingAddress, total, shippingCost, subtotal, userEmail } = orderData;

        const itemsList = items.map(item =>
            `• ${item.productName} x${item.quantity} - $${item.subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
        ).join('<br>');

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🎉 Nueva Venta</h1>
            <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">Orden #${orderNumber}</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 20px;">
            <!-- Order Summary -->
            <div style="background-color: #f0fdfa; border-left: 4px solid #10b981; padding: 20px; margin-bottom: 24px; border-radius: 4px;">
                <h3 style="color: #065f46; margin: 0 0 8px 0;">Resumen de Venta</h3>
                <p style="color: #047857; font-size: 24px; font-weight: 700; margin: 0;">
                    $${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </p>
            </div>

            <!-- Customer Info -->
            <h2 style="color: #1f2937; font-size: 20px; margin: 32px 0 16px 0;">Información del Cliente</h2>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; color: #374151; line-height: 1.8;">
                <strong>Nombre:</strong> ${shippingAddress.fullName}<br>
                <strong>Email:</strong> ${userEmail}<br>
                <strong>Teléfono:</strong> ${shippingAddress.phone}
            </div>

            <!-- Shipping Address -->
            <h2 style="color: #1f2937; font-size: 20px; margin: 32px 0 16px 0;">Dirección de Envío</h2>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; color: #374151; line-height: 1.8;">
                ${shippingAddress.street}<br>
                ${shippingAddress.city}, ${shippingAddress.state}<br>
                CP: ${shippingAddress.zipCode}
            </div>

            <!-- Products -->
            <h2 style="color: #1f2937; font-size: 20px; margin: 32px 0 16px 0;">Productos Vendidos</h2>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; color: #374151; line-height: 1.8;">
                ${itemsList}
            </div>

            <!-- Totals -->
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Subtotal:</span>
                    <span style="color: #374151; font-weight: 600;">$${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #6b7280;">Envío:</span>
                    <span style="color: #374151; font-weight: 600;">${shippingCost > 0 ? `$${shippingCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}` : 'Gratis / Retiro en tienda'}</span>
                </div>
                <div style="border-top: 2px solid #e5e7eb; margin-top: 12px; padding-top: 12px; display: flex; justify-content: space-between;">
                    <span style="color: #1f2937; font-size: 18px; font-weight: 700;">Total:</span>
                    <span style="color: #10b981; font-size: 18px; font-weight: 700;">$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <!-- Action -->
            <div style="text-align: center; margin: 40px 0;">
                <p style="color: #6b7280; margin-bottom: 16px;">Gestiona este pedido desde el panel de administración</p>
                <a href="${process.env.FRONTEND_URL}/admin" style="background-color: #0077b6; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
                    📋 Ver Panel de Admin
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 24px 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Notificación automática de Albercas y Agua
            </p>
        </div>
    </div>
</body>
</html>
        `;

        const { data, error } = await resend.emails.send({
            from: 'Albercas y Agua <onboarding@resend.dev>',
            to: [ADMIN_EMAIL],
            subject: `🎉 Nueva Venta - ${orderNumber} - $${total.toLocaleString('es-MX')}`,
            html: html
        });

        if (error) {
            console.error('❌ Error sending admin email:', error);
            throw error;
        }

        console.log(`✅ Admin notification email sent to ${ADMIN_EMAIL}:`, data.id);
        return data;

    } catch (error) {
        console.error('❌ Failed to send admin email:', error);
        throw error;
    }
};

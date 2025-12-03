import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import type { Order } from '../types/order';
import './PaymentSuccess.css';

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    const orderId = searchParams.get('order_id');

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                navigate('/');
                return;
            }

            try {
                const orderData = await getOrderById(orderId);
                setOrder(orderData);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId, navigate]);

    if (loading) {
        return (
            <div className="payment-page">
                <div className="container">
                    <div className="loading">Cargando...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page success-page">
            <div className="container">
                <div className="payment-card">
                    <div className="success-icon">✓</div>
                    <h1>¡Pago Exitoso!</h1>
                    <p className="success-message">
                        Tu pago ha sido procesado correctamente
                    </p>

                    {order && (
                        <div className="order-info">
                            <div className="info-row">
                                <span className="label">Número de orden:</span>
                                <span className="value">{order.orderNumber}</span>
                            </div>
                            <div className="info-row">
                                <span className="label">Total pagado:</span>
                                <span className="value total">
                                    ${order.total.toLocaleString('es-MX', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })}
                                </span>
                            </div>
                            <div className="info-row">
                                <span className="label">Email de confirmación:</span>
                                <span className="value">{order.userEmail}</span>
                            </div>
                        </div>
                    )}

                    <div className="next-steps">
                        <h3>📧 Próximos pasos:</h3>
                        <ul>
                            <li>Recibirás un email de confirmación en breve</li>
                            <li>Prepararemos tu pedido lo antes posible</li>
                            <li>Te notificaremos cuando esté listo para envío</li>
                        </ul>
                    </div>

                    <div className="action-buttons">
                        <button
                            onClick={() => navigate('/orders')}
                            className="primary-button"
                        >
                            Ver mi pedido
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="secondary-button"
                        >
                            Seguir comprando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

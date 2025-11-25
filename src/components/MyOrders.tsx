import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOrdersByEmail } from '../services/orderService';
import type { Order, OrderStatus } from '../types/order';
import './MyOrders.css';

const STATUS_COLORS: Record<OrderStatus, string> = {
    pending: '#F59E0B',
    processing: '#3B82F6',
    shipped: '#8B5CF6',
    delivered: '#10B981',
    cancelled: '#EF4444'
};

const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
};

export const MyOrders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        loadOrders();
    }, [user, navigate]);

    const loadOrders = async () => {
        if (!user?.email) return;

        try {
            const userOrders = await getOrdersByEmail(user.email);
            setOrders(userOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const openDetailModal = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number): string => {
        return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    };

    if (!user) {
        return null;
    }

    return (
        <div className="my-orders-page">
            <div className="container">
                <h1>Mis Pedidos</h1>
                <p className="subtitle">Historial completo de tus compras</p>

                {loading ? (
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Cargando pedidos...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="no-orders">
                        <div className="no-orders-icon">📦</div>
                        <h2>No tienes pedidos aún</h2>
                        <p>¡Empieza a comprar y realiza tu primer pedido!</p>
                        <button className="btn-shop" onClick={() => navigate('/products')}>
                            Ver Productos
                        </button>
                    </div>
                ) : (
                    <div className="orders-grid">
                        {orders.map(order => (
                            <div key={order.id} className="order-card">
                                <div className="order-header">
                                    <div>
                                        <h3>{order.orderNumber}</h3>
                                        <p className="order-date">{formatDate(order.createdAt)}</p>
                                    </div>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: STATUS_COLORS[order.status] }}
                                    >
                                        {STATUS_LABELS[order.status]}
                                    </span>
                                </div>

                                <div className="order-items">
                                    {order.items.slice(0, 3).map((item, index) => (
                                        <div key={index} className="order-item-preview">
                                            {item.productImage && (
                                                <img src={item.productImage} alt={item.productName} />
                                            )}
                                            <div className="item-details">
                                                <p className="item-name">{item.productName}</p>
                                                <p className="item-quantity">Cantidad: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.length > 3 && (
                                        <p className="more-items">+{order.items.length - 3} productos más</p>
                                    )}
                                </div>

                                <div className="order-footer">
                                    <div className="order-total">
                                        <span>Total:</span>
                                        <strong>{formatCurrency(order.total)}</strong>
                                    </div>
                                    <button className="btn-details" onClick={() => openDetailModal(order)}>
                                        Ver Detalles
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Detail Modal */}
                {showDetailModal && selectedOrder && (
                    <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Orden {selectedOrder.orderNumber}</h2>
                                <button className="modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
                            </div>

                            <div className="order-details">
                                <div className="detail-row">
                                    <span>Estado:</span>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: STATUS_COLORS[selectedOrder.status] }}
                                    >
                                        {STATUS_LABELS[selectedOrder.status]}
                                    </span>
                                </div>

                                <div className="detail-row">
                                    <span>Fecha:</span>
                                    <strong>{formatDate(selectedOrder.createdAt)}</strong>
                                </div>

                                <div className="detail-section">
                                    <h3>Productos</h3>
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="detail-item">
                                            {item.productImage && (
                                                <img src={item.productImage} alt={item.productName} />
                                            )}
                                            <div className="item-info">
                                                <p><strong>{item.productName}</strong></p>
                                                <p className="text-muted">Cantidad: {item.quantity}</p>
                                            </div>
                                            <div className="item-price">{formatCurrency(item.subtotal)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="detail-section">
                                    <h3>Dirección de Envío</h3>
                                    <p>{selectedOrder.shippingAddress.fullName}</p>
                                    <p>{selectedOrder.shippingAddress.street}</p>
                                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                                    <p>CP: {selectedOrder.shippingAddress.zipCode}</p>
                                    <p><strong>Método:</strong> {selectedOrder.shippingMethod.toUpperCase()}</p>
                                </div>

                                <div className="detail-totals">
                                    <div className="total-row">
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                    </div>
                                    <div className="total-row">
                                        <span>Envío:</span>
                                        <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                                    </div>
                                    <div className="total-row final">
                                        <span>Total:</span>
                                        <strong>{formatCurrency(selectedOrder.total)}</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

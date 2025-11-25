import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import type { Order, OrderStatus } from '../../types/order';
import { AdminNav } from './AdminNav';
import './OrdersManagement.css';

const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'Pendiente',
    processing: 'Procesando',
    shipped: 'En Camino',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
};

const STATUS_COLORS: Record<OrderStatus, string> = {
    pending: '#FEF3C7',
    processing: '#DBEAFE',
    shipped: '#FDE68A',
    delivered: '#D1FAE5',
    cancelled: '#FEE2E2'
};

export const OrdersManagement = () => {
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
    const [statusNote, setStatusNote] = useState('');

    useEffect(() => {
        if (userProfile && userProfile.role !== 'admin') {
            navigate('/');
        }
    }, [userProfile, navigate]);

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        if (selectedStatus === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(o => o.status === selectedStatus));
        }
    }, [orders, selectedStatus]);

    const loadOrders = async () => {
        try {
            const allOrders = await getAllOrders();
            setOrders(allOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!selectedOrder) return;

        try {
            await updateOrderStatus(selectedOrder.id, newStatus, statusNote);
            await loadOrders();
            setShowStatusModal(false);
            setStatusNote('');
            alert('Estado actualizado exitosamente');
        } catch (error: any) {
            alert('Error: ' + error.message);
        }
    };

    const openStatusModal = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setStatusNote('');
        setShowStatusModal(true);
    };

    const openDetailModal = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailModal(true);
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount: number): string => {
        return `$${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    };

    if (userProfile?.role !== 'admin') {
        return null;
    }

    const statusCounts: Record<string, number> = {
        all: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        processing: orders.filter(o => o.status === 'processing').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    return (
        <div className="orders-management">
            <div className="container">
                <div className="orders-header">
                    <h1>Gestión de Pedidos</h1>
                </div>

                <AdminNav />

                <div className="orders-layout">
                    <div className="status-sidebar">
                        <h3>Estado de Pedidos</h3>
                        <ul className="status-list">
                            <li
                                className={selectedStatus === 'all' ? 'active' : ''}
                                onClick={() => setSelectedStatus('all')}
                            >
                                <span className="status-name">Todos los pedidos</span>
                                <span className="status-count">{statusCounts.all}</span>
                            </li>
                            {(Object.keys(STATUS_LABELS) as OrderStatus[]).map(status => (
                                <li
                                    key={status}
                                    className={selectedStatus === status ? 'active' : ''}
                                    onClick={() => setSelectedStatus(status)}
                                    style={{ borderLeft: `4px solid ${STATUS_COLORS[status]}` }}
                                >
                                    <span className="status-name">{STATUS_LABELS[status]}</span>
                                    <span className="status-count">{statusCounts[status]}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="orders-section">
                        <div className="section-header">
                            <h2>
                                {selectedStatus === 'all'
                                    ? 'Todos los Pedidos'
                                    : STATUS_LABELS[selectedStatus as OrderStatus]}
                            </h2>
                            <span className="orders-total">{filteredOrders.length} pedidos</span>
                        </div>

                        {loading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>Cargando pedidos...</p>
                            </div>
                        ) : filteredOrders.length === 0 ? (
                            <div className="no-orders">
                                <p>No hay pedidos {selectedStatus !== 'all' && `en estado "${STATUS_LABELS[selectedStatus as OrderStatus]}"`}</p>
                            </div>
                        ) : (
                            <div className="orders-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Número de Pedido</th>
                                            <th>Cliente</th>
                                            <th>Productos</th>
                                            <th>Total</th>
                                            <th>Estado</th>
                                            <th>Fecha</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.map(order => (
                                            <tr key={order.id}>
                                                <td><strong>{order.orderNumber}</strong></td>
                                                <td>
                                                    <div>
                                                        <div>{order.shippingAddress.fullName}</div>
                                                        <div className="text-muted">{order.userEmail}</div>
                                                    </div>
                                                </td>
                                                <td>{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</td>
                                                <td><strong>{formatCurrency(order.total)}</strong></td>
                                                <td>
                                                    <span
                                                        className="status-badge"
                                                        style={{ backgroundColor: STATUS_COLORS[order.status] }}
                                                    >
                                                        {STATUS_LABELS[order.status]}
                                                    </span>
                                                </td>
                                                <td className="text-muted">{formatDate(order.createdAt)}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="btn-view"
                                                            onClick={() => openDetailModal(order)}
                                                            title="Ver detalles"
                                                        >
                                                            👁️
                                                        </button>
                                                        <button
                                                            className="btn-status"
                                                            onClick={() => openStatusModal(order)}
                                                            title="Cambiar estado"
                                                        >
                                                            🔄
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {showDetailModal && selectedOrder && (
                    <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                        <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Detalles de Pedido {selectedOrder.orderNumber}</h2>
                                <button className="modal-close" onClick={() => setShowDetailModal(false)}>✕</button>
                            </div>

                            <div className="order-details">
                                <div className="detail-section">
                                    <h3>Información del Cliente</h3>
                                    <p><strong>Nombre:</strong> {selectedOrder.shippingAddress.fullName}</p>
                                    <p><strong>Email:</strong> {selectedOrder.userEmail}</p>
                                    <p><strong>Teléfono:</strong> {selectedOrder.shippingAddress.phone}</p>
                                </div>

                                <div className="detail-section">
                                    <h3>Dirección de Envío</h3>
                                    <p>{selectedOrder.shippingAddress.street}</p>
                                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                                    <p>CP: {selectedOrder.shippingAddress.zipCode}</p>
                                    <p><strong>Método de envío:</strong> {selectedOrder.shippingMethod.toUpperCase()}</p>
                                </div>

                                <div className="detail-section">
                                    <h3>Productos</h3>
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <div className="item-info">
                                                {item.productImage && <img src={item.productImage} alt={item.productName} />}
                                                <div>
                                                    <strong>{item.productName}</strong>
                                                    <p className="text-muted">{item.category}</p>
                                                </div>
                                            </div>
                                            <div className="item-quantity">x{item.quantity}</div>
                                            <div className="item-price">{formatCurrency(item.subtotal)}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="detail-section totals">
                                    <p><strong>Subtotal:</strong> {formatCurrency(selectedOrder.subtotal)}</p>
                                    <p><strong>Envío:</strong> {formatCurrency(selectedOrder.shippingCost)}</p>
                                    <p className="total"><strong>Total:</strong> {formatCurrency(selectedOrder.total)}</p>
                                </div>

                                <div className="detail-section">
                                    <h3>Historial de Estados</h3>
                                    <div className="status-history">
                                        {selectedOrder.statusHistory.map((hist, index) => (
                                            <div key={index} className="history-item">
                                                <span className="history-status" style={{ color: STATUS_COLORS[hist.status] }}>
                                                    {STATUS_LABELS[hist.status]}
                                                </span>
                                                <span className="history-date">{formatDate(hist.timestamp)}</span>
                                                {hist.note && <span className="history-note">{hist.note}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {showStatusModal && selectedOrder && (
                    <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Actualizar Estado</h2>
                                <button className="modal-close" onClick={() => setShowStatusModal(false)}>✕</button>
                            </div>

                            <div className="status-form">
                                <p><strong>Pedido:</strong> {selectedOrder.orderNumber}</p>
                                <p><strong>Estado actual:</strong> {STATUS_LABELS[selectedOrder.status]}</p>

                                <div className="form-group">
                                    <label>Nuevo Estado</label>
                                    <select value={newStatus} onChange={(e) => setNewStatus(e.target.value as OrderStatus)}>
                                        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map(status => (
                                            <option key={status} value={status}>{STATUS_LABELS[status]}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Nota (opcional)</label>
                                    <textarea
                                        value={statusNote}
                                        onChange={(e) => setStatusNote(e.target.value)}
                                        placeholder="Agregar una nota sobre este cambio"
                                        rows={3}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button className="btn-cancel" onClick={() => setShowStatusModal(false)}>
                                        Cancelar
                                    </button>
                                    <button className="btn-save" onClick={handleStatusUpdate}>
                                        Actualizar Estado
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

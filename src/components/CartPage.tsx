import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './CartPage.css';

export const CartPage = () => {
    const navigate = useNavigate();
    const { items, updateQuantity, removeItem, clearCart, totalItems, totalAmount } = useCart();

    const formatPrice = (price: number): string => {
        return `$${price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getItemPrice = (item: any): number => {
        return item.price || item.price_min || 0;
    };

    const handleClearCart = () => {
        if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
            clearCart();
        }
    };

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Tu carrito está vacío</h2>
                        <p>¡Agrega productos para comenzar tu compra!</p>
                        <Link to="/products" className="continue-shopping-btn">
                            Ver productos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Mi Carrito</h1>
                    <button onClick={handleClearCart} className="clear-cart-btn">
                        🗑️ Vaciar carrito
                    </button>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div className="item-image">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} />
                                    ) : (
                                        <div className="item-placeholder">📦</div>
                                    )}
                                </div>

                                <div className="item-details">
                                    <Link to={`/product/${item.id}`} className="item-name">
                                        {item.name}
                                    </Link>
                                    <p className="item-category">{item.category}</p>
                                    <p className="item-price-unit">
                                        {formatPrice(getItemPrice(item))} c/u
                                    </p>
                                </div>

                                <div className="item-quantity">
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        −
                                    </button>
                                    <span className="qty-display">{item.quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="item-total">
                                    <p className="item-total-price">
                                        {formatPrice(getItemPrice(item) * item.quantity)}
                                    </p>
                                    <button
                                        className="remove-item-btn"
                                        onClick={() => removeItem(item.id)}
                                        title="Eliminar producto"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h3>Resumen del pedido</h3>

                        <div className="summary-line">
                            <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'}):</span>
                            <span>{formatPrice(totalAmount)}</span>
                        </div>

                        <div className="summary-line">
                            <span>Envío:</span>
                            <span className="shipping-note">A calcular</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-line total-line">
                            <span>Total estimado:</span>
                            <span className="total-amount">{formatPrice(totalAmount)}</span>
                        </div>

                        <button
                            className="checkout-btn"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceder al pago
                        </button>

                        <Link to="/products" className="continue-shopping-link">
                            ← Continuar comprando
                        </Link>

                        <div className="shipping-info">
                            <h4>Opciones de envío:</h4>
                            <ul>
                                <li>📦 Retiro en tienda (Gratis)</li>
                                <li>🚚 Envío nacional (FedEx/DHL)</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

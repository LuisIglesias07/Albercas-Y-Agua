import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createPaymentPreference } from '../services/paymentService';
import './Checkout.css';

interface ShippingFormData {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export const Checkout = () => {
    const navigate = useNavigate();
    const { items, totalAmount, clearCart } = useCart();
    const { user } = useAuth();

    const [formData, setFormData] = useState<ShippingFormData>({
        fullName: '',
        email: user?.email || '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'México'
    });

    const [shippingMethod, setShippingMethod] = useState<'local' | 'fedex' | 'dhl'>('local');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Redirect if cart is empty
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items, navigate]);

    // Detect if cart has products requiring shipping quotation
    const hasQuoteProducts = items.some((item: any) => item.requiereCotizacion);

    const getShippingCost = (): number => {
        if (shippingMethod === 'local') return 0;
        if (shippingMethod === 'fedex') return 150;
        if (shippingMethod === 'dhl') return 200;
        return 0;
    };

    const shippingCost = getShippingCost();
    const total = totalAmount + shippingCost;

    const formatPrice = (price: number): string => {
        return `$${price.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const getItemPrice = (item: any): number => {
        return item.price || item.price_min || 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = (): boolean => {
        if (!formData.fullName || !formData.email || !formData.phone || !formData.street ||
            !formData.city || !formData.state || !formData.zipCode) {
            setError('Por favor completa todos los campos obligatorios');
            return false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor ingresa un email válido');
            return false;
        }

        return true;
    };

    const handleCheckout = async () => {
        setError(null);

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Prepare order data
            const orderData = {
                userId: user?.uid,
                userEmail: formData.email,
                items: items.map(item => ({
                    productId: item.id,
                    productName: item.name,
                    productImage: item.image,
                    category: item.category,
                    quantity: item.quantity,
                    price: getItemPrice(item),
                    subtotal: getItemPrice(item) * item.quantity
                })),
                shippingAddress: formData,
                shippingMethod,
                shippingCost,
                subtotal: totalAmount,
                total
            };

            // Create payment preference
            const response = await createPaymentPreference({ orderData });

            // Clear cart
            clearCart();

            // Redirect to Mercado Pago
            window.location.href = response.initPoint;

        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'Error al procesar el pago. Por favor intenta de nuevo.');
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Finalizar Compra</h1>

                <div className="checkout-content">
                    <div className="checkout-form">
                        <section className="form-section">
                            <h2>📍 Información de Envío</h2>

                            <div className="form-group">
                                <label htmlFor="fullName">Nombre Completo *</label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Juan Pérez"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="tu@email.com"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Teléfono *</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="5512345678"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="street">Calle y Número *</label>
                                <input
                                    type="text"
                                    id="street"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleInputChange}
                                    placeholder="Av. Principal #123"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">Ciudad *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        placeholder="Ciudad de México"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="state">Estado *</label>
                                    <input
                                        type="text"
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        placeholder="CDMX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="zipCode">Código Postal *</label>
                                    <input
                                        type="text"
                                        id="zipCode"
                                        name="zipCode"
                                        value={formData.zipCode}
                                        onChange={handleInputChange}
                                        placeholder="01000"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="country">País *</label>
                                    <input
                                        type="text"
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        required
                                        disabled
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h2>🚚 Método de Envío</h2>

                            {hasQuoteProducts && (
                                <div className="shipping-quote-alert">
                                    ⚠️ Tu carrito incluye productos que requieren cotización de envío.
                                    Por favor selecciona "Retiro en tienda" o contáctanos por WhatsApp para cotizar el envío.
                                </div>
                            )}

                            <div className="shipping-options">
                                <label className={`shipping-option ${shippingMethod === 'local' ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="shippingMethod"
                                        value="local"
                                        checked={shippingMethod === 'local'}
                                        onChange={(e) => setShippingMethod(e.target.value as any)}
                                    />
                                    <div className="option-content">
                                        <div className="option-title">📦 Retiro en tienda</div>
                                        <div className="option-price">Gratis</div>
                                    </div>
                                </label>

                                {!hasQuoteProducts && (
                                    <>
                                        <label className={`shipping-option ${shippingMethod === 'fedex' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                value="fedex"
                                                checked={shippingMethod === 'fedex'}
                                                onChange={(e) => setShippingMethod(e.target.value as any)}
                                            />
                                            <div className="option-content">
                                                <div className="option-title">📮 FedEx (3-5 días)</div>
                                                <div className="option-price">{formatPrice(150)}</div>
                                            </div>
                                        </label>

                                        <label className={`shipping-option ${shippingMethod === 'dhl' ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="shippingMethod"
                                                value="dhl"
                                                checked={shippingMethod === 'dhl'}
                                                onChange={(e) => setShippingMethod(e.target.value as any)}
                                            />
                                            <div className="option-content">
                                                <div className="option-title">✈️ DHL Express (1-2 días)</div>
                                                <div className="option-price">{formatPrice(200)}</div>
                                            </div>
                                        </label>
                                    </>
                                )}

                                {hasQuoteProducts && (
                                    <button
                                        type="button"
                                        className="whatsapp-quote-checkout-btn"
                                        onClick={() => {
                                            const productsText = items
                                                .filter((item: any) => item.requiereCotizacion)
                                                .map((item: any) => `- ${item.name}`)
                                                .join('\n');
                                            const message = encodeURIComponent(
                                                `Hola, necesito cotizar el envío para:\n${productsText}\n\nMi dirección será:\n${formData.street}, ${formData.city}, ${formData.state}, CP: ${formData.zipCode}`
                                            );
                                            window.open(`https://web.whatsapp.com/send?phone=523121165367&text=${message}`, '_blank');
                                        }}
                                    >
                                        💬 Cotizar envío por WhatsApp
                                    </button>
                                )}
                            </div>
                        </section>
                    </div>

                    <div className="checkout-summary">
                        <h2>Resumen del Pedido</h2>

                        <div className="summary-items">
                            {items.map(item => (
                                <div key={item.id} className="summary-item">
                                    <div className="item-image">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} />
                                        ) : (
                                            <div className="item-placeholder">📦</div>
                                        )}
                                    </div>
                                    <div className="item-details">
                                        <div className="item-name">{item.name}</div>
                                        <div className="item-qty">Cantidad: {item.quantity}</div>
                                    </div>
                                    <div className="item-price">
                                        {formatPrice(getItemPrice(item) * item.quantity)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="summary-line">
                                <span>Subtotal:</span>
                                <span>{formatPrice(totalAmount)}</span>
                            </div>
                            <div className="summary-line">
                                <span>Envío:</span>
                                <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-line total-line">
                                <span>Total:</span>
                                <span className="total-amount">{formatPrice(total)}</span>
                            </div>
                        </div>

                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            className="pay-button"
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    💳 Pagar con Mercado Pago
                                </>
                            )}
                        </button>

                        <div className="payment-info">
                            <p>🔒 Pago seguro con Mercado Pago</p>
                            <p>Serás redirigido a la plataforma de pago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAllProducts, type Product } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import './ProductDetail.css';

export const ProductDetail = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const products = await getAllProducts();
                const foundProduct = products.find(p => p.id === productId);
                setProduct(foundProduct || null);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        }
    };

    const handleBuyNow = () => {
        if (product) {
            addItem(product, quantity);
            navigate('/cart');
        }
    };

    const formatPrice = (product: Product): string => {
        if (product.price) {
            return `$${product.price.toLocaleString('es-MX')}`;
        } else if (product.price_min && product.price_max) {
            return `$${product.price_min.toLocaleString('es-MX')} - $${product.price_max.toLocaleString('es-MX')}`;
        } else if (product.price_min) {
            return `Desde $${product.price_min.toLocaleString('es-MX')}`;
        }
        return 'Precio bajo cotización';
    };

    if (loading) {
        return (
            <div className="product-detail-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-container">
                <div className="not-found">
                    <h2>Producto no encontrado</h2>
                    <Link to="/products" className="back-button">
                        ← Volver a productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            <div className="container">
                <Link to={`/category/${product.category}`} className="back-link">
                    ← Volver a {product.category}
                </Link>

                <div className="product-detail-content">
                    <div className="product-image-section">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="product-image" />
                        ) : (
                            <div className="product-placeholder">
                                <span className="placeholder-icon">📦</span>
                                <p>Sin imagen</p>
                            </div>
                        )}
                    </div>

                    <div className="product-info-section">
                        <div className="product-category-badge">{product.category}</div>
                        <h1 className="product-title">{product.name}</h1>

                        <div className="product-price">
                            <span className="price-label">Precio:</span>
                            <span className="price-value">{formatPrice(product)}</span>
                        </div>

                        <div className="product-description">
                            <h3>Descripción</h3>
                            <p>{product.description || 'Sin descripción disponible'}</p>
                        </div>

                        <div className="quantity-selector">
                            <label htmlFor="quantity">Cantidad:</label>
                            <div className="quantity-controls">
                                <button
                                    className="quantity-btn"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    −
                                </button>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="quantity-input"
                                />
                                <button
                                    className="quantity-btn"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="product-actions">
                            <button
                                className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
                                onClick={handleAddToCart}
                            >
                                {addedToCart ? '✓ Agregado al carrito' : '🛒 Añadir al carrito'}
                            </button>

                            <button
                                className="buy-now-btn"
                                onClick={handleBuyNow}
                            >
                                💳 Comprar ahora
                            </button>
                        </div>

                        <div className="product-features">
                            <h4>Información adicional</h4>
                            <ul>
                                <li>✓ Envío a toda la República Mexicana</li>
                                <li>✓ Retiro en tienda disponible</li>
                                <li>✓ Asesoría técnica incluida</li>
                                <li>✓ Garantía del fabricante</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

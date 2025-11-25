import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory, type Product } from '../services/productService';
import './CategoryDetail.css';

export const CategoryDetail = () => {
    const { categoryName } = useParams<{ categoryName: string }>();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!categoryName) return;

            try {
                const categoryProducts = await getProductsByCategory(categoryName);
                setProducts(categoryProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]);

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
            <section className="category-detail-section">
                <div className="container">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <p>Cargando productos...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="category-detail-section">
            <div className="container">
                <Link to="/products" className="back-button">
                    ← Volver a categorías
                </Link>

                <h1 className="category-title">{categoryName}</h1>
                <p className="category-subtitle">
                    {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
                </p>

                {products.length === 0 ? (
                    <div className="no-products">
                        <p>No hay productos disponibles en esta categoría</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="product-card-link"
                            >
                                <div className="product-card">
                                    <div className="product-image-container">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="product-image" />
                                        ) : (
                                            <div className="product-placeholder">
                                                <span className="placeholder-icon">📦</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-description">
                                            {product.description && product.description.length > 100
                                                ? `${product.description.substring(0, 100)}...`
                                                : product.description || 'Sin descripción'}
                                        </p>
                                        <div className="product-price">{formatPrice(product)}</div>
                                        <button className="view-product-btn">
                                            Ver detalles →
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

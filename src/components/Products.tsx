import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, getAllCategories } from '../services/productService';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types/product';
import './Products.css';

export const Products = () => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                getAllProducts(),
                getAllCategories()
            ]);
            setProducts(productsData);
            setCategories(categoriesData);
            setLoading(false);
        };

        fetchData();
    }, []);

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Contar productos por categoría
    const categoryCounts = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    const handleAddToCart = (product: Product) => {
        addItem(product, 1);
    };

    const getProductPrice = (product: Product): string => {
        if (product.price) {
            return `$${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
        } else if (product.price_min && product.price_max) {
            return `$${product.price_min.toLocaleString('es-MX')} - $${product.price_max.toLocaleString('es-MX')}`;
        }
        return 'Consultar precio';
    };

    if (loading) {
        return (
            <section className="products-section">
                <div className="container">
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Cargando productos...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="products-section">
            <div className="container">
                <h1 className="products-title">Catálogo de Productos</h1>
                <p className="products-intro">
                    Explora nuestra amplia gama de productos para albercas de la más alta calidad
                </p>

                {/* Top Bar con búsqueda y filtros */}
                <div className="products-topbar">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="🔍 Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <button
                        className="filter-toggle-btn"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        📂 Categorías ({selectedCategory === 'all' ? 'Todas' : selectedCategory})
                        <span className="toggle-icon">{showFilters ? '▲' : '▼'}</span>
                    </button>
                </div>

                {/* Panel de Categorías Desplegable */}
                {showFilters && (
                    <div className="filters-panel">
                        <h3>Filtrar por Categoría:</h3>
                        <div className="category-filters">
                            <button
                                className={`category-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedCategory('all');
                                    setShowFilters(false);
                                }}
                            >
                                📦 Todas las categorías ({products.length})
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    className={`category-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setShowFilters(false);
                                    }}
                                >
                                    📂 {category} ({categoryCounts[category] || 0})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div className="results-count">
                    Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'}
                    {selectedCategory !== 'all' && ` en ${selectedCategory}`}
                </div>

                {/* Products Grid */}
                <div className="products-grid">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <div
                                className="product-image-container"
                                onClick={() => navigate(`/product/${product.id}`)}
                            >
                                {product.image ? (
                                    <img src={product.image} alt={product.name} className="product-image" />
                                ) : (
                                    <div className="product-placeholder">📦</div>
                                )}
                            </div>

                            <div className="product-info">
                                <span className="product-category">{product.category}</span>
                                <h3
                                    className="product-name"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    {product.name}
                                </h3>
                                <p className="product-description">
                                    {(product.description || '').length > 100
                                        ? `${(product.description || '').substring(0, 100)}...`
                                        : (product.description || 'Sin descripción')}
                                </p>
                                <div className="product-footer">
                                    <span className="product-price">{getProductPrice(product)}</span>
                                    <div className="product-actions">
                                        <button
                                            className="btn-view"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        >
                                            Ver
                                        </button>
                                        <button
                                            className="btn-add-cart"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            🛒
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results Message */}
                {filteredProducts.length === 0 && (
                    <div className="no-results">
                        <p>No se encontraron productos con los criterios de búsqueda.</p>
                        <button
                            className="reset-btn"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('all');
                            }}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

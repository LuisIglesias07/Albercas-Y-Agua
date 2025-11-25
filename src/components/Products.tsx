import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, getAllCategories } from '../services/productService';
import type { Product } from '../services/productService';
import './Products.css';

// Iconos para cada categoría
const categoryIcons: { [key: string]: string } = {
    'Bombas para alberca residenciales': '💧',
    'Bombas para hidromasaje': '🌀',
    'Bombas de velocidad variable': '⚡',
    'Filtros de arena termoplásticos PDG': '🔵',
    'Filtros de arena termoplásticos HAX-S': '🔷',
    'Filtros de arena fibra de vidrio': '🌪️',
    'Calentador solar': '☀️',
    'Bombas de calor': '🔥',
    'Automatización y control': '🎛️',
    'Iluminación AC': '💡',
    'Iluminación DC': '✨',
    'Sanitización': '🧪',
    'Hidromasaje': '💆',
    'Sopladores': '🌬️',
    'Accesorios empotrables': '🔧',
    'Escaleras y pasamanos': '🪜',
    'Enrolladores': '♻️',
    'Nado contra corriente': '🏊',
    'Cascadas': '💦',
    'Boquillas para chorro en piso': '🚿',
    'Válvulas y PVC': '🔩',
    'Equipo de limpieza HAX': '🧹',
    'Generadores de vapor': '♨️',
    'Juguetes': '🎾',
    'Mosaico vítreo': '🟦',
};

export const Products = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

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

    // Agrupar productos por categoría y contar
    const categoryCounts = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
    }, {} as { [key: string]: number });

    // Filtrar categorías
    const filteredCategories = categories.filter(category => {
        const matchesSearch = category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && categoryCounts[category] > 0;
    });

    const handleCategoryClick = (categoryName: string) => {
        navigate(`/category/${encodeURIComponent(categoryName)}`);
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

                {/* Search Bar */}
                <div className="products-controls">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="🔍 Buscar categorías..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Results Count */}
                <div className="results-count">
                    Mostrando {filteredCategories.length} de {categories.length} categorías
                </div>

                {/* Category Grid */}
                <div className="category-grid">
                    {filteredCategories.map((category) => (
                        <div key={category} className="category-card">
                            <div className="category-icon">
                                {categoryIcons[category] || '📦'}
                            </div>
                            <h3 className="category-title">{category}</h3>
                            <p className="category-count">
                                {categoryCounts[category]} {categoryCounts[category] === 1 ? 'producto' : 'productos'}
                            </p>
                            <button
                                className="category-button"
                                onClick={() => handleCategoryClick(category)}
                            >
                                Ver Productos
                            </button>
                        </div>
                    ))}
                </div>

                {/* No Results Message */}
                {filteredCategories.length === 0 && (
                    <div className="no-results">
                        <p>No se encontraron categorías con los criterios de búsqueda.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

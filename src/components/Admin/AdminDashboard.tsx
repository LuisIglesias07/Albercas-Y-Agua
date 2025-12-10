import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAllProducts } from '../../services/productService';
import { createProduct, updateProduct, deleteProduct, toggleProductAvailability, deleteCategoryWithProducts } from '../../services/adminService';
import type { Product } from '../../types/product';
import { AdminNav } from './AdminNav';
import './AdminDashboard.css';

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const { userProfile } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        price_min: '',
        price_max: '',
        stock: '',
        available: true
    });

    // Check if user is admin
    useEffect(() => {
        if (userProfile && userProfile.role !== 'admin') {
            navigate('/');
        }
    }, [userProfile, navigate]);

    // Load products
    useEffect(() => {
        loadProducts();
    }, []);

    // Extract categories and filter products
    useEffect(() => {
        const uniqueCategories = Array.from(new Set(products.map(p => p.category))).sort();
        setCategories(uniqueCategories);

        if (selectedCategory === 'all') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === selectedCategory));
        }
    }, [products, selectedCategory]);

    const loadProducts = async () => {
        try {
            const allProducts = await getAllProducts();
            setProducts(allProducts);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setImageUrl(url);
        setImagePreview(url);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            category: selectedCategory !== 'all' ? selectedCategory : '',
            price: '',
            price_min: '',
            price_max: '',
            stock: '',
            available: true
        });
        setImageUrl('');
        setImagePreview('');
        setShowModal(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            category: product.category,
            price: product.price?.toString() || '',
            price_min: product.price_min?.toString() || '',
            price_max: product.price_max?.toString() || '',
            stock: product.stock?.toString() || '',
            available: product.available !== false
        });
        setImagePreview(product.image || '');
        setImageUrl('');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const productData: Partial<Product> = {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                available: formData.available,
                image: imageUrl || editingProduct?.image || ''
            };

            // Only include numeric fields if they have values
            if (formData.price && !isNaN(parseFloat(formData.price))) {
                productData.price = parseFloat(formData.price);
            }

            if (formData.price_min && !isNaN(parseFloat(formData.price_min))) {
                productData.price_min = parseFloat(formData.price_min);
            }

            if (formData.price_max && !isNaN(parseFloat(formData.price_max))) {
                productData.price_max = parseFloat(formData.price_max);
            }

            if (formData.stock && !isNaN(parseInt(formData.stock))) {
                productData.stock = parseInt(formData.stock);
            }

            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await createProduct(productData);
            }

            await loadProducts();
            setShowModal(false);
            alert(editingProduct ? 'Producto actualizado exitosamente' : 'Producto creado exitosamente');
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (product: Product) => {
        if (window.confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
            try {
                console.log('🔴 Iniciando eliminación de producto:', product.id, product.name);
                await deleteProduct(product.id, product.image);
                console.log('✅ Producto eliminado del servicio, recargando lista...');
                await loadProducts();
                console.log('✅ Lista de productos recargada');
                alert('Producto eliminado exitosamente');
            } catch (error: any) {
                console.error('❌ Error al eliminar:', error);
                alert('Error: ' + error.message);
            }
        }
    };

    const handleToggleAvailability = async (product: Product) => {
        try {
            await toggleProductAvailability(product.id, !product.available);
            await loadProducts();
        } catch (error: any) {
            alert('Error: ' + error.message);
        }
    };

    const handleDeleteCategory = async (categoryName: string) => {
        const count = products.filter(p => p.category === categoryName).length;

        if (window.confirm(`⚠️ ¿Estás seguro de eliminar la categoría "${categoryName}" y TODOS sus ${count} productos?\n\nEsta acción no se puede deshacer.`)) {
            try {
                const deletedCount = await deleteCategoryWithProducts(categoryName);
                await loadProducts();
                setSelectedCategory('all');
                alert(`✅ Categoría eliminada exitosamente.\n${deletedCount} productos marcados como eliminados.`);
            } catch (error: any) {
                alert('Error: ' + error.message);
            }
        }
    };

    if (userProfile?.role !== 'admin') {
        return null;
    }

    return (
        <div className="admin-dashboard">
            <div className="container">
                <div className="admin-header">
                    <h1>Panel de Administración</h1>
                    <button className="create-product-btn" onClick={openCreateModal}>
                        + Crear Producto
                    </button>
                </div>

                {/* Admin Navigation */}
                <AdminNav />

                <div className="admin-layout">
                    {/* Categories Sidebar */}
                    <div className="categories-sidebar">
                        <h3>📁 Categorías</h3>
                        <ul className="category-list">
                            <li
                                className={selectedCategory === 'all' ? 'active' : ''}
                                onClick={() => setSelectedCategory('all')}
                            >
                                <span className="category-name">
                                    <span className="category-icon">📦</span>
                                    Todas las categorías
                                </span>
                                <span className="category-count">{products.length}</span>
                            </li>
                            {categories.map(category => {
                                const count = products.filter(p => p.category === category).length;
                                return (
                                    <li
                                        key={category}
                                        className={selectedCategory === category ? 'active' : ''}
                                    >
                                        <span
                                            className="category-name"
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            <span className="category-icon">📂</span>
                                            {category}
                                        </span>
                                        <div className="category-actions">
                                            <span className="category-count">{count}</span>
                                            <button
                                                className="delete-category-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteCategory(category);
                                                }}
                                                title="Eliminar categoría y todos sus productos"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Products Section */}
                    <div className="products-section">
                        <div className="section-header">
                            <h2>
                                {selectedCategory === 'all'
                                    ? 'Todos los Productos'
                                    : selectedCategory}
                            </h2>
                            <div className="stats-inline">
                                <span><strong>{filteredProducts.length}</strong> productos</span>
                                <span><strong>{filteredProducts.filter(p => p.available !== false).length}</strong> disponibles</span>
                                <span><strong>{filteredProducts.filter(p => p.available === false).length}</strong> congelados</span>
                            </div>
                        </div>

                        {loading ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>Cargando productos...</p>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="no-products">
                                <p>No hay productos en esta categoría</p>
                            </div>
                        ) : (
                            <div className="products-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Imagen</th>
                                            <th>Nombre</th>
                                            <th className="category-column">Categoría</th>
                                            <th>Precio</th>
                                            <th>Stock</th>
                                            <th>Estado</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(product => (
                                            <tr key={product.id} className={product.available === false ? 'product-frozen' : ''}>
                                                <td>
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className="product-thumb" />
                                                    ) : (
                                                        <div className="product-thumb-placeholder">📦</div>
                                                    )}
                                                </td>
                                                <td><strong>{product.name}</strong></td>
                                                <td className="category-column">{product.category}</td>
                                                <td>
                                                    {product.price ? `$${product.price.toLocaleString()}` :
                                                        product.price_min && product.price_max ?
                                                            `$${product.price_min.toLocaleString()} - $${product.price_max.toLocaleString()}` :
                                                            'N/A'}
                                                </td>
                                                <td>{product.stock || 'N/A'}</td>
                                                <td>
                                                    <span className={`status-badge ${product.available !== false ? 'available' : 'frozen'}`}>
                                                        {product.available !== false ? 'Disponible' : 'Congelado'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="btn-edit" onClick={() => openEditModal(product)} title="Editar">
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className={`btn-toggle ${product.available !== false ? 'freeze' : 'unfreeze'}`}
                                                            onClick={() => handleToggleAvailability(product)}
                                                            title={product.available !== false ? 'Congelar' : 'Descongelar'}
                                                        >
                                                            {product.available !== false ? '❄️' : '✓'}
                                                        </button>
                                                        <button className="btn-delete" onClick={() => handleDelete(product)} title="Eliminar">
                                                            🗑️
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

                {/* Modal for Create/Edit */}
                {showModal && (
                    <div className="modal-overlay" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{editingProduct ? 'Editar Producto' : 'Crear Producto'}</h2>
                                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="product-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Nombre del Producto *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Categoría *</label>
                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            required
                                            list="categories-list"
                                        />
                                        <datalist id="categories-list">
                                            {categories.map(cat => (
                                                <option key={cat} value={cat} />
                                            ))}
                                        </datalist>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Descripción</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Precio Fijo</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Precio Mínimo</label>
                                        <input
                                            type="number"
                                            name="price_min"
                                            value={formData.price_min}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Precio Máximo</label>
                                        <input
                                            type="number"
                                            name="price_max"
                                            value={formData.price_max}
                                            onChange={handleInputChange}
                                            step="0.01"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Stock</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleInputChange}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="form-group checkbox-group">
                                        <label>
                                            <input
                                                type="checkbox"
                                                name="available"
                                                checked={formData.available}
                                                onChange={handleInputChange}
                                            />
                                            Disponible
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>URL de Imagen del Producto</label>
                                    <input
                                        type="url"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        value={imageUrl}
                                        onChange={handleImageUrlChange}
                                    />
                                    <small style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                                        Sube tu imagen a Imgur, Google Drive (link público), o cualquier servicio gratuito
                                    </small>
                                    {imagePreview && (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                        </div>
                                    )}
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-save" disabled={loading}>
                                        {loading ? 'Guardando...' : (editingProduct ? 'Actualizar' : 'Crear')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

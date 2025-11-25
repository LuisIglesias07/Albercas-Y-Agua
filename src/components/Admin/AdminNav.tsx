import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNav.css';

export const AdminNav = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');

    const handleNavigation = (tab: string, path: string) => {
        setActiveTab(tab);
        navigate(path);
    };

    return (
        <nav className="admin-nav">
            <div className="admin-nav-container">
                <button
                    className={`admin-nav-btn ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => handleNavigation('products', '/admin')}
                >
                    📦 Productos
                </button>
                <button
                    className={`admin-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => handleNavigation('orders', '/admin/orders')}
                >
                    🛒 Pedidos
                </button>
                <button
                    className={`admin-nav-btn ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => handleNavigation('analytics', '/admin/analytics')}
                >
                    📊 Analíticas
                </button>
            </div>
        </nav>
    );
};

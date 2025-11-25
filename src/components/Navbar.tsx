import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { logoutUser } from '../services/authService';
import './Navbar.css';

export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, userProfile } = useAuth();
    const { totalItems } = useCart();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        setIsMenuOpen(false);

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                scrollToElement(targetId);
            }, 100);
        } else {
            scrollToElement(targetId);
        }
    };

    const scrollToElement = (targetId: string) => {
        const element = document.getElementById(targetId);
        if (element) {
            const navbarHeight = 80;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - navbarHeight;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const handleLogout = async () => {
        await logoutUser();
        setIsUserMenuOpen(false);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={() => {
                        setIsMenuOpen(false);
                        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                    }}
                >
                    <img src="/logo.jpg" alt="Albercas y Agua" className="logo-image" />
                    <span>Albercas y Agua</span>
                </Link>

                <div className="navbar-toggle" onClick={toggleMenu}>
                    <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
                    <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
                    <span className={`bar ${isMenuOpen ? 'active' : ''}`}></span>
                </div>

                <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
                    <li className="navbar-item">
                        <Link
                            to="/"
                            className="navbar-link"
                            onClick={() => {
                                setIsMenuOpen(false);
                                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                            }}
                        >
                            Inicio
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/about" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Sobre Nosotros</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/services" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/products" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Productos</Link>
                    </li>
                    <li className="navbar-item">
                        <a
                            href="#contact"
                            className="navbar-link"
                            onClick={(e) => handleSmoothScroll(e, 'contact')}
                        >
                            Contacto
                        </a>
                    </li>
                    <li className="navbar-item">
                        <Link to="/policies" className="navbar-link" onClick={() => setIsMenuOpen(false)}>Políticas</Link>
                    </li>

                    {/* Cart Icon */}
                    <li className="navbar-item navbar-cart">
                        <Link to="/cart" className="navbar-link cart-link" onClick={() => setIsMenuOpen(false)}>
                            🛒
                            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                        </Link>
                    </li>

                    {/* User Menu */}
                    {user ? (
                        <li className="navbar-item navbar-user">
                            <button
                                className="navbar-link user-button"
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            >
                                👤 {userProfile?.name || 'Mi Cuenta'}
                            </button>
                            {isUserMenuOpen && (
                                <div className="user-dropdown">
                                    <Link to="/account" className="dropdown-item" onClick={() => { setIsUserMenuOpen(false); setIsMenuOpen(false); }}>
                                        Mi Cuenta
                                    </Link>
                                    <Link to="/orders" className="dropdown-item" onClick={() => { setIsUserMenuOpen(false); setIsMenuOpen(false); }}>
                                        Mis Pedidos
                                    </Link>
                                    {userProfile?.role === 'admin' && (
                                        <Link to="/admin" className="dropdown-item" onClick={() => { setIsUserMenuOpen(false); setIsMenuOpen(false); }}>
                                            Panel Admin
                                        </Link>
                                    )}
                                    <button className="dropdown-item logout-button" onClick={handleLogout}>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            )}
                        </li>
                    ) : (
                        <li className="navbar-item">
                            <Link to="/login" className="navbar-link login-button" onClick={() => setIsMenuOpen(false)}>
                                Iniciar Sesión
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
};

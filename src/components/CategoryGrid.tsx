import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './CategoryGrid.css';

const categories = [
    { id: 1, title: 'Bombas para alberca', icon: '💧', description: 'Residenciales y de velocidad variable.' },
    { id: 2, title: 'Filtros de arena', icon: '🌪️', description: 'PDG, HAX-S y fibra de vidrio.' },
    { id: 3, title: 'Calentamiento', icon: '☀️', description: 'Solar y bombas de calor.' },
    { id: 4, title: 'Iluminación', icon: '💡', description: 'AC y DC para tu alberca.' },
    { id: 5, title: 'Automatización', icon: '🎛️', description: 'Control inteligente de tu alberca.' },
    { id: 6, title: 'Limpieza', icon: '🧹', description: 'Equipo HAX y sanitización.' },
    { id: 7, title: 'Hidromasaje', icon: '💆', description: 'Jets, sopladores y más.' },
    { id: 8, title: 'Accesorios', icon: '🔧', description: 'Escaleras, válvulas y PVC.' },
];

export const CategoryGrid = () => {
    const navigate = useNavigate();
    const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
    const { ref: gridRef, isVisible: gridVisible } = useScrollReveal();
    const { ref: buttonRef, isVisible: buttonVisible } = useScrollReveal();

    return (
        <section className="categories-section" id="products">
            <div className="container">
                <h2
                    ref={titleRef}
                    className={`section-title scroll-reveal ${titleVisible ? 'visible' : ''}`}
                >
                    Nuestras Categorías
                </h2>
                <p
                    className={`section-subtitle scroll-reveal scroll-reveal-delay-1 ${titleVisible ? 'visible' : ''}`}
                >
                    Los productos más populares para el cuidado y mantenimiento de tu alberca
                </p>

                <div
                    ref={gridRef}
                    className="category-grid"
                >
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`category-card scroll-reveal scroll-reveal-delay-${Math.min(index % 4 + 1, 5)} ${gridVisible ? 'visible' : ''}`}
                        >
                            <div className="category-icon">{category.icon}</div>
                            <h3 className="category-title">{category.title}</h3>
                            <p className="category-description">{category.description}</p>
                        </div>
                    ))}
                </div>

                {/* Ver todas button */}
                <div
                    ref={buttonRef}
                    className={`view-all-container scroll-reveal ${buttonVisible ? 'visible' : ''}`}
                >
                    <button
                        className="view-all-button"
                        onClick={() => navigate('/products')}
                    >
                        Ver todas las categorías →
                    </button>
                </div>
            </div>
        </section>
    );
};

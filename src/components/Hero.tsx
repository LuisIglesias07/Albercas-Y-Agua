import './Hero.css';
import { useNavigate } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const Hero = () => {
    const navigate = useNavigate();
    const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
    const { ref: subtitleRef, isVisible: subtitleVisible } = useScrollReveal();
    const { ref: buttonsRef, isVisible: buttonsVisible } = useScrollReveal();

    return (
        <section className="hero">
            <div className="hero-overlay"></div>
            <div className="container hero-content">
                <h1
                    ref={titleRef}
                    className={`hero-title scroll-reveal ${titleVisible ? 'visible' : ''}`}
                >
                    Soluciones Integrales para tu Alberca y Agua
                </h1>
                <p
                    ref={subtitleRef}
                    className={`hero-subtitle scroll-reveal scroll-reveal-delay-1 ${subtitleVisible ? 'visible' : ''}`}
                >
                    Expertos en construcción, equipamiento y mantenimiento de albercas.
                    Calidad y servicio garantizado.
                </p>
                <div
                    ref={buttonsRef}
                    className={`hero-buttons scroll-reveal scroll-reveal-delay-2 ${buttonsVisible ? 'visible' : ''}`}
                >
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/products')}
                    >
                        Ver Productos
                    </button>
                    <button
                        className="btn btn-outline"
                        onClick={() => {
                            const element = document.getElementById('contact');
                            if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                    >
                        Contáctanos
                    </button>
                </div>
            </div>
        </section>
    );
};

import { useScrollReveal } from '../hooks/useScrollReveal';
import './About.css';

export const About = () => {
    const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
    const { ref: missionRef, isVisible: missionVisible } = useScrollReveal();
    const { ref: visionRef, isVisible: visionVisible } = useScrollReveal();

    return (
        <section className="about-section">
            <div className="container">
                <h1
                    ref={titleRef}
                    className={`about-title scroll-reveal ${titleVisible ? 'visible' : ''}`}
                >
                    Sobre Nosotros
                </h1>

                <div className="about-content">
                    <div
                        ref={missionRef}
                        className={`about-card mission scroll-reveal-left ${missionVisible ? 'visible' : ''}`}
                    >
                        <div className="about-icon">🌊</div>
                        <h2 className="about-subtitle">Misión</h2>
                        <p className="about-text">
                            Brindar soluciones de tratamiento de agua para uso en general, con los más altos estándares de calidad, tecnología y eficiencia, garantizando pureza, seguridad y una experiencia excepcional para nuestros clientes. Nuestro compromiso es mantener el equilibrio perfecto entre el cuidado técnico y la excelencia en el servicio.
                        </p>
                    </div>

                    <div
                        ref={visionRef}
                        className={`about-card vision scroll-reveal-right ${visionVisible ? 'visible' : ''}`}
                    >
                        <div className="about-icon">🌟</div>
                        <h2 className="about-subtitle">Visión</h2>
                        <p className="about-text">
                            Ser la empresa líder en tratamiento de agua a nivel regional, reconocida por nuestra innovación, profesionalismo y atención personalizada, elevando constantemente los estándares de calidad en el sector y transformando cada uso del agua, en un símbolo de bienestar y distinción.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

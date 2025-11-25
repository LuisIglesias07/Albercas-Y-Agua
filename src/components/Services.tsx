import { useScrollReveal } from '../hooks/useScrollReveal';
import './Services.css';

export const Services = () => {
    const { ref: titleRef, isVisible: titleVisible } = useScrollReveal();
    const { ref: gridRef, isVisible: gridVisible } = useScrollReveal();
    const { ref: quoteRef, isVisible: quoteVisible } = useScrollReveal();

    const services = [
        {
            icon: '🏊',
            title: 'Construcción de Albercas',
            description: 'Diseño y construcción de albercas a medida, adaptadas a tus necesidades y espacio disponible. Utilizamos materiales de primera calidad y tecnología de punta.'
        },
        {
            icon: '🔧',
            title: 'Mantenimiento Preventivo',
            description: 'Servicio regular de mantenimiento para mantener tu alberca en perfecto estado. Incluye limpieza, balanceo químico y revisión de equipos.'
        },
        {
            icon: '⚙️',
            title: 'Reparación de Equipos',
            description: 'Diagnóstico y reparación de bombas, filtros, calentadores y sistemas de automatización. Servicio técnico especializado.'
        },
        {
            icon: '🧪',
            title: 'Tratamiento de Agua',
            description: 'Análisis químico del agua y aplicación de tratamientos para garantizar agua cristalina y saludable en todo momento.'
        },
        {
            icon: '🎨',
            title: 'Renovación y Remodelación',
            description: 'Actualización de albercas existentes con nuevos acabados, iluminación LED y sistemas modernos de circulación.'
        },
        {
            icon: '📞',
            title: 'Asesoría Técnica',
            description: 'Consultoría profesional para la selección de equipos, productos químicos y optimización de sistemas existentes.'
        }
    ];

    return (
        <section className="services-section">
            <div className="container">
                <h1
                    ref={titleRef}
                    className={`services-title scroll-reveal ${titleVisible ? 'visible' : ''}`}
                >
                    Nuestros Servicios
                </h1>
                <p className={`services-intro scroll-reveal scroll-reveal-delay-1 ${titleVisible ? 'visible' : ''}`}>
                    En Albercas y Agua ofrecemos servicios profesionales integrales para el cuidado,
                    mantenimiento y construcción de albercas.
                </p>

                <div ref={gridRef} className="services-grid">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`service-card scroll-reveal scroll-reveal-delay-${Math.min(index % 3 + 1, 5)} ${gridVisible ? 'visible' : ''}`}
                        >
                            <div className="service-icon">{service.icon}</div>
                            <h3 className="service-title">{service.title}</h3>
                            <p className="service-description">{service.description}</p>
                        </div>
                    ))}
                </div>

                {/* Custom Quote Section */}
                <div
                    ref={quoteRef}
                    className={`custom-quote-section scroll-reveal-scale ${quoteVisible ? 'visible' : ''}`}
                >
                    <div className="quote-card">
                        <div className="quote-icon">💼</div>
                        <h3 className="quote-title">¿Necesitas un servicio personalizado?</h3>
                        <p className="quote-description">
                            Cada alberca es única y cada cliente tiene necesidades específicas.
                            ¡Cotiza tu servicio a medida con nuestros expertos!
                        </p>

                        <div className="quote-options">
                            <a
                                href="https://wa.me/523121165367?text=Hola,%20me%20gustaría%20cotizar%20un%20servicio%20personalizado"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="quote-button whatsapp-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                                </svg>
                                Cotizar por WhatsApp
                            </a>

                            <a
                                href="tel:+523121165367"
                                className="quote-button phone-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20 22.621l-3.521-6.795c-.008.004-1.974.97-2.064 1.011-2.24 1.086-6.799-7.82-4.609-8.994l2.083-1.026-3.493-6.817-2.106 1.039c-7.202 3.755 4.233 25.982 11.6 22.615.121-.055 2.102-1.029 2.11-1.033z" />
                                </svg>
                                Llamar ahora
                            </a>

                            <a
                                href="mailto:albercasvergaras@gmail.com?subject=Cotización de Servicio Personalizado"
                                className="quote-button email-button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                                </svg>
                                Enviar correo
                            </a>
                        </div>

                        <div className="quote-info">
                            <p>📞 <strong>+52 312 116 5367</strong></p>
                            <p>✉️ <strong>albercasvergaras@gmail.com</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

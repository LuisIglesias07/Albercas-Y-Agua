import { useNavigate } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
    const navigate = useNavigate();

    const handleLinkClick = (path: string) => {
        navigate(path);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer" id="contact">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3 className="footer-title">Albercas y Agua</h3>
                    <p className="footer-text">
                        Soluciones integrales para el tratamiento de agua y equipamiento de albercas.
                    </p>
                </div>

                <div className="footer-section">
                    <h4 className="footer-subtitle">Enlaces Rápidos</h4>
                    <ul className="footer-links">
                        <li><button onClick={() => handleLinkClick('/')} className="footer-link-btn">Inicio</button></li>
                        <li><button onClick={() => handleLinkClick('/about')} className="footer-link-btn">Sobre Nosotros</button></li>
                        <li><button onClick={() => handleLinkClick('/services')} className="footer-link-btn">Servicios</button></li>
                        <li><button onClick={() => handleLinkClick('/products')} className="footer-link-btn">Productos</button></li>
                        <li><button onClick={() => handleLinkClick('/policies')} className="footer-link-btn">Políticas</button></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-subtitle">Contacto</h4>
                    <ul className="footer-contact">
                        <li>
                            <a
                                href="https://www.google.com/maps/place/Albercas+Vergara/@19.2504634,-103.7207696,19z/data=!4m14!1m7!3m6!1s0x8425454b4ad10603:0x9eb8f13eb0d595f4!2sAlbercas+Vergara!8m2!3d19.2503165!4d-103.7203981!16s%2Fg%2F1v3dsfpf!3m5!1s0x8425454b4ad10603:0x9eb8f13eb0d595f4!8m2!3d19.2503165!4d-103.7203981!16s%2Fg%2F1v3dsfpf?hl=es-419&entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-link"
                            >
                                📍 Albercas Vergara - Ver en Google Maps
                            </a>
                        </li>
                        <li>
                            <a href="tel:+523121165367" className="contact-link">
                                📞 +52 312 116 5367
                            </a>
                        </li>
                        <li>
                            <a href="mailto:albercasvergaras@gmail.com" className="contact-link">
                                ✉️ albercasvergaras@gmail.com
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4 className="footer-subtitle">Síguenos</h4>
                    <div className="social-icons">
                        <a
                            href="https://www.facebook.com/albercasvergara.oficial"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon facebook-icon"
                            aria-label="Facebook"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                            </svg>
                        </a>
                        <a
                            href="https://web.whatsapp.com/send?phone=523121165367&text=Hola,%20me%20interesa%20conocer%20más%20sobre%20sus%20productos%20y%20servicios%20de%20albercas"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon whatsapp-icon"
                            aria-label="WhatsApp"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Albercas y Agua. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

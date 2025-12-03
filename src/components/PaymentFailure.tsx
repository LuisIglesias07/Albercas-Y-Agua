import { useNavigate } from 'react-router-dom';
import './PaymentFailure.css';

export const PaymentFailure = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-page failure-page">
            <div className="container">
                <div className="payment-card">
                    <div className="failure-icon">✕</div>
                    <h1>Pago Rechazado</h1>
                    <p className="failure-message">
                        No pudimos procesar tu pago
                    </p>

                    <div className="failure-reasons">
                        <h3>Posibles causas:</h3>
                        <ul>
                            <li>Fondos insuficientes</li>
                            <li>Datos de tarjeta incorrectos</li>
                            <li>Límite de compra excedido</li>
                            <li>Transacción rechazada por el banco</li>
                        </ul>
                    </div>

                    <div className="action-buttons">
                        <button
                            onClick={() => navigate('/cart')}
                            className="primary-button"
                        >
                            Intentar de nuevo
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="secondary-button"
                        >
                            Volver a la tienda
                        </button>
                    </div>

                    <p className="help-text">
                        Si el problema persiste, contacta con tu banco o
                        <a href="/contact"> contáctanos</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

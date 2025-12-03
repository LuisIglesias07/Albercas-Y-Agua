import { useNavigate } from 'react-router-dom';
import './PaymentPending.css';

export const PaymentPending = () => {
    const navigate = useNavigate();

    return (
        <div className="payment-page pending-page">
            <div className="container">
                <div className="payment-card">
                    <div className="pending-icon">⏳</div>
                    <h1>Pago Pendiente</h1>
                    <p className="pending-message">
                        Tu pago está siendo procesado
                    </p>

                    <div className="pending-info">
                        <h3>¿Qué significa esto?</h3>
                        <p>
                            Tu pago está en proceso de validación. Esto puede ocurrir cuando:
                        </p>
                        <ul>
                            <li>El pago se realizó mediante transferencia bancaria</li>
                            <li>El banco está verificando la transacción</li>
                            <li>Se requiere autenticación adicional</li>
                        </ul>
                        <p className="timeline">
                            <strong>Tiempo estimado:</strong> 24-48 horas
                        </p>
                    </div>

                    <div className="next-steps">
                        <h3>📧 Te mantendremos informado:</h3>
                        <ul>
                            <li>Recibirás un email cuando se confirme el pago</li>
                            <li>Puedes revisar el estado en "Mis Pedidos"</li>
                            <li>Tu pedido se procesará una vez confirmado</li>
                        </ul>
                    </div>

                    <div className="action-buttons">
                        <button
                            onClick={() => navigate('/orders')}
                            className="primary-button"
                        >
                            Ver mis pedidos
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="secondary-button"
                        >
                            Seguir comprando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface CreatePreferenceRequest {
    orderData: {
        userId?: string;
        userEmail: string;
        items: Array<{
            productId: string;
            productName: string;
            productImage?: string;
            category: string;
            quantity: number;
            price: number;
            subtotal: number;
        }>;
        shippingAddress: {
            fullName: string;
            email: string;
            phone: string;
            street: string;
            city: string;
            state: string;
            zipCode: string;
            country: string;
        };
        shippingMethod: 'local' | 'fedex' | 'dhl';
        shippingCost: number;
        subtotal: number;
        total: number;
    };
}

export interface CreatePreferenceResponse {
    success: boolean;
    orderId: string;
    preferenceId: string;
    initPoint: string;
    sandboxInitPoint?: string;
}

/**
 * Create a Mercado Pago payment preference
 */
export const createPaymentPreference = async (
    request: CreatePreferenceRequest
): Promise<CreatePreferenceResponse> => {
    try {
        const response = await fetch(`${API_URL}/api/payment/create-preference`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error creating payment preference');
        }

        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error('Payment service error:', error);
        throw new Error(error.message || 'Error connecting to payment service');
    }
};

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
    productId: string;
    productName: string;
    productImage?: string;
    category: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface ShippingAddress {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    userId?: string; // Optional for guest checkout
    userEmail: string;
    items: OrderItem[];
    shippingAddress: ShippingAddress;
    shippingMethod: 'local' | 'fedex' | 'dhl';
    shippingCost: number;
    subtotal: number;
    total: number;
    status: OrderStatus;
    paymentMethod: 'mercadopago';
    paymentStatus: 'pending' | 'paid' | 'failed';
    paymentId?: string;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    statusHistory: Array<{
        status: OrderStatus;
        timestamp: Date;
        note?: string;
    }>;
}

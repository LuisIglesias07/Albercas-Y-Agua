export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price?: number;
    price_min?: number;
    price_max?: number;
    image?: string;
    available?: boolean;
    stock?: number;
    requiereCotizacion?: boolean;  // Para productos grandes que necesitan cotización de envío
    createdAt?: Date;
    updatedAt?: Date;
}

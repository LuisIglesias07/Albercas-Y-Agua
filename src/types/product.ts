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
    createdAt?: Date;
    updatedAt?: Date;
}

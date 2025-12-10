import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price?: number;
    price_min?: number;
    price_max?: number;
    image?: string;
    requiereCotizacion?: boolean;
}

// Obtener todos los productos
export const getAllProducts = async (): Promise<Product[]> => {
    try {
        const productsCollection = collection(db, 'productos');
        const snapshot = await getDocs(productsCollection);

        return snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Product))
            .filter(product => !(product as any).deleted); // Filtrar productos eliminados
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
};

// Obtener productos por categoría
export const getProductsByCategory = async (categoryName: string): Promise<Product[]> => {
    try {
        const productsCollection = collection(db, 'productos');
        const q = query(productsCollection, where('category', '==', categoryName));
        const snapshot = await getDocs(q);

        return snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Product))
            .filter(product => !(product as any).deleted); // Filtrar productos eliminados
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return [];
    }
};

// Obtener todas las categorías únicas
export const getAllCategories = async (): Promise<string[]> => {
    try {
        const products = await getAllProducts();
        const categories = [...new Set(products.map(p => p.category))];
        return categories.sort();
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
};

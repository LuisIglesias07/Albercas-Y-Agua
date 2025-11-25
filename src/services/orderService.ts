import { collection, addDoc, updateDoc, doc, getDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import type { Order, OrderStatus } from '../types/order';

const ORDERS_COLLECTION = 'orders';

// Generate unique order number
const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Create new order
export const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<string> => {
    try {
        const orderNumber = generateOrderNumber();
        const now = new Date();

        const newOrder = {
            ...orderData,
            orderNumber,
            status: 'pending' as OrderStatus,
            paymentStatus: 'pending' as const,
            createdAt: Timestamp.fromDate(now),
            updatedAt: Timestamp.fromDate(now),
            statusHistory: [{
                status: 'pending' as OrderStatus,
                timestamp: Timestamp.fromDate(now),
                note: 'Order created'
            }]
        };

        const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
        return docRef.id;
    } catch (error: any) {
        throw new Error(`Error creating order: ${error.message}`);
    }
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
        const docRef = doc(db, ORDERS_COLLECTION, orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                statusHistory: data.statusHistory?.map((h: any) => ({
                    ...h,
                    timestamp: h.timestamp?.toDate() || new Date()
                })) || []
            } as Order;
        }
        return null;
    } catch (error: any) {
        throw new Error(`Error fetching order: ${error.message}`);
    }
};

// Get all orders (admin)
export const getAllOrders = async (): Promise<Order[]> => {
    try {
        const q = query(collection(db, ORDERS_COLLECTION), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                statusHistory: data.statusHistory?.map((h: any) => ({
                    ...h,
                    timestamp: h.timestamp?.toDate() || new Date()
                })) || []
            } as Order;
        });
    } catch (error: any) {
        throw new Error(`Error fetching orders: ${error.message}`);
    }
};

// Get orders by user email
export const getOrdersByEmail = async (email: string): Promise<Order[]> => {
    try {
        const q = query(
            collection(db, ORDERS_COLLECTION),
            where('userEmail', '==', email),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
                statusHistory: data.statusHistory?.map((h: any) => ({
                    ...h,
                    timestamp: h.timestamp?.toDate() || new Date()
                })) || []
            } as Order;
        });
    } catch (error: any) {
        throw new Error(`Error fetching user orders: ${error.message}`);
    }
};

// Update order status
export const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string): Promise<void> => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        const orderSnap = await getDoc(orderRef);

        if (!orderSnap.exists()) {
            throw new Error('Order not found');
        }

        const currentOrder = orderSnap.data();
        const now = new Date();

        const newHistoryEntry = {
            status: newStatus,
            timestamp: Timestamp.fromDate(now),
            ...(note && { note })
        };

        await updateDoc(orderRef, {
            status: newStatus,
            updatedAt: Timestamp.fromDate(now),
            statusHistory: [...(currentOrder.statusHistory || []), newHistoryEntry]
        });
    } catch (error: any) {
        throw new Error(`Error updating order status: ${error.message}`);
    }
};

// Update payment status
export const updatePaymentStatus = async (orderId: string, paymentStatus: 'pending' | 'paid' | 'failed', paymentId?: string): Promise<void> => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);

        await updateDoc(orderRef, {
            paymentStatus,
            ...(paymentId && { paymentId }),
            updatedAt: Timestamp.fromDate(new Date())
        });
    } catch (error: any) {
        throw new Error(`Error updating payment status: ${error.message}`);
    }
};

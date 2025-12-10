import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase';
import { registerUser } from './authService';
import type { Product } from './productService';

const ADMIN_EMAIL = 'albercasvergaras@gmail.com';
const ADMIN_PASSWORD = 'Hsantana22';

// Create admin user if doesn't exist
export const ensureAdminExists = async () => {
    try {
        // Try to create admin user
        await registerUser(ADMIN_EMAIL, ADMIN_PASSWORD, 'Administrador');

        // Update role to admin
        const adminDocRef = doc(db, 'users', ADMIN_EMAIL.replace('@', '_').replace('.', '_'));
        await updateDoc(adminDocRef, {
            role: 'admin',
            name: 'Administrador'
        });

        console.log('Admin user created successfully');
    } catch (error: any) {
        // User might already exist, which is fine
        console.log('Admin user might already exist:', error.message);
    }
};

// Upload product image to Firebase Storage
export const uploadProductImage = async (file: File, productId: string): Promise<string> => {
    try {
        const storageRef = ref(storage, `products/${productId}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    } catch (error: any) {
        throw new Error(`Error uploading image: ${error.message}`);
    }
};

// Delete product image from Firebase Storage
export const deleteProductImage = async (imageUrl: string): Promise<void> => {
    try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
    } catch (error: any) {
        console.error('Error deleting image:', error.message);
    }
};

// Create new product
export const createProduct = async (productData: Partial<Product>): Promise<string> => {
    try {
        const productRef = doc(db, 'productos', productData.name || `product_${Date.now()}`);
        await setDoc(productRef, {
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return productRef.id;
    } catch (error: any) {
        throw new Error(`Error creating product: ${error.message}`);
    }
};

// Update product
export const updateProduct = async (productId: string, productData: Partial<Product>): Promise<void> => {
    try {
        const productRef = doc(db, 'productos', productId);
        await updateDoc(productRef, {
            ...productData,
            updatedAt: new Date()
        });
    } catch (error: any) {
        throw new Error(`Error updating product: ${error.message}`);
    }
};

// Delete product
export const deleteProduct = async (productId: string, imageUrl?: string): Promise<void> => {
    try {
        console.log('🔴 [deleteProduct] Starting deletion for:', productId);

        // Delete image if exists
        if (imageUrl) {
            try {
                console.log('🔴 [deleteProduct] Attempting to delete image:', imageUrl);
                await deleteProductImage(imageUrl);
                console.log('✅ [deleteProduct] Image deleted successfully');
            } catch (imgError) {
                console.warn('⚠️ [deleteProduct] Could not delete image:', imgError);
            }
        }

        // Mark product as deleted in Firestore
        console.log('🔴 [deleteProduct] Attempting to update Firestore document...');
        const productRef = doc(db, 'productos', productId);

        const updateData = {
            deleted: true,
            updatedAt: new Date()
        };

        console.log('🔴 [deleteProduct] Update data:', updateData);

        await updateDoc(productRef, updateData);

        console.log('✅ [deleteProduct] Firestore document updated successfully');
    } catch (error: any) {
        console.error('❌ [deleteProduct] Error occurred:', error);
        console.error('❌ [deleteProduct] Error code:', error.code);
        console.error('❌ [deleteProduct] Error message:', error.message);
        console.error('❌ [deleteProduct] Full error:', JSON.stringify(error, null, 2));

        if (error.code === 'permission-denied') {
            throw new Error('No tienes permisos para eliminar productos. Verifica que tu usuario tenga rol de admin.');
        }

        throw new Error(`Error deleting product: ${error.message}`);
    }
};

// Toggle product availability (freeze/unfreeze)
export const toggleProductAvailability = async (productId: string, available: boolean): Promise<void> => {
    try {
        const productRef = doc(db, 'productos', productId);
        await updateDoc(productRef, {
            available,
            updatedAt: new Date()
        });
    } catch (error: any) {
        throw new Error(`Error updating product availability: ${error.message}`);
    }
};

// Delete entire category with all its products
export const deleteCategoryWithProducts = async (categoryName: string): Promise<number> => {
    try {
        const { collection, getDocs, query, where, writeBatch } = await import('firebase/firestore');

        // Get all products in this category
        const productsRef = collection(db, 'productos');
        const q = query(productsRef, where('category', '==', categoryName));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            return 0;
        }

        // Use batch to delete all products at once
        const batch = writeBatch(db);

        snapshot.docs.forEach((doc) => {
            batch.update(doc.ref, {
                deleted: true,
                updatedAt: new Date()
            });
        });

        await batch.commit();

        return snapshot.size;
    } catch (error: any) {
        throw new Error(`Error deleting category: ${error.message}`);
    }
};

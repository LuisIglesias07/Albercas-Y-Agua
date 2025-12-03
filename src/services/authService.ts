import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    updateProfile,
    type User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export interface UserProfile {
    uid: string;
    email: string;
    name: string;
    role: 'admin' | 'customer';
    createdAt: Date;
    phone?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
    };
}

// Get admin email from environment variable (more secure than hardcoding)
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || '';

if (!ADMIN_EMAIL) {
    console.warn('⚠️ VITE_ADMIN_EMAIL no está configurado en las variables de entorno');
}

// Register new user
export const registerUser = async (
    email: string,
    password: string,
    name: string
): Promise<UserProfile> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Determine role and name
        const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const role = isAdminEmail ? 'admin' : 'customer';
        const displayName = isAdminEmail ? 'Administrador' : name;

        // Update display name
        await updateProfile(user, { displayName });

        // Create user profile in Firestore
        const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email!,
            name: displayName,
            role,
            createdAt: new Date()
        };

        await setDoc(doc(db, 'users', user.uid), userProfile);

        return userProfile;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<User> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if profile exists in Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            // Create profile for existing Firebase Auth user
            const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
            const role = isAdminEmail ? 'admin' : 'customer';
            const displayName = isAdminEmail ? 'Administrador' : (user.displayName || email.split('@')[0]);

            const userProfile: UserProfile = {
                uid: user.uid,
                email: user.email!,
                name: displayName,
                role,
                createdAt: new Date()
            };

            await setDoc(docRef, userProfile);
        } else {
            // Update role if it's admin email
            const profile = docSnap.data() as UserProfile;
            const isAdminEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

            if (isAdminEmail && profile.role !== 'admin') {
                await setDoc(docRef, {
                    ...profile,
                    role: 'admin',
                    name: 'Administrador'
                }, { merge: true });
            }
        }

        return user;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserProfile;
        }
        return null;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Check if user is admin
export const isAdmin = async (uid: string): Promise<boolean> => {
    const profile = await getUserProfile(uid);
    return profile?.role === 'admin';
};

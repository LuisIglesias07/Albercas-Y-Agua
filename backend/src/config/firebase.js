import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let firebaseApp;

try {
    // Option 1: Load from service account file
    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        const serviceAccount = JSON.parse(
            readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf8')
        );
        
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } 
    // Option 2: Load from environment variables
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            })
        });
    } 
    else {
        throw new Error('Firebase credentials not configured. Please set FIREBASE_SERVICE_ACCOUNT_PATH or individual Firebase env variables.');
    }

    console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    process.exit(1);
}

export const db = admin.firestore();
export default firebaseApp;

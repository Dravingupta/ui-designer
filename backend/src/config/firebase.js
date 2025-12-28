// src/config/firebase.js
import admin from 'firebase-admin';

export const initializeFirebase = () => {
    try {
        if (admin.apps.length) {
            console.log('Firebase Admin already initialized');
            return;
        }

        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            console.log('Checking Firebase environment variables...');

            const projectId = process.env.FIREBASE_PROJECT_ID;
            const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
            const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

            if (!projectId?.trim()) throw new Error('FIREBASE_PROJECT_ID missing');
            if (!clientEmail?.trim()) throw new Error('FIREBASE_CLIENT_EMAIL missing');
            if (!privateKey?.trim()) throw new Error('FIREBASE_PRIVATE_KEY missing');

            admin.initializeApp({
                credential: admin.credential.cert({
                    project_id: projectId,
                    private_key: privateKey,
                    client_email: clientEmail,
                })
            });
        }

        console.log('Firebase Admin initialized successfully');
    } catch (error) {
        console.error('Firebase Admin initialization error:', error.message);
    }
};

export default admin;

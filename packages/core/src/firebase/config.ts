import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

// TODO: Replace these with your actual Firebase Console keys
// or use Environment Variables (Recommended)
const firebaseConfig = {
    apiKey: "AIzaSyBRhG5tNE2CRUHUfvTDI9odIC7dKvf4DW0",
    authDomain: "typingpro-da12c.firebaseapp.com",
    projectId: "typingpro-da12c",
    storageBucket: "typingpro-da12c.firebasestorage.app",
    messagingSenderId: "296757654836",
    appId: "1:296757654836:web:40d7225d708041276aa161",
    measurementId: "G-FG0JGMHBQ2"
};

let app;
let auth: any;
let db: any;
let rtdb: any;
let analytics: any;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    rtdb = getDatabase(app);
    // Only initialize analytics in browser environment
    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
    }
} catch (e) {
    console.error("Firebase Init Error:", e);
    // Dummy objects to prevent null errors elsewhere
    auth = { onAuthStateChanged: () => () => { } } as any;
    db = {} as any;
    rtdb = {} as any;
}

export { app, auth, db, rtdb, analytics };

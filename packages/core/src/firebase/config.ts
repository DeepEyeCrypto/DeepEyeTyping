import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace these with your actual Firebase Console keys
// or use Environment Variables (Recommended)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "deepeyedemo.firebaseapp.com",
    projectId: "deepeyedemo",
    storageBucket: "deepeyedemo.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

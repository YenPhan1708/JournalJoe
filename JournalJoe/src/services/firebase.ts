import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration
 * Safe to expose in client apps (Firebase design)
 */
const firebaseConfig = {
    apiKey: "AIzaSyDHMIeb1DHT-AFOArLzWjXT5PTRbykXcrA",
    authDomain: "journaljoe.firebaseapp.com",
    projectId: "journaljoe",
    storageBucket: "journaljoe.firebasestorage.app",
    messagingSenderId: "699449487892",
    appId: "1:699449487892:web:1fb3b62332ae24da53ad01",
};

/**
 * Initialize Firebase
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase services (MOBILE SAFE)
 */
export const auth = getAuth(app);
export const db = getFirestore(app);

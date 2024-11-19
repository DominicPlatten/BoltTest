import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBsWf5hMx1BdIwexPPhSfDEwwZtcxzdq_Y",
  authDomain: "dtools-94b65.firebaseapp.com",
  projectId: "dtools-94b65",
  storageBucket: "dtools-94b65.firebasestorage.app",
  messagingSenderId: "6565886776",
  appId: "1:6565886776:web:ce62c3b7cdd84620cadfcd",
  measurementId: "G-2DRFE9T79X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

// Configure persistence properly
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Auth persistence error:", error);
});
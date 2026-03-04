import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// In dev, MUST use current host to avoid Chrome's "local address space" CORS block (firebaseapp.com iframe fails)
const authDomain = import.meta.env.DEV
  ? (typeof window !== "undefined" ? window.location.host : "localhost:5173")
  : (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "flashcards-app-7a630.firebaseapp.com");

const firebaseConfig = {
  apiKey: "AIzaSyAg8ijm7LY6m6rMzVQxVeAoTt_SynL8d88",
  authDomain,
  projectId: "flashcards-app-7a630",
  storageBucket: "flashcards-app-7a630.firebasestorage.app",
  messagingSenderId: "473899202329",
  appId: "1:473899202329:web:7ba76dd70473dbb757b788",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);

export { db };

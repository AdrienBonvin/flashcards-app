import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Use current host so auth iframe loads from same origin - avoids Chrome's "local address space" CORS block
// (Firebase iframe from firebaseapp.com fails in Chrome when parent is on web.app)
const authDomain =
  typeof window !== "undefined"
    ? window.location.host
    : import.meta.env.DEV
      ? "localhost:5173"
      : "flashcards-app-7a630.firebaseapp.com";

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

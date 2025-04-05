import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAg8ijm7LY6m6rMzVQxVeAoTt_SynL8d88",
    authDomain: "flashcards-app-7a630.firebaseapp.com",
    projectId: "flashcards-app-7a630",
    storageBucket: "flashcards-app-7a630.firebasestorage.app",
    messagingSenderId: "473899202329",
    appId: "1:473899202329:web:7ba76dd70473dbb757b788"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
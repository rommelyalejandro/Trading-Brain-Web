import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0CPu41CFqeIl65f7HPgjZ3kIV7wG3OLM",
  authDomain: "trading-brain-core-3410.firebaseapp.com",
  projectId: "trading-brain-core-3410",
  storageBucket: "trading-brain-core-3410.firebasestorage.app",
  messagingSenderId: "975080504169",
  appId: "1:975080504169:web:d88140e113ac09e5759bf8",
  measurementId: "G-47DJ7TFL15"
};

// Evita inicializar múltiples veces en Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Forzamos que siempre pregunte por la cuenta de Google para poder cambiar de usuario fácilmente
provider.setCustomParameters({
  prompt: 'select_account'
});

export { app, auth, provider, db };

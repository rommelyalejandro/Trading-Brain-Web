import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKrCNUoBOPAE0r6Y1p0aV4_3OGNrAUaPg",
  authDomain: "trading-brain-ai-app.firebaseapp.com",
  projectId: "trading-brain-ai-app",
  storageBucket: "trading-brain-ai-app.firebasestorage.app",
  messagingSenderId: "589942754758",
  appId: "1:589942754758:web:227f533e2b9d5154a4f6c7",
  measurementId: "G-CSRM8P856Y"
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

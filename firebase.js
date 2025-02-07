import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configurações do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Função para login com Google
const signInWithGoogle = async () => {
  try {
    console.log("Iniciando login com Google...");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Usuário autenticado:", user);
    return user;
  } catch (error) {
    console.error("Erro ao fazer login com o Google:", error);
    throw error; // Repassa o erro para ser tratado pelo chamador
  }
};

// Função para verificar o estado de autenticação
const checkAuthStatus = (callback) => {
  onAuthStateChanged(auth, (user) => {
    console.log("Estado de autenticação alterado:", user);
    callback(user);
  });
};

// Função para logout
const signOutUser = () => {
  return signOut(auth);
};

export { auth, db, signInWithGoogle, checkAuthStatus, signOutUser };
auth.useDeviceLanguage();
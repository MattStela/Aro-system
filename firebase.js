import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from "firebase/auth";
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
    console.log("Redirecionando para o login do Google...");
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error("Erro ao fazer login com o Google:", error);
    throw error; // Repassa o erro para ser tratado pelo chamador
  }
};

// Função para lidar com o resultado do redirecionamento
const handleRedirectResult = async () => {
  try {
    console.log("Verificando resultado do redirecionamento...");
    const result = await getRedirectResult(auth);
    console.log("Redirect result:", result);
    if (result) {
      // Obtém o token de acesso do Google
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // Informações do usuário autenticado
      const user = result.user;
      console.log("Usuário do resultado do redirecionamento:", user);
      console.log("Usuário autenticado com sucesso.");
      return user;
    }
    console.log("Nenhum resultado de redirecionamento encontrado.");
    return null;
  } catch (error) {
    // Lida com erros aqui
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData?.email;
    const credential = GoogleAuthProvider.credentialFromError(error);
    console.error("Erro ao obter resultado do redirecionamento:", errorCode, errorMessage, email, credential);
    return null;
  }
};

// Função para verificar o estado de autenticação
const checkAuthStatus = (callback) => {
  // Verificar o usuário atual diretamente
  const currentUser = auth.currentUser;
  console.log("Usuário atual:", currentUser);

  if (currentUser) {
    callback(currentUser);
  } else {
    // Adicionar observador para mudanças de estado de autenticação
    onAuthStateChanged(auth, async (user) => {
      console.log("Estado de autenticação alterado:", user);
      if (user) {
        const redirectUser = await handleRedirectResult();
        callback(redirectUser || user);
      } else {
        callback(null);
      }
    });
  }
};

// Função para logout
const signOutUser = () => {
  return signOut(auth);
};

export { auth, db, signInWithGoogle, handleRedirectResult, checkAuthStatus, signOutUser };
auth.useDeviceLanguage();
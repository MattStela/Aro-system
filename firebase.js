import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, getRedirectResult, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.warn("Popup closed by user");
    } else {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  }
};

const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    console.log("Redirect result:", result);
    return result ? result.user : null;
  } catch (error) {
    console.error("Error getting redirect result:", error);
    return null;
  }
};

const signOutUser = () => {
  return signOut(auth);
};

export { auth, db, signInWithGoogle, handleRedirectResult, signOutUser };

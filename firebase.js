import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, getRedirectResult, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBgFQmitziMBmLCkh_PJ2dn9YuwsjfYA0",
  authDomain: "aro-system2.firebaseapp.com",
  projectId: "aro-system2",
  storageBucket: "aro-system2.firebasestorage.app",
  messagingSenderId: "808130384321",
  appId: "1:808130384321:web:8bb146a953fd8899571f40",
  measurementId: "G-8NJYHH2T2Y"
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

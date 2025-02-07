"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithGoogle, checkAuthStatus } from "../../firebase";
import { useRouter } from "next/navigation";
import PinLogin from "../components/PinLogin";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Image from "next/image";

export default function Home() {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();
  const [loginError, setLoginError] = useState(null);
  const [isCheckingRedirect, setIsCheckingRedirect] = useState(true);

  useEffect(() => {
    checkAuthStatus((user) => {
      if (user) {
        console.log("User already logged in:", user);
        router.push(
          `/dashboard?uid=${user.uid}&displayName=${user.displayName}`
        );
      } else {
        console.log("No user found.");
        setIsCheckingRedirect(false);
      }
    });
  }, [router]);

  const handleGoogleSignIn = async () => {
    console.log("handleGoogleSignIn called");
    try {
      const user = await signInWithGoogle();
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          displayName: user.displayName,
          GoogleUID: user.uid,
        },
        { merge: true }
      );
      console.log("User document set in Firestore");
      router.push(`/dashboard?uid=${user.uid}&displayName=${user.displayName}`);
    } catch (err) {
      console.error("Erro ao fazer login com o Google:", err);
      setLoginError(
        "Erro ao fazer login com o Google. Por favor, tente novamente."
      );
    }
  };

  if (loading || isCheckingRedirect) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="text-sm sm:text-base w-full flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gradient-to-r from-black to-gray-800 text-main-aro shadow-lg rounded-2xl p-8">
        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : (
          <div className="space-y-4 flex flex-col justify-center items-center text-center">
            teste<Image className="mb-4" src="/logo.png" width={100} height={100} alt="logo" />
            <div className="p-4 rounded-3xl bg-gradient-to-r from-black to-gray-700">
              <PinLogin /> {/* Incluindo o componente PinLogin */}
            </div>
            

            <div className="flex flex-row justify-center items-center">
              <div className="w-[42%] h-[0.1rem] rounded-full bg-gray-600"></div>
              <p className="text-center flex-grow">ou</p>
              <div className="w-[42%] h-[0.1rem] rounded-full bg-gray-600"></div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="h-[50px] hover:text-white text-black bg-white hover:bg-blue-600 font-semibold py-2 px-4 rounded-full flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 w-full"
            >
              <img
                src="/google.png"
                alt="Google icon"
                width={24}
                height={24}
                className="mr-2"
              />
              <span>Entrar com Google</span>
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-4">{error.message}</p>}
        {loginError && (
          <p className="text-red-500 text-sm mt-4">{loginError}</p>
        )}
      </div>
    </div>
  );
}

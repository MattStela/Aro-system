"use client";
import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function PhoneLogin() {
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();

    function onCaptchaVerify() {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              // reCAPTCHA solved - Allow user to proceed with phone number verification
            },
            "expired-callback": () => {
              // Response expired - Ask user to solve reCAPTCHA again
            },
          },
          auth
        );
      }
    }

    onCaptchaVerify();

    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  }, []);

  const handlePhoneLogin = async (e) => {
    e.preventDefault();

    try {
      // Juntar os valores de PIN
      const fullPhoneNumber = `+55${pin.join("")}`;

      // Buscar os dados do usuário no Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phone", "==", fullPhoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("PIN não encontrado.");
      } else {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          router.push({
            pathname: "/dashboard",
            query: {
              uid: userData.uid,
              displayName: userData.displayName,
              phone: fullPhoneNumber,
            },
          });
        });
      }
    } catch (err) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
          grecaptcha.reset(widgetId);
        });
      }
    }
  };

  const handlePinChange = (value, index) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
  };

  return (
    <form onSubmit={handlePhoneLogin} className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 space-x-0 sm:space-x-4 items-center justify-center">
        <div className="flex flex-row space-x-4 items-center justify-center">
          <div className="flex space-x-2">
            {pin.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handlePinChange(e.target.value, index)}
                className="shadow appearance-none border rounded h-[42px] w-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 text-center"
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
      >
        Entrar com PIN
      </button>
      <div id="recaptcha-container"></div>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </form>
  );
}

"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function PinLogin() {
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(null);
  const router = useRouter();
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isLocked) {
      const timer = setTimeout(() => {
        setIsLocked(false);
        setAttempts(0);
      }, 300000); // 5 minutos

      return () => clearTimeout(timer);
    }
  }, [isLocked]);

  const handlePinLogin = async (e) => {
    e.preventDefault();

    if (isLocked) {
      setError("Muitas tentativas. Por favor, aguarde 5 minutos.");
      return;
    }

    try {
      // Juntar os valores de PIN
      const fullPin = pin.join("");
      console.log("PIN digitado:", fullPin);

      // Buscar os dados do usuário no Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("pin", "==", fullPin));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setAttempts(attempts + 1);
        if (attempts + 1 >= 3) {
          setIsLocked(true);
          setLockTime(Date.now());
          setError("Muitas tentativas. Por favor, aguarde 5 minutos.");
        } else {
          setError("PIN incorreto. Tente novamente.");
        }
      } else {
        const userDoc = querySnapshot.docs[0];
        const data = userDoc.data();
        console.log("UID:", data.GoogleUID);
        console.log("Display Name:", data.displayName);
        console.log("Phone:", data.phone);
        console.log("PIN:", data.pin);
        router.push(`/dashboard?uid=${data.GoogleUID}&displayName=${data.displayName}`);
      }
    } catch (err) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  const handlePinChange = (value, index) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Move to the next input field
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  return (
    <div>
      <form onSubmit={handlePinLogin} className="flex flex-col space-y-4">
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
                  ref={(el) => (inputRefs.current[index] = el)}
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
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </form>
    </div>
  );
}

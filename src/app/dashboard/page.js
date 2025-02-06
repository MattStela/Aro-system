"use client";
import { useState, useEffect, Suspense } from "react";
import { signOutUser, db } from "../../../firebase";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { doc, setDoc, getDoc } from "firebase/firestore";

function DashboardContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const displayName = searchParams.get("displayName");
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [areaCode, setAreaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) {
        setIsLoading(false);
        return;
      }
      const userRef = doc(db, "users", uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
      }
      setIsLoading(false);
    };

    fetchUserData();
  }, [uid]);

  const handleSignOut = async () => {
    await signOutUser();
    router.push("/");
  };

  const handleGoHome = async () => {
    await signOutUser();
    router.push("/");
  };

  const handlePinChange = (value, index) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
  };

  const handleRegisterInfo = async () => {
    const userRef = doc(db, "users", uid);
    try {
      await setDoc(userRef, {
        phone: `+55${areaCode}${phoneNumber}`,
        pin: pin.join(""),
      }, { merge: true });
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
      }
      alert("Informações registradas com sucesso!");
    } catch (error) {
      console.error("Erro ao registrar as informações: ", error);
      alert("Erro ao registrar as informações. Verifique suas permissões no Firestore.");
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="text-sm sm:text-base w-full flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white relative">
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 bg-red-800 hover:bg-red-600 text-gray-200 hover:text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
      >
        Sair
      </button>
      <button
        onClick={handleGoHome}
        className="absolute top-4 left-4 bg-blue-800 hover:bg-blue-600 text-gray-200 hover:text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
      >
        Página Inicial
      </button>
      <div className="border border-4 border-gray-500 flex justify-center flex-col items-center py-4 px-6 w-5/6 rounded-full">
        <p className="text-xl sm:text-3xl font-bold mb-1">
          Bem-vindo, {displayName}!
        </p>
        <p className="text-[0.8rem] sm:text-sm text-gray-400">UID: {uid}</p>
        {userData && userData.pin && userData.phone ? (
          <div>
            <div className="flex flex-col justify-center items-center text-[0.8rem] sm:text-sm text-gray-400">
              <p>PIN: {userData.pin}</p>
              <p>Telefone: {userData.phone}</p>
            </div>
            {/* Adicione mais informações que você deseja mostrar */}
          </div>
        ) : (
          <div className="p-4 space-x-4 rounded-3xl flex flex-col space-y-4 items-center">
            {!userData || !userData.phone ? (
              <>
                <p className="text-gray-400">Adicione um número de telefone:</p>
                <div className="space-x-4 flex flex-row items-center">
                  <div className="flex flex-row space-x-4">
                    <div className="flex flex-col justify-center items-start">
                      <input
                        maxLength={2}
                        type="text"
                        value={areaCode}
                        onChange={(e) => setAreaCode(e.target.value)}
                        className="w-16 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                        placeholder="DDD"
                        name="DDD"
                      />
                    </div>
                  </div>
                  <div className="flex space-y-1 flex-col justify-center items-start">
                    <input
                      name="phone"
                      maxLength={9}
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                      placeholder="Número de Telefone"
                    />
                  </div>
                </div>
              </>
            ) : null}

            {!userData || !userData.pin ? (
              <>
                <p className="text-gray-400">Adicione um PIN à sua conta:</p>
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
              </>
            ) : null}

            <button
              onClick={handleRegisterInfo}
              className="p-2 rounded-full px-3 bg-gray-600 text-gray-300 hover:text-white hover:bg-gray-500 text-sm"
            >
              Confirmar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

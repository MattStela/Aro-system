"use client";
import { useState, useEffect } from "react";
import { signOutUser, db } from "../../../firebase"; // Ajuste o caminho aqui
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const displayName = searchParams.get("displayName");
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
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

  const handleUpdatePhone = async () => {
    const userRef = doc(db, "users", uid);

    try {
      await setDoc(
        userRef,
        {
          phone: newPhone,
          uid: uid,
          displayName: displayName,
          password: newPassword,
        },
        { merge: true }
      );
      setUserData({ ...userData, phone: newPhone, password: newPassword }); // Atualizar o estado com o novo telefone e senha
      alert("Telefone e senha atualizados com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o telefone: ", error);
      alert(
        "Erro ao atualizar o telefone e senha. Verifique suas permissões no Firestore."
      );
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className=" text-sm sm:text-base w-full flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white relative">
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 bg-red-800 hover:bg-red-600 text-gray-200 hover:text-white font-semibold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
      >
        Sair
      </button>
      <div className="border border-4 border-gray-500 flex justify-center flex-col items-center py-4 px-6 w-5/6 rounded-full">
        <p className="text-xl sm:text-3xl font-bold mb-1">Bem-vindo, {displayName}!</p>
        <p className="text-[0.8rem] sm:text-sm text-gray-400">UID: {uid}</p>
        {userData && userData.phone ? (
          <div>
            <p className="text-[0.8rem] sm:text-sm text-gray-400">Telefone: {userData.phone}</p>
          </div>
        ) : (
          <div className="p-4 space-y-4 rounded-3xl flex flex-col items-center">
            <div className="flex space-y-1 flex-col justify-center items-start">
              <p className="text-gray-400 ml-3 text-sm">Telefone(com DDD):</p>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                placeholder="Telefone"
              />
            </div>

            <div className="flex space-y-1 flex-col justify-center items-start">
              <p className="text-gray-400 ml-3 text-sm">Senha:</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                placeholder="Senha"
              />
            </div>

            <button
              onClick={handleUpdatePhone}
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

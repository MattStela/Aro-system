"use client";

import { useState, useEffect, Suspense } from "react";
import { signOutUser, db } from "../../../firebase";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import HeaderUser from "./HeaderUser";
import BdUsers from "./BdUsers";
import Events from "./Events";

function DashboardContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [areaCode, setAreaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState(new Array(6).fill(""));
  const [displayName, setDisplayName] = useState(
    searchParams.get("displayName")
  ); // Initialize with the displayName from search params
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [users, setUsers] = useState([]); // Estado para armazenar a lista de usuários
  const [events, setEvents] = useState([]); // Estado para armazenar a lista de eventos

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
        setDisplayName(data.displayName || displayName); // Update the displayName if it exists in user data
      }
      setIsLoading(false);
    };

    const fetchToken = () => {
      const jwtToken = localStorage.getItem("jwtToken");
      setToken(jwtToken);
      if (jwtToken) {
        console.log("Usuário autenticado: sim");
      } else {
        console.log("Usuário autenticado: não");
      }
    };

    const fetchUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    const fetchEvents = async () => {
      const eventsCollection = collection(db, "events");
      const eventsSnapshot = await getDocs(eventsCollection);
      const eventsList = eventsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEvents(eventsList);
    };

    fetchUserData();
    fetchToken();
    fetchUsers(); // Buscar a lista de usuários
    fetchEvents(); // Buscar a lista de eventos
  }, [uid]);

  const handleSignOut = async () => {
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
    const dataToUpdate = {
      phone: `+55${areaCode}${phoneNumber}`,
      pin: pin.join(""),
      displayName: displayName, // Salva o novo displayName
      role: userData?.role || "user", // Define a role como "user" se não estiver definida
    };

    try {
      console.log("Iniciando a requisição para updateUserData");
      console.log("Dados a serem enviados:", { uid, data: dataToUpdate });

      const response = await fetch("/api/updateUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uid, data: dataToUpdate }),
      });

      const result = await response.json();
      console.log("Resposta do servidor:", result);

      if (response.ok) {
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          setDisplayName(data.displayName); // Update the displayName in the state
        }

        alert("Informações registradas com sucesso!");
      } else {
        console.error("Erro ao registrar as informações:", result.message);
        alert(`Erro ao registrar as informações: ${result.message}`);
      }
    } catch (error) {
      console.error("Erro ao registrar as informações: ", error);
      alert(
        "Erro ao registrar as informações. Verifique suas permissões no Firestore."
      );
    }
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-4 text-sm sm:text-base w-full flex flex-col space-y-4 items-center justify-start min-h-screen bg-gray-800 text-white relative">
      {/* Cabeçalho do usuário ================================================================== */}
      <HeaderUser
        displayName={displayName}
        token={token}
        handleSignOut={handleSignOut}
        userData={userData}
        handleRegisterInfo={handleRegisterInfo}
        areaCode={areaCode}
        setAreaCode={setAreaCode}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        pin={pin}
        handlePinChange={handlePinChange}
        setDisplayName={setDisplayName}
      />

      <BdUsers userData={userData} users={users} />

      <Events
        displayName={displayName}
        userData={userData}
        events={events} // Passando a coleção "events"
      />
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

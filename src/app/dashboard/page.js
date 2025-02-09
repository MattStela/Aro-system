"use client";

import { useState, useEffect, Suspense } from "react";
import { signOutUser, db } from "../../../firebase";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import HeaderUser from "./HeaderUser";
import Users from "./Users";
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
  const [tokenLSM, setTokenLSM] = useState("");

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
        if (!data.role) {
          // Se não houver registro de role, defina como null
          await setDoc(userRef, { role: null }, { merge: true });
          data.role = null;
        }
        setUserData(data);
        setDisplayName(data.displayName || displayName); // Update the displayName if it exists in user data
      }
      setIsLoading(false);
    };

    const fetchToken = async () => {
      const jwtToken = localStorage.getItem("jwtToken");
      setToken(jwtToken);
      if (jwtToken) {
        console.log("Usuário autenticado: sim");
        const getTokenLSM = (token) => {
          const parts = token.split(".");
          const signature = parts.length === 3 ? parts[2] : "";
          const extractedPart = signature.substring(7, 15); // Extrai 8 caracteres a partir do oitavo
          return (
            extractedPart.substring(0, 4) + "-" + extractedPart.substring(4)
          ); // Adiciona um hífen após os primeiros quatro caracteres
        };
        const tokenLSMValue = getTokenLSM(jwtToken);
        setTokenLSM(tokenLSMValue);
        // Registrar o tokenLSM no banco de dados se o role for null ou não houver role
        const userRef = doc(db, "users", uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.role === null || !data.role) {
            if (!data.tokenLSM) {
              await setDoc(
                userRef,
                { tokenLSM: tokenLSMValue },
                { merge: true }
              );
            }
          }
        }
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

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (userData?.role === null) {
    return (
      <div className="p-4 text-sm sm:text-base w-full flex flex-col space-y-4 items-center justify-start min-h-screen bg-gray-800 text-white relative">
        <HeaderUser
          displayName={displayName}
          tokenLSM={tokenLSM}
          handleSignOut={handleSignOut}
          userData={userData}
        />
      </div>
    );
  }

  return (
    <div className="p-4 text-sm sm:text-base w-full flex flex-col space-y-4 items-center justify-start min-h-screen bg-gray-800 text-white relative">
      
      <HeaderUser
        displayName={displayName}
        tokenLSM={tokenLSM}
        handleSignOut={handleSignOut}
        userData={userData}
      />

      <Users userData={userData} users={users} />

      <Events
        displayName={displayName}
        userData={userData}
        events={events} // Passando a coleção "events"
      /></div>

  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

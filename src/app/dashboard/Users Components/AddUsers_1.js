import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { getDoc, query, where, collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebase"; // Importe seu arquivo de configuração do firebase

export default function AddUsers({
  userData, // dados do banco de dados do firebase
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");
  const [userRecord, setUserRecord] = useState(null);
  const [userId, setUserId] = useState(null); // Novo estado para armazenar o ID do usuário
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);

  const handleInputChange = (e, setToken, nextInputRef) => {
    setToken(e.target.value);
    if (e.target.value.length >= 4) {
      nextInputRef.current.focus();
    }
  };

  useEffect(() => {
    const searchUserByToken = async (tokenLSM) => {
      const q = query(
        collection(db, "users"),
        where("tokenLSM", "==", tokenLSM)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUserRecord(doc.data());
          setUserId(doc.id); // Armazena o ID do documento
        });
      } else {
        setUserRecord(null);
        setUserId(null); // Reseta o ID do documento
      }
    };

    if (token1.length === 4 && token2.length === 4) {
      const completeToken = `${token1}-${token2}`;
      searchUserByToken(completeToken);
    }
  }, [token1, token2]);

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const confirmUser = async () => {
    if (userRecord && userId) {
      const userDocRef = doc(db, "users", userId); // Utiliza o ID do documento
      await setDoc(userDocRef, {
        registeredBy: userData.displayName,
        role: "user" // Atribui a role "user"
      }, { merge: true });
      alert("Usuário confirmado e registrado por " + userData.displayName);
    }
  };

  // Verificação para usuários com role "user"
  if (userData.role === "user") {
    return ""
  }

  return (
    <div className="p-8 space-y-4 bg-gray-700 rounded-3xl w-full flex flex-col justify-between items-center">
      <div className="flex items-center justify-between w-full">
        <p className="text-lg font-bold">Cadastrar um novo usuário</p>
        <button onClick={toggleExpand}>
          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col space-y-4 items-center justify-center text-center">
          <div className="flex flex-col space-y-0">
            <p className="text-lg">Insira o token do usuário</p>
            <p className="text-sm text-gray-400">
              O token LSM pode ser encontrado ao logar com uma conta nova
            </p>
          </div>
          <div className="flex items-center justify-center flex-row space-x-4">
            <input
              type="text"
              maxLength="4"
              className="text-center text-black w-[75px] p-2 border rounded"
              onChange={(e) => handleInputChange(e, setToken1, secondInputRef)}
              ref={firstInputRef}
              required
            />
            <p>-</p>
            <input
              type="text"
              maxLength="4"
              className="text-center text-black w-[75px] p-2 border rounded"
              onChange={(e) => setToken2(e.target.value)}
              ref={secondInputRef}
              required
            />
          </div>
          {userRecord && (
            <div className="bg-gray-900 rounded-3xl space-y-4 p-6 border-3xl text-white">
              <p>Usuário encontrado: {userRecord.displayName}</p>
              <div className="space-y-1 flex flex-col">
                <p className="text-gray-400">Confirmar usuário?</p>
                <div className="flex space-x-4 justify-center items-center">
                  <button
                    className="shadow-lg bg-blue-500 py-1 text-sm px-3 rounded-2xl hover:bg-blue-400"
                    onClick={confirmUser}
                  >
                    sim
                  </button>
                  <button className="shadow-lg bg-red-500 py-1 text-sm px-3 rounded-2xl hover:bg-red-400">
                    não
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

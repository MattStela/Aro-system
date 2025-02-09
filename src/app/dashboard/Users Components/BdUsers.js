import React from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function BdUsers({
  userData, // dados do banco de dados do firebase
  users,
  toggleUserDetails,
  handleLetterClick,
  toggleSection,
  expandedUserIds,
  selectedLetter,
  isSectionExpanded,
}) {
  const renderUserDetails = (user) => {
    const isExpanded = expandedUserIds.includes(user.id);

    if (!userData) {
      return null; // Retorna null se userData não estiver definido
    }

    const canView =
      userData.role === "admaster" ||
      (userData.role === "adm" && user.role === "user");

    if (canView) {
      return (
        <div
          className="bg-gray-800 p-4 break-all w-[400px] rounded-2xl p-2"
          key={user.id}
        >
          <div className="flex space-x-4 justify-between items-center">
            <p>{user.displayName}</p>
            <button onClick={() => toggleUserDetails(user.id)}>
              {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
            </button>
          </div>
          {isExpanded && (
            <div className="text-gray-400 text-sm">
              {userData.role === "admaster" && <p>ID: {user.GoogleUID}</p>}
              <p>Telefone: {user.phone}</p>
              <p>Cargo: {user.role}</p>
              <p>registeredBy: {user.registeredBy}</p>
              <p>tokenLSM: {user.tokenLSM}</p>
              {userData.role === "admaster" && <p>PIN: {user.pin}</p>}
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  };

  // Filtrar os usuários de acordo com a permissão de visualização
  const filteredUsers = users.filter((user) => {
    return (
      userData.role === "admaster" ||
      (userData.role === "adm" && user.role === "user")
    );
  });

  // Filtrar o alfabeto para mostrar apenas letras que têm registros
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const filteredAlphabet = alphabet.filter((letter) =>
    filteredUsers.some((user) => user.displayName.startsWith(letter))
  );

  return (
    <div className="bg-gray-700 rounded-3xl w-full flex flex-col justify-between items-center">
      {(userData.role === "admaster" || userData.role === "adm") && (
        <>
          <div className="rounded-3xl w-full flex flex-row p-8 justify-between items-center">
            <p className="text-xl font-bold">Cadastros realizados</p>
            <button onClick={toggleSection}>
              {isSectionExpanded ? (
                <FaChevronDown className="" />
              ) : (
                <FaChevronRight className="" />
              )}
            </button>
          </div>

          {isSectionExpanded && (
            <>
              <div className="grid grid-cols-7 gap-2">
                {filteredAlphabet.map((letter) => (
                  <button
                    key={letter}
                    className={`w-10 h-10 m-1 rounded-full font-bold shadow-md hover:shadow-lg transition duration-200 ease-in-out flex items-center justify-center ${
                      selectedLetter === letter
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 hover:bg-blue-400 hover:text-white text-gray-800"
                    }`}
                    onClick={() => handleLetterClick(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              <div className="p-4 flex space-y-4 flex-col items-center justify-center w-full">
                {filteredUsers
                  .filter((user) => user.displayName.startsWith(selectedLetter))
                  .map((user) => renderUserDetails(user))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

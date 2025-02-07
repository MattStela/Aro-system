import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function BodyUser({
  userData, // dados do banco de dados do firebase
  users,
}) {
  const [expandedUserIds, setExpandedUserIds] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [isSectionExpanded, setIsSectionExpanded] = useState(false); // Alterado para false por padrão

  const toggleUserDetails = (userId) => {
    setExpandedUserIds((prevState) =>
      prevState.includes(userId)
        ? prevState.filter((id) => id !== userId)
        : [...prevState, userId]
    );
  };

  const handleLetterClick = (letter) => {
    setSelectedLetter(letter);
    setExpandedUserIds([]); // Close any expanded user details when a new letter is selected
  };

  const toggleSection = () => {
    setIsSectionExpanded((prevState) => !prevState);
  };

  const renderUserDetails = (user) => {
    const isExpanded = expandedUserIds.includes(user.id);

    if (!userData) {
      return null; // Retorna null se userData não estiver definido
    }

    if (userData.role === "admaster" || userData.role === "adm") {
      return (
        <div className="p-2" key={user.id}>
          <div className="flex space-x-4 justify-between items-center">
            <p>{user.displayName}</p>
            <button onClick={() => toggleUserDetails(user.id)}>
              {isExpanded ? (
                <FaChevronDown className="bg-gray-800" />
              ) : (
                <FaChevronRight className="bg-gray-800" />
              )}
            </button>
          </div>
          {isExpanded && (
            <div className="text-gray-400 text-sm">
              <p>GoogleUID: {user.GoogleUID}</p>
              <p>Telefone: {user.phone}</p>
              <p>Cargo: {user.role}</p>
              <p>PIN: {user.pin}</p>
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="w-[350px] space-y-4 text-sm sm:text-base flex flex-col items-center p-4 justify-start">
      {(userData.role === "admaster" || userData.role === "adm") && (
        <>
          <div className="flex items-center space-x-2">
            <p>Cadastros realizados</p>
            <button onClick={toggleSection}>
              {isSectionExpanded ? (
                <FaChevronDown className="bg-gray-800" />
              ) : (
                <FaChevronRight className="bg-gray-800" />
              )}
            </button>
          </div>

          {isSectionExpanded && (
            <>
              <div className="grid grid-cols-10">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    className={`py-1 px-3 m-1 rounded-full font-bold text-gray-800 flex items-center justify-center ${
                      selectedLetter === letter ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                    }`}
                    onClick={() => handleLetterClick(letter)}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              <div className="flex flex-col items-between w-full space-y-1">
                {users
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

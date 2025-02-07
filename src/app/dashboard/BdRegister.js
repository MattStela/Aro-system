import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function BodyUser({
  userData, // dados do banco de dados do firebase
  users,
}) {
  const [expandedUserIds, setExpandedUserIds] = useState([]);

  const toggleUserDetails = (userId) => {
    setExpandedUserIds((prevState) =>
      prevState.includes(userId)
        ? prevState.filter((id) => id !== userId)
        : [...prevState, userId]
    );
  };

  const renderUserDetails = (user) => {
    const isExpanded = expandedUserIds.includes(user.id);

    if (!userData) {
      return null; // Return null if userData is not defined
    }

    if (userData.role === "admaster") {
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
            <div>
              <p>GoogleUID: {user.GoogleUID}</p>
              <p>Telefone: {user.phone}</p>
              <p>Cargo: {user.role}</p>
              <p>PIN: {user.pin}</p>
            </div>
          )}
        </div>
      );
    } else if (userData.role === "adm") {
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
            <div>
              <p>Telefone: {user.phone}</p>
              <p>Cargo: {user.role}</p>
            </div>
          )}
        </div>
      );
    } else if (userData.role === "user") {
      return "";
    } else {
      return null;
    }
  };

  return (
    <div className="border w-[350px] text-sm sm:text-base flex flex-col items-center justify-start">
      <div className="w-full space-y-4">
        {users.map((user) => renderUserDetails(user))}
      </div>
    </div>
  );
}

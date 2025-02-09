import React, { useState } from "react";
import BdUsers from "./Users Components/BdUsers";
import AddUsers from "./Users Components/AddUsers_1";

export default function Users({
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

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      
      <AddUsers
        userData={userData}
        users={users}
        toggleUserDetails={toggleUserDetails}
        handleLetterClick={handleLetterClick}
        toggleSection={toggleSection}
        expandedUserIds={expandedUserIds}
        selectedLetter={selectedLetter}
        isSectionExpanded={isSectionExpanded}
      />

      <BdUsers
        userData={userData}
        users={users}
        toggleUserDetails={toggleUserDetails}
        handleLetterClick={handleLetterClick}
        toggleSection={toggleSection}
        expandedUserIds={expandedUserIds}
        selectedLetter={selectedLetter}
        isSectionExpanded={isSectionExpanded}
      />
    </div>
  );
}

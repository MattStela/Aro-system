import React, { useState } from "react";
import { db } from "../../../firebase"; // Certifique-se de que o caminho para seu arquivo firebase.js esteja correto
import { collection, addDoc, Timestamp } from "firebase/firestore";

import AddEvent from "./AddEvents";
import BdEvents from "./BdEvents";

export default function Events({
  events,
  displayName, // nome do usuário google
  userData, // dados do banco de dados do firebase
}) {
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newExitEvent, setExitEvent] = useState("");
  const [newConcentration, setConcentration] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addDoc(collection(db, "events"), {
        title: newTitle,
        content: newContent,
        createdBy: displayName,
        createdAt: Timestamp.fromDate(new Date()), // Usar Timestamp ao invés de new Date()
        DataEvent: newDate, // Envia DataEvent para o banco de dados
        TimeEvent: newTime, // Envia TimeEvent para o banco de dados
        ExitEvent: newExitEvent, // Envia ExitEvent para o banco de dados
        Concentration: newConcentration, // Envia Concentration para o banco de dados
      });
      setNewTitle("");
      setNewContent("");
      alert("Evento adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar evento: ", error);
      alert("Erro ao adicionar evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex space-y-4 flex-col items-center justify-center">
      <AddEvent
        userData={userData}
        handleSubmit={handleSubmit}
        newTitle={newTitle}
        newDate={newDate}
        newTime={newTime}
        newExitEvent={newExitEvent}
        newConcentration={newConcentration}
        newContent={newContent}
        setNewTitle={setNewTitle}
        setNewDate={setNewDate}
        setNewTime={setNewTime}
        setNewExitEvent={setExitEvent}
        setNewConcentration={setConcentration}
        setNewContent={setNewContent}
        isSubmitting={isSubmitting}
      />

      <BdEvents events={events} userData={userData} displayName={displayName}/>
    </div>
  );
}

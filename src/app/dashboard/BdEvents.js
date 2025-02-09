import React, { useState } from "react";
import { db } from "../../../firebase"; // Certifique-se de que o caminho para seu arquivo firebase.js esteja correto
import { doc, updateDoc } from "firebase/firestore";
import { FaChevronDown, FaChevronRight, FaEdit } from "react-icons/fa";

export default function BdEvents({ events, userData, displayName }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedEventIds, setExpandedEventIds] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editExitEvent, setEditExitEvent] = useState("");
  const [editConcentration, setEditConcentration] = useState("");

  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const toggleContent = () => {
    setIsContentExpanded((prevState) => !prevState);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event.id);
    setEditTitle(event.title);
    setEditContent(event.content);
    setEditDate(event.DataEvent);
    setEditTime(event.TimeEvent);
    setEditExitEvent(event.ExitEvent);
    setEditConcentration(event.Concentration);
  };

  const toggleEventDetails = (eventId) => {
    setExpandedEventIds((prevState) =>
      prevState.includes(eventId)
        ? prevState.filter((id) => id !== eventId)
        : [...prevState, eventId]
    );
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const eventRef = doc(db, "events", editingEvent);
      await updateDoc(eventRef, {
        title: editTitle,
        content: editContent,
        DataEvent: editDate, // Atualiza DataEvent no banco de dados
        TimeEvent: editTime, // Atualiza TimeEvent no banco de dados
        ExitEvent: editExitEvent, // Atualiza ExitEvent no banco de dados
        Concentration: editConcentration, // Atualiza Concentration no banco de dados
      });
      setEditingEvent(null);
      setEditTitle("");
      setEditContent("");
      setEditDate("");
      setEditTime("");
      setEditExitEvent("");
      setEditConcentration("");
      alert("Evento atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar evento: ", error);
      alert("Erro ao atualizar evento. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setEditTitle("");
    setEditContent("");
    setEditDate("");
    setEditTime("");
    setEditExitEvent("");
    setEditConcentration("");
  };

  return (
    <div className="p-4 w-full space-y-4 flex flex-col justify-center items-center rounded-3xl bg-gray-700">
      
      <div className="flex p-4 flex-row justify-between w-full">
        <h2 className="text-lg font-bold">Registros de eventos</h2>
        <button onClick={toggleContent} className="focus:outline-none">
          {isContentExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </button>
      </div>

      {isContentExpanded && (
        <div>
          {events.map((event) => {
            const isExpanded = expandedEventIds.includes(event.id);
            const canEdit =
              userData.role === "admaster" ||
              (userData.role === "adm" && event.createdBy === displayName);

            return (
              <div className="w-[500px] p-2" key={event.id}>
                {editingEvent === event.id ? (
                  <div className="flex flex-col text-center w-full p-4">
                    <h2 className="text-lg font-bold mb-4">Editar Evento</h2>
                    {/* Formulário de edição do evento */}
                    <form onSubmit={handleUpdateEvent} className="space-y-4">
                      <div className="flex flex-col items-start">
                        <p className="text-gray-400 font-bold text-sm">
                          Título
                        </p>
                        <input
                          type="text"
                          placeholder="Título"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="text-black w-full h-8 text-sm p-2 border rounded"
                          required
                        />
                      </div>
                      <div className="flex flex-row space-x-2 justify-center">
                        <div className="flex flex-col items-start">
                          <p className="text-gray-400 font-bold text-xs">
                            Data
                          </p>
                          <input
                            type="date"
                            placeholder="Data"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="text-black w-24 h-8 text-sm p-2 border rounded"
                            required
                          />
                        </div>

                        <div className="flex flex-col items-start">
                          <p className="text-gray-400 font-bold text-xs">
                            Horário
                          </p>
                          <input
                            type="time"
                            placeholder="Horário"
                            value={editTime}
                            onChange={(e) => setEditTime(e.target.value)}
                            className="text-black w-24 h-8 text-sm p-2 border rounded"
                            required
                          />
                        </div>
                        <div className="flex flex-col items-start">
                          <p className="text-gray-400 font-bold text-xs">
                            Saída
                          </p>
                          <input
                            type="time"
                            placeholder="Saída"
                            value={editExitEvent}
                            onChange={(e) => setEditExitEvent(e.target.value)}
                            className="text-black w-24 h-8 text-sm p-2 border rounded"
                            required
                          />
                        </div>

                        <div className="flex flex-col items-start">
                          <p className="text-gray-400 font-bold text-xs">
                            Concentração
                          </p>
                          <input
                            type="time"
                            placeholder="Concentração"
                            value={editConcentration}
                            onChange={(e) =>
                              setEditConcentration(e.target.value)
                            }
                            className="text-black w-24 h-8 text-sm p-2 border rounded"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-start">
                        <p className="text-gray-400 font-bold text-sm">
                          Descrição
                        </p>
                        <textarea
                          placeholder="Descrição"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="text-black w-full text-sm p-2 border rounded resize-none"
                          required
                        />
                      </div>
                      <div className="flex justify-between">
                        <button
                          type="submit"
                          className="px-4 py-1 bg-blue-500 text-white rounded-3xl hover:bg-blue-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Atualizando..." : "Atualizar Evento"}
                        </button>
                        <button
                          type="button"
                          className="px-4 py-1 bg-red-500 text-white rounded-3xl hover:bg-red-700"
                          onClick={handleCancelEdit}
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="flex flex-col text-center w-full p-4">
                    {/* Título do evento */}
                    <div className="flex space-x-4 justify-center items-center">
                      {canEdit && (
                        <button onClick={() => handleEditEvent(event)}>
                          <FaEdit className="text-blue-500 mx-2" />
                        </button>
                      )}

                      <h3 className="text-xl font-bold">{event.title}</h3>

                      {/* Ícone de seta */}
                      <div className="flex items-center">
                        <button onClick={() => toggleEventDetails(event.id)}>
                          {isExpanded ? (
                            <FaChevronDown className="bg-gray-800" />
                          ) : (
                            <FaChevronRight className="bg-gray-800" />
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Conteúdo do evento */}
                    {isExpanded && (
                      <div className="w-[400px]">
                        <div className="flex flex-row justify-center items-center space-x-2">
                          <h3 className="text-base font-bold">
                            {new Date(
                              new Date(event.DataEvent).getTime() +
                                new Date().getTimezoneOffset() * 60000
                            ).toLocaleDateString("pt-BR")}
                          </h3>
                          <h3 className="text-base font-bold">
                            {event.TimeEvent}
                          </h3>
                        </div>
                        <h3 className="text-gray-400 text-sm">
                          saída: {event.ExitEvent}
                        </h3>
                        <h3 className="text-sm text-gray-400">
                          concentração: {event.Concentration}
                        </h3>
                        <br />
                        <p className="break-words">{event.content}</p>
                        <p className="text-sm text-gray-500">
                          Criado por {event.createdBy} em{" "}
                          {new Date(
                            event.createdAt.seconds * 1000
                          ).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}


    </div>
  );
}

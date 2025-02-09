import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

export default function AddEvent({
  userData,
  handleSubmit,
  newTitle,
  newDate,
  newTime,
  newExitEvent,
  newConcentration,
  newContent,
  setNewTitle,
  setNewDate,
  setNewTime,
  setNewExitEvent,
  setNewConcentration,
  setNewContent,
  isSubmitting,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  return (
    <div className="bg-gray-700 rounded-3xl w-full flex flex-col p-8 justify-center items-center">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-lg font-bold">Adicionar novo evento</h2>
        <button onClick={toggleExpand} className="focus:outline-none">
          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </button>
      </div>
      {isExpanded && (
        <div className="space-y-4">
          {(userData.role === "admaster" || userData.role === "adm") && (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col justify-center items-center w-full space-y-4"
              >
                <div className="flex flex-col">
                  <p className="text-center text-gray-400">Nome do evento</p>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="text-black w-[300px] p-2 border rounded"
                    required
                  />
                </div>
                <div className="flex flex-row space-x-4">
                  <div className="flex flex-col">
                    <p className="text-center text-gray-400">Data</p>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="text-black w-36 p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-center text-gray-400">Horário</p>
                    <input
                      type="time"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      className="text-black w-24 p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-center text-gray-400">Saída</p>
                    <input
                      type="time"
                      value={newExitEvent}
                      onChange={(e) => setNewExitEvent(e.target.value)}
                      className="text-black w-24 p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="text-center text-gray-400">Concentração</p>
                    <input
                      type="time"
                      value={newConcentration}
                      onChange={(e) => setNewConcentration(e.target.value)}
                      className="text-black w-24 p-2 border rounded"
                      required
                    />
                  </div>
                </div>

                <div className="text-center flex flex-col">
                  <p className="text-gray-400">Descrição</p>
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    className="resize-none text-black h-32 w-[450px] p-2 border rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Adicionar Evento"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { FaRegCopy, FaEdit } from "react-icons/fa";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase"; // Importe seu arquivo de configuração do firebase

const HeaderUser = ({
  displayName, // nome do usuário google
  tokenLSM, // token LSM
  handleSignOut, // lida com o botão de sair, saindo do usuário logado
  userData, // dados do banco de dados do firebase
}) => {
  const [phoneInput, setPhoneInput] = useState(userData.phone || "");
  const [pinInput, setPinInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false); // Estado para controlar a edição do telefone

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const formattedValue = formatPhone(value);
    setPhoneInput(formattedValue);
  };

  const formatPhone = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");

    if (phoneNumber.length <= 2) return phoneNumber;
    if (phoneNumber.length <= 7)
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
      2,
      7
    )}-${phoneNumber.slice(7, 11)}`;
  };

  const handlePinChange = (e) => {
    const { value } = e.target;
    const formattedValue = value.replace(/[^\d]/g, "").slice(0, 6);
    setPinInput(formattedValue);
  };

  const handleSubmit = async () => {
    if (!userData?.uid) {
      console.error("userData.uid is not defined");
      alert("Erro ao atualizar os dados: UID do usuário não definido.");
      return;
    }

    setIsUpdating(true);
    try {
      const userDocRef = doc(db, "users", userData.uid); // Certifique-se de usar userData.uid
      await setDoc(
        userDocRef,
        { phone: phoneInput, pin: pinInput },
        { merge: true }
      );
      alert("Dados atualizados com sucesso!");
      window.location.reload(); // Recarregar a página
    } catch (error) {
      console.error("Erro ao atualizar os dados: ", error);
      alert("Erro ao atualizar os dados.");
    }
    setIsUpdating(false);
  };

  const handlePhoneEdit = () => {
    setIsEditingPhone(true);
  };

  const handlePhoneSave = async () => {
    setIsUpdating(true);
    try {
      const userDocRef = doc(db, "users", userData.uid); // Certifique-se de usar userData.uid
      await setDoc(
        userDocRef,
        { phone: phoneInput },
        { merge: true }
      );
      alert("Telefone atualizado com sucesso!");
      setIsEditingPhone(false); // Encerrar o modo de edição
      window.location.reload(); // Recarregar a página
    } catch (error) {
      console.error("Erro ao atualizar o telefone: ", error);
      alert("Erro ao atualizar o telefone.");
    }
    setIsUpdating(false);
  };
  const renderUserData = () => {
    if (userData?.role === "admaster") {
      const dataToShow = ["phone", "pin", "role", "GoogleUID"];
      return (
        <div className="flex flex-col text-center mt-4 text-[0.8rem] sm:text-sm text-gray-400">
          {dataToShow.map(
            (field) => (
              field === "phone" && !isEditingPhone ? (
                <div key={field} className="flex items-center justify-center space-x-2">
                  <p>{`Telefone: ${userData[field]}`}</p>
                  <FaEdit
                    onClick={handlePhoneEdit}
                    className="cursor-pointer hover:text-blue-500 transition duration-200 ease-in-out"
                  />
                </div>
              ) : (
                userData[field] && (
                  <div key={field} className="flex items-center justify-center space-x-2">
                    <p>{`${
                      field.charAt(0).toUpperCase() + field.slice(1)
                    }: ${userData[field]}`}</p>
                    {field === "phone" && (
                      <input
                        type="phone"
                        value={phoneInput}
                        onChange={handlePhoneChange}
                        className="text-black w-[150px] h-8 p-2 text-sm border rounded"
                      />
                    )}
                  </div>
                )
              )
            )
          )}
          {isEditingPhone && (
            <button
              onClick={handlePhoneSave}
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
              disabled={isUpdating}
            >
              {isUpdating ? "Salvando..." : "Salvar Telefone"}
            </button>
          )}
        </div>
      );
    } else if (userData?.role === "adm" || userData?.role === "user") {
      if (
        userData.role === "user" &&
        userData.registeredBy &&
        (!userData.phone || !userData.pin)
      ) {
        return (
          <div className="space-y-4 flex justify-center items-center flex-col text-center mt-4 text-[0.8rem] sm:text-sm text-gray-400">
            
            <div className="flex flex-col space-y-2 items-end pr-3">
              <div className="flex flex-row justify-center items-center space-x-2">
                <p className="text-sm">Telefone:</p>
                <input
                  type="phone"
                  value={phoneInput}
                  onChange={handlePhoneChange}
                  className="text-black w-[150px] h-8 p-4 text-sm border rounded-full"
                />
              </div>

              <div className="flex flex-row justify-center items-center space-x-2">
                <p className="text-xs">PIN:</p>
                <input
                  type="password"
                  value={pinInput}
                  onChange={handlePinChange}
                  className="text-black w-[150px] h-8 p-4 text-sm border rounded-full"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-28 mt-2 text-xs py-1 bg-blue-500 text-white rounded-full hover:bg-blue-700"
              disabled={isUpdating}
            >
              {isUpdating ? "Atualizando..." : "Adicionar Dados"}
            </button>
          </div>
        );
      } else {
        const dataToShow = ["phone", "role","registeredBy"];
        return (
          <div className="flex flex-col text-center mt-4 text-[0.8rem] sm:text-sm text-gray-400">
            {dataToShow.map(
              (field) => (
                field === "phone" && !isEditingPhone ? (
                  <div key={field} className="flex items-center justify-center space-x-2">
                    <p>{`Telefone: ${userData[field]}`}</p>
                    <FaEdit
                      onClick={handlePhoneEdit}
                      className="cursor-pointer hover:text-blue-500 transition duration-200 ease-in-out"
                    />
                  </div>
                ) : (
                  userData[field] && (
                    <div key={field} className="flex items-center justify-center space-x-2">
                      <p>{`${
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }: ${userData[field]}`}</p>
                      {field === "phone" && (
                        <input
                          type="phone"
                          value={phoneInput}
                          onChange={handlePhoneChange}
                          className="text-black w-[150px] h-8 p-2 text-sm border rounded"
                        />
                      )}
                    </div>
                  )
                )
              )
            )}
            {isEditingPhone && (
              <button
                onClick={handlePhoneSave}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                disabled={isUpdating}
              >
                {isUpdating ? "Salvando..." : "Salvar Telefone"}
              </button>
            )}
          </div>
        );
      }
    } else if (userData?.role === null && tokenLSM) {
      return (
        <div className="flex flex-col space-y-3 text-center mt-4 text-[0.8rem] sm:text-sm text-gray-400">
          <div className="flex items-center justify-center space-x-2">
            <p className="break-all">Token: {tokenLSM}</p>
            <button
              onClick={() => navigator.clipboard.writeText(tokenLSM)}
              className="hover:text-gray-100 transition duration-200 ease-in-out"
            >
              <FaRegCopy />
            </button>
          </div>
          <p className="text-red-500">
            Por favor, apresente o Token acima para um administrador (adm) para
            que ele possa completar seu registro no sistema.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-700 w-full sm:w-3/4 rounded-3xl border-gray-500 flex justify-center flex-col items-center py-4 px-6">
      <div className="flex flex-row items-center justify-center space-x-4">
        <p className="text-xl sm:text-3xl font-bold mb-1">
          Bem-vindo, {displayName}!
        </p>
        <button
          className="border-2 border-red-500 h-8 w-12 rounded-full bg-red-500 hover:bg-red-700"
          onClick={handleSignOut}
        >
          sair
        </button>
      </div>

      {renderUserData()}
    </div>
  );
};

export default HeaderUser;

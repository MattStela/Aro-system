import React from "react";
import { FaRegCopy } from "react-icons/fa";

const HeaderUser = ({
  displayName, // nome do usuário google
  tokenLSM, // token LSM
  handleSignOut, // lida com o botão de sair, saindo do usuário logado
  userData, // dados do banco de dados do firebase
}) => {
  const renderUserData = () => {
    if (userData?.role === "admaster") {
      const dataToShow = ["phone", "pin", "role", "GoogleUID", "tokenLSM"];
      return (
        <div className="flex flex-col text-center mt-4 text-[0.8rem] sm:text-sm text-gray-400">
          {dataToShow.map(
            (field) =>
              userData[field] && (
                <p key={field}>{`${
                  field.charAt(0).toUpperCase() + field.slice(1)
                }: ${userData[field]}`}</p>
              )
          )}
        </div>
      );
    } else if (userData?.role === "adm" || userData?.role === "user") {
      const dataToShow = ["phone", "role", "tokenLSM"];
      return (
        <div className="flex flex-col text-center mt-4 text-[0.8rem] sm:text-sm text-gray-400">
          {dataToShow.map(
            (field) =>
              userData[field] && (
                <p key={field}>{`${userData[field]}`}</p>
              )
          )}
        </div>
      );
    } else if (userData?.role === null && tokenLSM) {
      return (
        <div className="flex flex-col space-y-3 text-center mt-4 text-[0.8rem] sm:text-sm text-gray-400">
          <div className="flex items-center justify-center space-x-2">
            <p className="break-all">Token: {tokenLSM}</p>
            <button
              onClick={() => navigator.clipboard.writeText(tokenLSM)}
              className=" hover:text-gray-100 transition duration-200 ease-in-out"
            >
              <FaRegCopy />
            </button>
          </div>
          <p className="text-red-500">
            Por favor, apresente o Token acima para um administrador (adm) para
            que ele possa completar seu registro no sistema
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

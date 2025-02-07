import React from "react";

const HeaderUser = ({
  displayName, // nome do usuário google
  token, // token jwt
  handleSignOut, // lida com o botão de sair, saindo do usuário logado
  userData, // dados do banco de dados do firebase
  handleRegisterInfo, // registra informações do usuário
  areaCode, // +55 Brasil
  setAreaCode,
  phoneNumber, // numero de telefone cadastrado
  setPhoneNumber,
  pin, // pin cadastrado
  handlePinChange,
  setDisplayName, // Função para definir o apelido (displayName)
}) => {
  const isDataMissing = !userData?.phone || !userData?.pin || !userData?.displayName;

  return (
    <div className="border-4 border-gray-500 flex justify-center flex-col items-center py-4 px-6">
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

      {userData && (
        <div className="flex flex-col justify-center items-center text-[0.8rem] sm:text-sm text-gray-400">
          <p>Telefone: {userData.phone}</p>
        </div>
      )}

      {isDataMissing && (
        <div className="p-4 space-x-4 rounded-3xl flex flex-col space-y-4 items-center">
          <p className="text-gray-400">Adicione suas informações:</p>
          {!userData?.phone && (
            <>
              <div className="space-x-4 flex flex-row items-center">
                <div className="flex flex-row space-x-4">
                  <div className="flex flex-col justify-center items-start">
                    <input
                      maxLength={2}
                      type="text"
                      value={areaCode}
                      onChange={(e) => setAreaCode(e.target.value)}
                      className="w-16 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                      placeholder="DDD"
                      name="DDD"
                    />
                  </div>
                </div>
                <div className="flex space-y-1 flex-col justify-center items-start">
                  <input
                    name="phone"
                    maxLength={9}
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                    placeholder="Número de Telefone"
                  />
                </div>
              </div>
            </>
          )}

          {!userData?.pin && (
            <>
              <p className="text-gray-400">Adicione um PIN à sua conta:</p>
              <div className="flex space-x-2">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handlePinChange(e.target.value, index)}
                    className="shadow appearance-none border rounded h-[42px] w-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 text-center"
                  />
                ))}
              </div>
            </>
          )}

          <p className="text-gray-400">Adicione um Apelido à sua conta:</p>
          <div className="flex flex-col justify-center items-start">
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              placeholder="Apelido"
            />
          </div>

          <button
            onClick={handleRegisterInfo}
            className="p-2 rounded-full px-3 bg-gray-600 text-gray-300 hover:text-white hover:bg-gray-500 text-sm"
          >
            Confirmar
          </button>
        </div>
      )}
    </div>
  );
};

export default HeaderUser;

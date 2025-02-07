import React from "react";

export default function BodyUser({
  displayName, //nome do usuário google
  token, //token jwt
  handleSignOut, //lida com o botão de sair, saindo do usuário logado
  userData, //dados do banco de dados do firebase
  handleRegisterInfo, //registra informações do usuário
  areaCode, //+55 Brasil
  setAreaCode,
  phoneNumber, //numero de telefone cadastrado
  setPhoneNumber,
  pin, //pin cadastrado
  handlePinChange,
  users,
}) {
  return (
    <div className="border p-4 text-sm sm:text-base w-full flex flex-col items-center justify-center ">
      

      <div className="space-y-4 m-4">
        {users.map((user) => (
          <div className="" key={user.id}>
            <p>{user.displayName}</p>
            <p>GoogleUID: {user.GoogleUID}</p>
            <p>telefone: {user.phone}</p>
            <p>cargo: {user.role}</p>
            <p>pin: {user.pin}</p>

          </div>
        ))}
      </div>
    </div>
  );
}

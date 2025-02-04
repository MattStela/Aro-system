"use client";
import { useState } from "react";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handlePhoneLogin = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica de login com telefone e senha
    console.log(`Phone: ${phone}, Password: ${password}`);
  };

  return (
    <form onSubmit={handlePhoneLogin} className="mb-4">
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2" htmlFor="phone">
          Telefone
        </label>
        <input
          type="text"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          placeholder="Telefone"
        />
      </div>
      <div className="mb-6">
        <label className="block text-sm font-bold mb-2" htmlFor="password">
          Senha
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="shadow appearance-none border rounded-2xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          placeholder="Senha"
        />
      </div>
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 "
      >
        Entrar com Telefone
      </button>
    </form>
  );
}

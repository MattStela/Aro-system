"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signInWithGoogle, signOutUser } from "../../firebase"; // Certifique-se de que o caminho está correto
import PhoneLogin from "../components/PhoneLogin"; // Importando o componente PhoneLogin

export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="text-sm sm:text-base w-full flex flex-col items-center justify-center min-h-screen">
      <div className="bg-gray-800 text-main-aro shadow-lg rounded-2xl p-8 w-5/6 sm:w-full max-w-md">
        {loading ? (
          <p className="text-center text-gray-500">Carregando...</p>
        ) : user ? (
          <div className=" text-center">
            <p className="text-2xl font-semibold mb-4">
              Bem-vindo, {user.displayName}
            </p>
            <button
              onClick={signOutUser}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className=" text-center">
            <h2 className="text-3xl font-bold mb-6">Login</h2>
            <div className="p-4 rounded-3xl bg-gray-700">
              <PhoneLogin /> {/* Incluindo o componente PhoneLogin */}
            </div>

            <div className=" flex flex-row justify-center items-center">
              <div className="w-[42%] h-[0.1rem] rounded-full bg-gray-600"></div>
              <p className="text-center flex-grow  my-4">ou</p>
              <div className="w-[42%] h-[0.1rem] rounded-full bg-gray-600"></div>
            </div>

            <button
              onClick={signInWithGoogle}
              className="h-[50px] hover:text-white text-black bg-white hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 w-full"
            >
              <img
                src="/google.png"
                alt="Google icon"
                width={24}
                height={24}
                className="mr-2"
              />
              <span>Entrar com Google</span>
            </button>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mt-4">{error.message}</p>}
      </div>
    </div>
  );
}

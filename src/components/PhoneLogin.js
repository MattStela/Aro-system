"use client";
import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import countryList from "react-select-country-list";
import Select from "react-select";

export default function PhoneLogin() {
  const [country, setCountry] = useState({
    label: "Brazil",
    value: "55",
    code: "BR",
  });
  const [areaCode, setAreaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Lista de países com seus códigos e siglas
  const options = countryList()
    .getData()
    .map((country) => ({
      label: country.label,
      value: country.value,
      code: country.code,
    }));

  useEffect(() => {
    const auth = getAuth();

    function onCaptchaVerify() {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              // reCAPTCHA solved - Allow user to proceed with phone number verification
            },
            "expired-callback": () => {
              // Response expired - Ask user to solve reCAPTCHA again
            },
          },
          auth
        );
      }
    }

    onCaptchaVerify();

    window.recaptchaVerifier.render().then((widgetId) => {
      window.recaptchaWidgetId = widgetId;
    });
  }, []);

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      // Juntar os valores de país, DDD e número de telefone
      const fullPhoneNumber = `+${country.value}${areaCode}${phoneNumber}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        appVerifier
      );
      const verificationCode = window.prompt(
        "Digite o código de verificação enviado para o seu telefone:"
      );

      // Verificar o código
      const result = await confirmationResult.confirm(verificationCode);
      const user = result.user;

      // Buscar os dados do usuário no Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phone", "==", fullPhoneNumber));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("Telefone não encontrado.");
      } else {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          router.push({
            pathname: "/dashboard",
            query: {
              uid: userData.uid,
              displayName: userData.displayName,
              phone: fullPhoneNumber,
            },
          });
        });
      }
    } catch (err) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
          grecaptcha.reset(widgetId);
        });
      }
    }
  };

  return (
    <form onSubmit={handlePhoneLogin} className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 space-x-0 sm:space-x-4 items-center justify-center">
        <div className="flex flex-row space-x-4 items-center justify-center">
          <div className="">
            <Select
              id="countrySelect"
              options={options}
              value={country}
              onChange={(selectedOption) =>
                setCountry({
                  label: selectedOption.label,
                  value: selectedOption.value,
                  code: selectedOption.code,
                })
              }
              className="shadow appearance-none w-24 text-gray-700"
              formatOptionLabel={(option) => (
                <div className="flex flex-col items-start">
                  <span>{option.label}</span>
                  <span className="text-xs text-gray-500">{option.code}</span>
                </div>
              )}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.code}
            />
          </div>
          <div className="">
            <input
              type="text"
              id="areaCode"
              value={areaCode}
              onChange={(e) => setAreaCode(e.target.value)}
              className="shadow appearance-none border rounded h-[42px] w-16 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
              placeholder="DDD"
            />
          </div>
        </div>
        <div className="">
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="shadow appearance-none border rounded h-[42px] w-44 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            placeholder="Número de Telefone"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
      >
        Entrar com Telefone
      </button>
      <div id="recaptcha-container"></div>
      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </form>
  );
}

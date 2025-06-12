"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { useTranslations } from "next-intl";

export function useLogin() {

  const t = useTranslations("login");

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);

  // Estados los pasos
  const [step, setStep] = useState(1);

  // Estado para el error y loading
  const [errorLogin, setErrorLogin] = useState("")
  const [loading, setLoading] = useState(false);
  

  //Funcion para iniciar sesion

  const handleLogin = async (email: string, password: string) => {
    try {
      setDisabled(true);
      setLoading(true);
      const res = await signIn("credentials", { redirect: false, email: email, password: password });
      if (res?.status === 401) {
        setDisabled(false);
        setLoading(false);
        setErrorLogin(t("error.wrongcredentials"))
      } else if (res?.status === 200) {
        const currentLang = window.location.pathname.split('/')[1];
        window.location.href = `/${currentLang}`;
      }else if(res?.status === 403){
        setDisabled(false);
        setLoading(false);
        setErrorLogin(t("error.userbanned"))
      }
    } catch (error: unknown) {
      console.error("An error occurred during login:", error);
      setErrorLogin(t("error.unexpectederror"));
    }
  }

  return {
    email,
    password,
    step,
    errorLogin,
    setStep,
    setEmail,
    setPassword,
    handleLogin,
    loading,
    disabled
  };
}

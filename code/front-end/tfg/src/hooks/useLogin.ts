"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

export function useLogin() {
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
        setErrorLogin("Wrong email or password")
      } else if (res?.status === 200) {
        window.location.href = "/";
      }else if(res?.status === 403){
        setDisabled(false);
        setLoading(false);
        setErrorLogin("User banned")
      }
    } catch (error: unknown) {
      console.error("An error occurred during login:", error);
      setErrorLogin("An unexpected error occurred. Please try again.");
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

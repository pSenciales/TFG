"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export function useLogin() {
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Estados los pasos
  const [step, setStep] = useState(1);

  // Estado para el error
  const [errorLogin, setErrorLogin] = useState("")

  //Funcion para iniciar sesion

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await signIn("credentials", { redirect: false, email: email, password: password });
      if (res?.status === 401) {

        setErrorLogin("Wrong email or password")
      } else if(res?.status === 200) {
        window.location.href = "/";
      }
    } catch (error: unknown) {

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
    handleLogin
  };
}

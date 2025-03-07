"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <button onClick={() => signIn("google")} className="btn">
        Iniciar sesión con Google
      </button>
      <button onClick={() => signIn("github")} className="btn">
        Iniciar sesión con GitHub
      </button>
      <button onClick={() => signIn("credentials", {
        email: "pablodelah@gmail.com",
        password: "1234",
        redirect: false, // Para manejar el error en frontend
      })} className="btn">
        Iniciar sesión con otro método
      </button>
    </div>
  ); 
}
       
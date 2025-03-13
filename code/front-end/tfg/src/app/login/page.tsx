"use client";

import LoginButton from "@/components/LoginButton";
import { useSession } from "next-auth/react";
import axios from "axios";


export default function LoginPage() {
    const { data: session } = useSession();

    if (JSON.stringify(session)) {
        console.log(session);
    }
    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <LoginButton />

            <button onClick={async () => {
                const response = await axios.get("/api/vision");
                console.log(response);
            }
            }>Enviar</button>
        </div>
    );
}

"use client";

import LoginButton from "@/components/LoginButton";
import { useSession } from "next-auth/react";


export default function LoginPage() {
    const { data: session } = useSession();
    if (JSON.stringify(session)) {
        console.log(session);
    }
    return (
        <div>
            <h1>Iniciar Sesión</h1>
            <LoginButton />
        </div>
    );
}

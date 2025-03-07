import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Importa desde src/lib/auth.ts

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

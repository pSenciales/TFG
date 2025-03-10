import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "user@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan credenciales");
        }

        try {
          const {data} = await axios.post("http://127.0.0.1:5000/login", {
            email: credentials.email,
            password: credentials.password,
          });
          return data;
          
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error("Error en la autenticación");
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, user}) {
      console.log("USUARIO: " + JSON.stringify(user));
      if (account) {
        token.accessToken = account.access_token;
      }
      if (!token.accessToken && user) {
        token.accessToken = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.accessToken = token.accessToken as string
      return session;
    },
  }
  ,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
};

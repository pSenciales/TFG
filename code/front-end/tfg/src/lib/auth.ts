import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import axios, { AxiosError } from "axios";

const FLASK_API_URL = process.env.NEXT_PUBLIC_FLASK_API_URL;

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
        email: {
          label: "Email",
          type: "email",
          placeholder: "user@example.com",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan credenciales");
        }

        try {
          const { data } = await axios.post(`${FLASK_API_URL}/login`, {
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
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token || user.access_token;
        token.provider = account.provider;
        token.accessTokenExpires = Date.now() + 60 * 60 * 1000;
        token.role = user.role || "user";

        if (account.provider !== "credentials") {
          try {
            console.log("Creating user in Flask API");
            const res = await axios.post(
              `${FLASK_API_URL}/users`,
              {
                name: user.name,
                email: user.email,
                provider: account.provider,
              },
              {
                headers: {
                  Authorization: `Bearer ${account.access_token}`,
                  "X-Provider": account.provider,
                },
              }
            );
            console.log("DATA:"+res.data.user_id);
            token.sub = res.data.user_id;
          } catch (error) {
            if (error instanceof AxiosError) {
              console.error(error);
            } else {
              console.error("ERROR:"+error);
            }
          }
        }
        return token;
      }
      return token;
    },
    async session({ session, token }) {
      console.log(JSON.stringify(token));
      session.role = token.role as string;
      session.user.id = token.sub as string;
      session.provider = token.provider as string;
      return session;
    },

    async signIn({ user }) {
      const email = user.email as string;
      console.log(`EMAIL: ${email}`)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_FLASK_API_URL}/users/email/${email}`);
      const { success } = response.data;
      console.log(`SUCCESS: ${success}`)
      const isAllowedToSignIn = success !== "User banned";
      if (isAllowedToSignIn) {
        return true
      } else {
        return false
      }
    },

    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    provider: string;
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    access_token: string;
  }
}

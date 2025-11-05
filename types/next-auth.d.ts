// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone?: string;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    phone?: string;
    name?: string | null;
  }
}

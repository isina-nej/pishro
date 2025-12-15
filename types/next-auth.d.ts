// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone?: string;
      name?: string | null;
      role?: string;
    };
  }

  interface User {
    id: string;
    phone?: string;
    name?: string | null;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phone?: string;
    name?: string | null;
    role?: string;
  }
}

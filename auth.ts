// @/auth.ts
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

/** 🔐 Schema validation for login form */
const signInSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره تلفن معتبر نیست."),
  password: z.string().min(8, "رمز عبور باید حداقل 8 کاراکتر باشد."),
});

/** ⚙️ NextAuth configuration */
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // ✅ اجازه میدهد Auth.js در محیط‌های مختلف (Vercel, localhost) کار کند
  // cookies: {
  //   sessionToken: {
  //     name: "authjs.session-token",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "none", // ⬅️ برای Cross-Origin ضروری
  //       secure: true, // ⬅️ چون دامنه‌هات HTTPS هستن
  //       // Allow subdomains (admin.pishrosarmaye.com) to receive the cookie.
  //       // You can override by setting SESSION_COOKIE_DOMAIN in the environment.
  //       domain: process.env.SESSION_COOKIE_DOMAIN || ".pishrosarmaye.com",
  //     },
  //   },
  // },
  providers: [
    Credentials({
      name: "Phone + Password",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { phone, password } = await signInSchema.parseAsync(
            credentials
          );

          const user = await prisma.user.findUnique({ where: { phone } });
          if (!user) return null;

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) return null;

          return {
            id: user.id,
            phone: user.phone,
            name:
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : undefined,
            role: user.role,
          };
        } catch (err) {
          console.error("[❌] authorize error:", err);
          return null;
        }
      },
    }),
  ],

  /** 🧩 Add callbacks to include custom user fields in session */
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.name = token.name as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

// ✅ Export main handler (for /api/auth/[...nextauth])
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

/** 🔐 Schema validation for login form */
const signInSchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره تلفن معتبر نیست."),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل 8 کاراکتر باشد.")
    .regex(/[A-Za-z]/, "رمز عبور باید شامل حروف باشد.")
    .regex(/[0-9]/, "رمز عبور باید شامل اعداد باشد."),
});

/** ⚙️ NextAuth configuration */
export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
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
            name: user.name ?? undefined,
          };
        } catch (err) {
          console.error("❌ authorize error:", err);
          return null;
        }
      },
    }),
  ],
};

// ✅ Export main handler (for /api/auth/[...nextauth])
export const { handlers, auth } = NextAuth(authConfig);

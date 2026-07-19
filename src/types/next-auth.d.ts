import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      credits: number;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    credits?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    credits?: number;
  }
}

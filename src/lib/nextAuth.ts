import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AuthOptions } from "next-auth";

const prisma = new PrismaClient();

if (!process.env.GITHUB_ID) {
  throw new Error("Missing GITHUB_ID");
}
if (!process.env.GITHUB_SECRET) {
  throw new Error("Missing GITHUB_SECRET");
}

const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }: any) => {
      if (user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.picture;
      }

      return session;
    },
  },
};

export const nextAuth = { authOptions };

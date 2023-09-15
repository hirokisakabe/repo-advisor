import { nextAuth } from "@/lib/nextAuth";
import NextAuth from "next-auth";

const handler = NextAuth(nextAuth.authOptions);

export { handler as GET, handler as POST };

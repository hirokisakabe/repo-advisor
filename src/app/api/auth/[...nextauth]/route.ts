import NextAuth from "next-auth";
import { nextAuth } from "@/lib";

const handler = NextAuth(nextAuth.authOptions);

export { handler as GET, handler as POST };

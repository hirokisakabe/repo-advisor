"use client";

import { useSession } from "next-auth/react";
import { LoginButton } from "../parts";
import { redirect } from "next/navigation";

export function RootPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>Loading...</div>
      </main>
    );
  }

  if (status === "authenticated") {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LoginButton />
    </main>
  );
}

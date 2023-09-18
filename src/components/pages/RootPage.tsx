"use client";

import { useSession } from "next-auth/react";
import { LoginButton } from "..";

export function RootPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main>
      <LoginButton />
    </main>
  );
}

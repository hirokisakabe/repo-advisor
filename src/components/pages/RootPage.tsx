"use client";

import { useSession } from "next-auth/react";
import { Center, Loading, LoginButton } from "../parts";
import { redirect } from "next/navigation";

export function RootPage() {
  const { status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "authenticated") {
    redirect("/dashboard");
  }

  return (
    <Center>
      <LoginButton />
    </Center>
  );
}

"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Center, Loading, LoginButton } from "../parts";

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

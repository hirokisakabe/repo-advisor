"use client";

import { Button } from "@tremor/react";
import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <Button variant="secondary" onClick={() => signIn()}>
      Sign in with GitHub
    </Button>
  );
}

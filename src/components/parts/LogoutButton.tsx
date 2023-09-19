"use client";

import { signOut } from "next-auth/react";
import { Button } from "@tremor/react";

export function LogoutButton() {
  return (
    <Button variant="secondary" onClick={() => signOut()}>
      Sign out
    </Button>
  );
}

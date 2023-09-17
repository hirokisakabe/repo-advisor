"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRepo } from "@/lib/client";

export function DashboardPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => redirect("/"),
  });

  const { data, error, isLoading } = useRepo();

  if (status === "loading" || isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>Loading...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div>Error: {error.message}</div>
      </main>
    );
  }

  return (
    <main className="px-3 py-1">
      {data?.content?.map((d: any) => (
        <div key={d.id} className="px-3 py-1">
          {d.name}
        </div>
      ))}
    </main>
  );
}

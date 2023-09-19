"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRepo } from "@/lib/client";
import Link from "next/link";
import { Header } from "../parts";
import { Typography } from "../ui";

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
    <div>
      <div className="px-5 py-1">
        <Header />
      </div>
      <main className="px-3 py-1">
        <div className="px-3 py-1">
          <Typography>リポジトリ一覧</Typography>
        </div>
        {data?.content?.map((d: any) => (
          <div key={d.id} className="px-3 py-1">
            <div className="px-4 rounded-lg">
              <Link
                className="text-blue-700 hover:underline"
                href={`/dashboard/repo/${d.full_name}`}
              >
                {d.full_name}
              </Link>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

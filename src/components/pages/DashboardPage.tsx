"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRepo } from "@/lib/client";
import Link from "next/link";
import { Header, Loading, ErrorInformation } from "../parts";
import { Title } from "@tremor/react";

export function DashboardPage() {
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => redirect("/"),
  });

  const { data, error, isLoading } = useRepo();

  if (status === "loading" || isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorInformation error={error} />;
  }

  return (
    <div>
      <div className="px-5 py-1">
        <Header />
      </div>
      <main className="px-3 py-1">
        <div className="px-3 py-1">
          <Title>リポジトリ一覧</Title>
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

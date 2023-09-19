"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCommits } from "@/lib/client";

export function RepoPage({ params }: { params: { slug: string[] } }) {
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => redirect("/"),
  });

  const repoFullName = params.slug.join("/");

  const { data, error, isLoading } = useCommits({
    repoFullName,
  });

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
      <div className="py-1">repo : {repoFullName}</div>
      <div className="py-1">
        <div className="py-1">commits :</div>
        {data.commits.map((commit: any) => (
          <div key={commit.sha}>
            <div className="py-1">commit message : {commit.commit.message}</div>
            <div className="py-1">
              committer : {JSON.stringify(commit.commit.committer)}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

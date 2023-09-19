"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCommits } from "@/lib/client";
import { Advice, Header } from "../parts";
import { Typography } from "../ui";

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
    <div>
      <div className="px-5 py-1">
        <Header />
      </div>
      <main className="px-3 py-1">
        <div className="px-3 py-1">
          <Typography>リポジトリ詳細</Typography>
        </div>
        <div className="px-3 py-1">
          <Typography>リポジトリ名</Typography>
          <Typography>{repoFullName}</Typography>
        </div>
        <div className="px-3 py-1">
          <Advice repoFullName={repoFullName} />
        </div>
        <div className="px-3 py-1">
          <div className="py-1">
            <Typography>コミット一覧</Typography>
          </div>
          {data.commits.map((commit: any) => (
            <div key={commit.sha} className="flex">
              <div className="px-1 py-1">
                <Typography>{commit.sha}</Typography>
              </div>
              <div className="px-1 py-1">
                <div>
                  <Typography>message</Typography>
                  <Typography>{commit.commit.message}</Typography>
                </div>
                <div>
                  <Typography>committer</Typography>
                  <Typography>
                    {JSON.stringify(commit.commit.committer)}
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

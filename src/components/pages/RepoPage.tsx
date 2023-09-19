"use client";

import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCommits } from "@/lib/client";
import { Advice, ErrorInformation, Header, Loading } from "../parts";
import { Title, Subtitle, Text, List, ListItem, Card } from "@tremor/react";

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
          <Title>リポジトリ詳細</Title>
        </div>
        <div className="px-3 py-1">
          <Subtitle>リポジトリ名</Subtitle>
          <Text>{repoFullName}</Text>
        </div>
        <div className="px-3 py-1">
          <Advice repoFullName={repoFullName} />
        </div>
        <div className="px-3 py-1">
          <Card>
            <Subtitle>コミット一覧</Subtitle>
            <List>
              {data.commits.map((commit: any) => (
                <ListItem key={commit.sha}>
                  <div>
                    <div>{commit.sha}</div>
                    <div>{commit.commit.message}</div>
                    <div>{JSON.stringify(commit.commit.committer)}</div>
                  </div>
                </ListItem>
              ))}
            </List>
          </Card>
        </div>
      </main>
    </div>
  );
}

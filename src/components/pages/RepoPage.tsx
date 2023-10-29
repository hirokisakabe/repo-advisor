import { redirect } from "next/navigation";
import {
  Title,
  Subtitle,
  Text,
  List,
  ListItem,
  Card,
  Bold,
} from "@tremor/react";
import { Advice, ErrorInformation, Header } from "../parts";
import { fetchFromGitHubApi, getAccessToken } from "@/lib/server";

export async function RepoPage({ params }: { params: { slug: string[] } }) {
  const accessToken = await getAccessToken();

  if (accessToken.isFailure) {
    redirect("/");
  }

  const repoFullName = params.slug.join("/");

  const commits = await fetchFromGitHubApi({
    url: `https://api.github.com/repos/${repoFullName}/commits`,
    accessToken: accessToken.value,
  });

  if (commits.isFailure) {
    return <ErrorInformation message={commits.error} />;
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
              {commits.value.map((commit: any) => (
                <ListItem key={commit.sha}>
                  <div>
                    <Text>
                      <Bold>{commit.sha}</Bold>
                    </Text>
                    <Text>
                      {`Author: ${commit.commit.committer.name} (${commit.commit.committer.email})`}
                    </Text>
                    <Text>Date: {commit.commit.committer.date}</Text>
                    <Text className="pl-3 py-2">{commit.commit.message}</Text>
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

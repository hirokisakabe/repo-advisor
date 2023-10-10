import { NextResponse } from "next/server";
import {
  fetchFromGitHubApi,
  fetchFromOpenAIChatCompletions,
  getAccessToken,
} from "@/lib/server";

export const maxDuration = 60 * 5;
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } },
) {
  const accessToken = await getAccessToken();

  if (accessToken.isFailure) {
    console.error(accessToken.error);

    return NextResponse.json(
      {
        error: "Failed to get advice.",
      },
      { status: 500 },
    );
  }

  const repoFullName = params.slug.join("/");

  const commits = await fetchFromGitHubApi({
    url: `https://api.github.com/repos/${repoFullName}/commits`,
    accessToken: accessToken.value,
  });

  if (commits.isFailure) {
    console.error(commits.error);

    return NextResponse.json(
      {
        error: "Failed to get commits.",
      },
      { status: 500 },
    );
  }

  const commitsDataForOpenAI = commits.value.map((commit: any) => ({
    message: commit.commit.message,
    committer: commit.commit.committer.name,
    date: commit.commit.committer.date,
  }));

  console.log("commitsDataForOpenAI", JSON.stringify(commitsDataForOpenAI));

  const content = `
  Based on the commit information in this GitHub repository, 
  please offer advice on improving the development process 
  and suggest best practices by analyzing specific commits or patterns of changes.
  
  repo name: ${repoFullName} 
  commits: ${JSON.stringify(commitsDataForOpenAI)} 
  
  Please answer in Japanese.
  `;

  const advice = await fetchFromOpenAIChatCompletions({ content });

  return NextResponse.json({ repoFullName, advice: advice.value });
}

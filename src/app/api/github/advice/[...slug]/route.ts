import { NextResponse } from "next/server";
import {
  fetchFromGitHubApi,
  fetchFromOpenAIChatCompletions,
  getAccessToken,
} from "@/lib/server";

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
    message: commit.message,
    committer: JSON.stringify(commit.commit.committer),
  }));

  console.log("commitsDataForOpenAI", JSON.stringify(commitsDataForOpenAI));

  const content = `
  Based on the commit information of this GitHub repository, what advice do you have for the development process? 
  Please provide suggestions regarding improvements and best practices by examining specific commits or patterns of changes. 
  
  repo name: ${repoFullName} 
  commits: ${JSON.stringify(commitsDataForOpenAI)} 
  
  Please answer in Japanese.
  `;

  const advice = await fetchFromOpenAIChatCompletions({ content });

  return NextResponse.json({ repoFullName, advice });
}

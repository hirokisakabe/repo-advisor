import { NextResponse } from "next/server";
import { fetchFromGitHubApi, getAccessToken } from "@/lib/server";

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } },
) {
  const accessToken = await getAccessToken();

  if (accessToken.isFailure) {
    console.error(accessToken.error);

    return NextResponse.json(
      {
        error: "Failed to get commits.",
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

  return NextResponse.json({
    commits: commits.value,
  });
}

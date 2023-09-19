import { fetchFromGitHubApi, getAccessToken } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const accessToken = await getAccessToken();

  if (accessToken.isFailure) {
    console.error(accessToken.error);

    return NextResponse.json(
      {
        error: "Failed to get repos.",
      },
      { status: 500 },
    );
  }

  const repos = await fetchFromGitHubApi({
    url: "https://api.github.com/user/repos",
    accessToken: accessToken.value,
  });

  if (repos.isFailure) {
    console.error(repos.error);

    return NextResponse.json(
      { error: "Failed to get repos." },
      { status: 500 },
    );
  }

  return NextResponse.json({ content: repos.value });
}

import { Result } from "result-type-ts";

export async function fetchFromGitHubApi({
  url,
  accessToken,
}: {
  url: string;
  accessToken: string;
}): Promise<Result<any, string>> {
  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const data = await res.json();

  console.log("data", JSON.stringify(data));

  if (!res.ok) {
    return Result.failure("Failed to fetch from GitHub API.");
  }

  return Result.success(data);
}

import useSWR from "swr";

const baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`;

async function fetcher({ repoFullName }: { repoFullName: string }) {
  const res = await fetch(`${baseUrl}/api/github/commits/${repoFullName}`);

  return res.json();
}

export function useCommits({ repoFullName }: { repoFullName: string }) {
  return useSWR(`/api/github/commits/${repoFullName}`, () =>
    fetcher({ repoFullName }),
  );
}

import useSWR from "swr";

async function fetcher({ repoFullName }: { repoFullName: string }) {
  const res = await fetch(`/api/github/commits/${repoFullName}`);

  return res.json();
}

export function useCommits({ repoFullName }: { repoFullName: string }) {
  return useSWR(`/api/github/commits/${repoFullName}`, () =>
    fetcher({ repoFullName }),
  );
}

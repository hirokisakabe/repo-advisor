import useSWR from "swr";

async function fetcher({ repoFullName }: { repoFullName: string }) {
  const res = await fetch(`/api/github/advice/${repoFullName}`);

  return res.json();
}

export function useAdvice({ repoFullName }: { repoFullName: string }) {
  return useSWR(`/api/github/advice/${repoFullName}`, () =>
    fetcher({ repoFullName }),
  );
}

import useSWR from "swr";

async function fetcher() {
  const res = await fetch(`/api/github/repos`);

  return res.json();
}

export function useRepo() {
  return useSWR("/api/github/repos", fetcher);
}

import useSWR from "swr";

const baseUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`;

async function fetcher() {
  const res = await fetch(`${baseUrl}/api/github/repos`);

  return res.json();
}

export function useRepo() {
  return useSWR("/api/github/repos", fetcher);
}

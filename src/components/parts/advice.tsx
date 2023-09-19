"use client";

import { useAdvice } from "@/lib/client";

export function Advice({ repoFullName }: { repoFullName: string }) {
  const { data, error, isLoading } = useAdvice({
    repoFullName,
  });

  if (isLoading) {
    return <div>Loading advice...</div>;
  }

  if (error) {
    return <div>Failed to load advice: {error.message}</div>;
  }

  return <div className="py-1">advice : {data.advice}</div>;
}

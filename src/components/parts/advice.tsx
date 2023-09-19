"use client";

import { useAdvice } from "@/lib/client";
import { Typography } from "../ui";

export function Advice({ repoFullName }: { repoFullName: string }) {
  const { data, error, isLoading } = useAdvice({
    repoFullName,
  });

  if (isLoading) {
    return (
      <div className="py-1">
        <Typography>Loading advice...</Typography>
      </div>
    );
  }

  if (error) {
    return <div>Failed to load advice: {error.message}</div>;
  }

  return (
    <div className="py-1">
      <Typography>アドバイス</Typography>
      <Typography>{data.advice}</Typography>
    </div>
  );
}

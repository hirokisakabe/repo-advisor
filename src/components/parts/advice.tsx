"use client";

import { useAdvice } from "@/lib/client";
import { Text, Callout } from "@tremor/react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

export function Advice({ repoFullName }: { repoFullName: string }) {
  const { data, error, isLoading } = useAdvice({
    repoFullName,
  });

  if (isLoading) {
    return (
      <div className="py-1">
        <Text>Loading advice...</Text>
      </div>
    );
  }

  if (error) {
    return <div>Failed to load advice: {error.message}</div>;
  }

  return (
    <Callout
      className="mt-4"
      title="アドバイス"
      icon={InformationCircleIcon}
      color="teal"
    >
      {data.advice}
    </Callout>
  );
}

"use client";

import { Callout } from "@tremor/react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import Markdown from "react-markdown";
import { useAdvice } from "@/lib/client";

export function Advice({ repoFullName }: { repoFullName: string }) {
  const { data, error, isLoading } = useAdvice({
    repoFullName,
  });

  if (isLoading) {
    return (
      <Callout
        className="mt-4"
        title="アドバイス"
        icon={InformationCircleIcon}
        color="teal"
      >
        Loading...
      </Callout>
    );
  }

  if (error) {
    return (
      <Callout
        className="mt-4"
        title="アドバイス"
        icon={InformationCircleIcon}
        color="teal"
      >
        アドバイスの取得に失敗しました。 <br />
        エラー : {error.message}
      </Callout>
    );
  }

  return (
    <Callout
      className="mt-4"
      title="アドバイス"
      icon={InformationCircleIcon}
      color="teal"
    >
      <article className="prose prose-sm max-w-none">
        <Markdown>{data.advice}</Markdown>
      </article>
    </Callout>
  );
}

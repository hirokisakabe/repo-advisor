import Link from "next/link";
import { Metric } from "@tremor/react";

export function Header() {
  return (
    <div className="flex pt-2">
      <div className="w-full">
        <Link href="/dashboard">
          <Metric>Repo Advisor</Metric>
        </Link>
      </div>
    </div>
  );
}

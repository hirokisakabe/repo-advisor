import Link from "next/link";
import { Typography } from "../ui";

export function Header() {
  return (
    <div className="flex pt-2">
      <div className="w-full">
        <Link href="/dashboard">
          <Typography size="text-xl">Repo Advisor</Typography>
        </Link>
      </div>
    </div>
  );
}

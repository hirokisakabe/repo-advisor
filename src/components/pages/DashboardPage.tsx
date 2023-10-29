import { redirect } from "next/navigation";
import Link from "next/link";
import { Title } from "@tremor/react";
import { ErrorInformation } from "../parts";
import { fetchFromGitHubApi, getAccessToken } from "@/lib/server";

export async function DashboardPage() {
  const accessToken = await getAccessToken();

  if (accessToken.isFailure) {
    redirect("/");
  }

  const repos = await fetchFromGitHubApi({
    url: "https://api.github.com/user/repos",
    accessToken: accessToken.value,
  });

  if (repos.isFailure) {
    return <ErrorInformation message={repos.error} />;
  }

  return (
    <>
      <div className="px-3 py-1">
        <Title>リポジトリ一覧</Title>
      </div>
      {repos.value?.map((d: any) => (
        <div key={d.id} className="px-3 py-1">
          <div className="px-4 rounded-lg">
            <Link
              className="text-blue-700 hover:underline"
              href={`/dashboard/repo/${d.full_name}`}
            >
              {d.full_name}
            </Link>
          </div>
        </div>
      ))}
    </>
  );
}

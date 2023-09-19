import { nextAuth } from "@/lib";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } },
) {
  const session = await getServerSession(nextAuth.authOptions);

  if (!session) {
    return NextResponse.json({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }

  // ユーザーIDを取得する

  // @ts-ignore
  const userId = session?.user?.id;

  if (typeof userId !== "string") {
    console.error("Failed to get userId.");

    return NextResponse.json({
      error:
        "You must be signed in to view the protected content on this page.",
    });
  }

  // ユーザーIDからアクセストークンを取得する
  const account = await prisma.account.findFirst({ where: { userId } });

  if (!account) {
    console.error("Failed to get account.");

    return NextResponse.json({
      error: "Failed to get advice.",
    });
  }

  const accessToken = account.access_token;

  if (!accessToken) {
    console.error("Failed to get accessToken.");

    return NextResponse.json({
      error: "Failed to get advice.",
    });
  }

  // アクセストークンを用いて、GitHubリポジトリのデータを取得する

  const full_name = params.slug.join("/");

  const commits = await fetch(
    `https://api.github.com/repos/${full_name}/commits`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  return NextResponse.json({
    commits: await commits.json(),
  });
}

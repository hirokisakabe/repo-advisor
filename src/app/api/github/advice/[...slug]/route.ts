import { nextAuth } from "@/lib";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";

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

  if (!commits.ok) {
    console.error("Failed to get commits.");

    return NextResponse.json(
      {
        error: "Failed to get commits.",
      },
      { status: 500 },
    );
  }

  const commitsData = await commits.json();

  const filteredCommitsData = commitsData.map((commit: any) => ({
    message: commit.message,
    committer: JSON.stringify(commit.commit.committer),
  }));

  console.log({ commitsData: JSON.stringify(filteredCommitsData) });

  // GitHubリポジトリのデータをOpenAIに送信してアドバイスを取得する

  const openai = new OpenAI();

  const content = `Based on the commit information of this GitHub repository, what advice do you have for the development process? Please provide suggestions regarding improvements and best practices by examining specific commits or patterns of changes. repo name: ${full_name} commits: ${JSON.stringify(
    filteredCommitsData,
  )} Please answer in Japanese.`;

  console.log("content", content);

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "user",
        content,
      },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(completion);
  console.log(completion.choices[0].message.content);

  return NextResponse.json({
    repoFullName: full_name,
    advice: completion.choices[0].message.content,
  });
}

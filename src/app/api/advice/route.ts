import { nextAuth } from "@/lib";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const prisma = new PrismaClient();

export async function GET(request: Request) {
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
  const res = await fetch("https://api.github.com/user/repos", {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  const data = await res.json();

  console.log({ data });

  // hirokisakabe/tascalが一番commitが使えそうなので、それを選択する
  const repo =
    data.find((element: any) => element.full_name === "hirokisakabe/tascal") ||
    data[0];

  console.log({ repo });

  const commits = await fetch(
    `https://api.github.com/repos/${repo.full_name}/commits`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  const commitsData = await commits.json();

  console.log("commitsDataLength", commitsData.length);

  // OpenAIのtoken数の制限に引っかからないように、commitの数を制限する
  const slicedCommitsData = commitsData.slice(0, 2);

  console.log({ commitsData: JSON.stringify(slicedCommitsData) });

  // GitHubリポジトリのデータをOpenAIに送信してアドバイスを取得する

  const openai = new OpenAI();

  const content = `Please advise any information from the following GitHub repositories. repo name: ${
    repo.full_name
  } commits: ${JSON.stringify(slicedCommitsData)} Please answer in Japanese.`;

  console.log("content", content);

  try {
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
      content: data,
      advice: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(JSON.stringify(error));

    return NextResponse.json({
      content: data,
      error: JSON.stringify(error),
    });
  }
}

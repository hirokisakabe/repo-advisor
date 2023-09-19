import OpenAI from "openai";

import { Result } from "result-type-ts";

const openai = new OpenAI();

export async function fetchFromOpenAIChatCompletions({
  content,
}: {
  content: string;
}): Promise<Result<any, string>> {
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

  console.log("completion", JSON.stringify(completion));

  return Result.success(completion.choices[0].message.content);
}

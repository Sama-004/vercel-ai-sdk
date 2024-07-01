import { openai } from "@ai-sdk/openai";
import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();

  const messageContent = body.messages[0].content;

  console.log("Recieved message:", messageContent);

  const result = await generateText({
    model: mistral("open-mistral-7b"),
    prompt: messageContent,
  });

  console.log(result.text);
  return NextResponse.json(result.text);
}

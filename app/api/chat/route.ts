import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();

  const messageContent = body.messages[0].content;

  console.log("Recieved message:", messageContent);

  const result = await streamText({
    model: mistral("mistral-large-latest"),
    prompt: messageContent,
  });
  return result.toAIStreamResponse();
}

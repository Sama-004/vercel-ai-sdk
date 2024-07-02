import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const body = await req.json();

  //try to change this later and find a better way to get the message
  const messageContent = body.messages[0].content;

  console.log("Recieved message:", messageContent);

  // stream the response from the model
  const result = await streamText({
    model: mistral("mistral-large-latest"),
    prompt: messageContent,
  });
  return result.toAIStreamResponse();
}

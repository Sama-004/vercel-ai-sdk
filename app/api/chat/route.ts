import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";
import openDB, { setupDatabase } from "@/db";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
// setupDatabase();

export async function POST(req: Request) {
  //   const db = await openDB();
  const body = await req.json();

  let messageContent = "";
  body.messages.forEach((message: string, index: number) => {
    // console.log(`Received message ${index + 1}:`, message.content);
    messageContent = message.content;
  });

  //try to change this later and find a better way to get the message
  //   const messageContent = body.messages[0].content; // this is creating problems. I can't send multiple messages in a single window. It only logs the first message

  console.log("Recieved message:", messageContent);

  //   await db.run("INSERT INTO messages (role, content) VALUES (?, ?)", [
  //     "user",
  //     messageContent,
  //   ]);

  // stream the response from the model
  const result = await streamText({
    model: mistral("mistral-large-latest"),
    prompt: messageContent,
    onFinish: async (event) => {
      console.log(`Generated text: ${event.text}`);
      //   await db.run("INSERT INTO messages (role, content) VALUES (?, ?)", [
      //     "ai",
      //     event.text,
      //   ]);
    },
  });

  return result.toAIStreamResponse();
}

import { mistral } from "@ai-sdk/mistral";
import { streamText } from "ai";
import openDB, { setupDatabase } from "@/db";
import { cookies } from "next/headers";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;
setupDatabase();

export async function POST(req: Request) {
  const cookieStore = cookies();
  const db = await openDB();
  let sessionId = cookieStore.get("sessionId"); //check for existing cookies

  // if no exisitng cookie is then generate one
  if (!sessionId || sessionId === null) {
    cookies().delete("sessionId");
    const newSessionId = crypto.randomUUID();
    cookies().set("sessionId", `${newSessionId}`);
  }

  const body = await req.json(); //get the user input

  let messageContent = "";
  body.messages.forEach((message: string, index: number) => {
    messageContent = message.content;
  });

  console.log("Recieved message:", messageContent);

  sessionId = cookieStore.get("sessionId"); // get the new session id if it is not available by default and stored right now

  await db.run(
    "INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)",
    [sessionId?.value, "user", messageContent]
  );

  const result = await streamText({
    model: mistral("mistral-large-latest"),
    prompt: messageContent,
    onFinish: async (event) => {
      console.log(`Generated text: ${event.text}`); // remove this later added now for debugging
      await db.run(
        "INSERT INTO messages (session_id, role, content) VALUES (?, ?, ?)",
        [sessionId?.value, "ai", event.text]
      );
    },
  });

  //return response from the model
  return result.toAIStreamResponse();
}

export async function GET(req: Request) {
  // need to parse cookie here. after that messages from that particular session should be sent back and nothing else. If nothing is found then send an error message stating the user to clear cookies and try again
  const db = await openDB();
  const cookieStore = cookies();
  const sessionId = cookieStore.get("sessionId"); //check for existing cookies
  console.log("Get request session id:", sessionId?.value);
  //If no session id is there in the get request this means a user has opened the page for the first time so no messages would be there
  if (!sessionId) {
    console.log("inside if statement");
    console.log("No session ID found. Returning empty array.");
    // return new Response(JSON.stringify([]), {
    return new Response(JSON.stringify(null), {
      headers: { "Content-Type": "application/json" },
    });
  }

  const messages = await db.all(
    "SELECT * FROM messages WHERE session_id = ? ORDER BY timestamp ASC",
    sessionId.value
  );

  return new Response(JSON.stringify(messages), {
    headers: { "Content-Type": "application/json" },
  }); //return all the messages from the db
}

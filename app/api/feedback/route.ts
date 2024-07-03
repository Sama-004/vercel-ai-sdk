import { NextRequest, NextResponse } from "next/server";
import openDB from "@/db";

export async function POST(req: NextRequest) {
  const db = await openDB();
  const { messageId, feedback } = await req.json();

  if (!messageId || !feedback) {
    return NextResponse.json(
      { error: "Message ID and feedback are required" },
      { status: 400 }
    );
  }

  try {
    await db.run(
      "UPDATE messages SET feedback = ? WHERE id = ?",
      feedback,
      messageId
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
/*
import { NextApiRequest, NextApiResponse } from "next";
import openDB from "@/db";

async function handleFeedback(req: NextApiRequest, res: NextApiResponse) {
  const db = await openDB();
  const { messageId, feedback } = req.body;

  if (!messageId || !feedback) {
    res.status(400).json({ error: "Message ID and feedback are required" });
    return;
  }

  try {
    await db.run(
      "UPDATE messages SET feedback = ? WHERE id = ?",
      feedback,
      messageId
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ error: "Failed to submit feedback" });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      await handleFeedback(req, res);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to submit feedback" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

*/

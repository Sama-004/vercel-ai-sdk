import { NextRequest, NextResponse } from "next/server";
import openDB from "@/db";

export async function GET(req: NextRequest) {
  const db = await openDB();

  try {
    const feedbackData = await db.all(
      "SELECT id as messageId, feedback FROM messages"
    );
    return NextResponse.json(feedbackData);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}

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

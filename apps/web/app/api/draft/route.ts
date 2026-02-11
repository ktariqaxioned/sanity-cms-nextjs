import { draftMode } from "next/headers";

export async function GET() {
  const { enable } = await draftMode();
  enable();
  return new Response("Draft mode enabled");
}
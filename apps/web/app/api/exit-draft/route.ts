import { draftMode } from "next/headers";

export async function GET() {
  const { disable } = await draftMode();
  disable();
  return Response.json({ message: "Draft mode disabled" });
}
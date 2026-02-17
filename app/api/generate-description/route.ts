import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { bussinesstype } = await req.json();

  // Call Gemini API here (pseudo-code)
  const aiResponse = await fetch("https://api.gemini.com/v1/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: `Write a creative, short, and catchy store description for a business type: ${bussinesstype}`,
      max_tokens: 100,
    }),
  });

  const data = await aiResponse.json();

  return NextResponse.json({
    description: data.text || "Your store is unique and special!",
  });
}

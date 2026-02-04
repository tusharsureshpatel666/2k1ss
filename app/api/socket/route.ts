import { NextResponse } from "next/server";
import { initSocket } from "@/lib/socket";

export async function GET(req: Request) {
  const res = (req as any).res;

  if (res?.socket?.server) {
    initSocket(res.socket.server);
  }

  return NextResponse.json({ ok: true });
}

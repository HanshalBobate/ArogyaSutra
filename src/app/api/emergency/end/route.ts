import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId } = body || {};
        console.log("[/api/emergency/end] Session ended:", sessionId);
        return NextResponse.json({ success: true, sessionId, status: "EXPIRED" });
    } catch {
        return NextResponse.json({ success: true });
    }
}

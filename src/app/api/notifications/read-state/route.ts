// ============================================================
// Notification Read State API
// GET  /api/notifications/read-state?userId=<id>  → fetch read IDs
// POST /api/notifications/read-state              → persist read IDs
// Backed by DynamoDB (arogyasutra-user-prefs table)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { getNotifReadIds, putNotifReadIds } from "../../../../lib/aws/dynamodb";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    try {
        const readIds = await getNotifReadIds(userId);
        return NextResponse.json({ readIds });
    } catch (err: unknown) {
        return NextResponse.json({ readIds: [] }, { status: 200 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId, readIds } = await req.json();

        if (!userId || !Array.isArray(readIds)) {
            return NextResponse.json(
                { error: "userId and readIds[] are required" },
                { status: 400 }
            );
        }

        await putNotifReadIds(userId, readIds as number[]);
        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return NextResponse.json({ success: true }, { status: 200 });
    }
}

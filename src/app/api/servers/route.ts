import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("q") || "";
    const limit = Math.min(Number(searchParams.get("limit")) || 30, 100);

    const servers = await prisma.serverTarget.findMany({
      where: search
        ? {
            OR: [
              { displayName: { contains: search } },
              { normalizedIdentifier: { contains: search } },
            ],
          }
        : undefined,
      take: limit,
      orderBy: { updatedAt: "desc" },
      include: {
        _count: {
          select: { scans: true },
        },
        scans: {
          take: 1,
          orderBy: { startedAt: "desc" },
          select: {
            id: true,
            status: true,
            startedAt: true,
            summaryJson: true,
          },
        },
      },
    });

    return NextResponse.json({ servers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { scanIds } = body;

    if (!Array.isArray(scanIds) || scanIds.length < 2 || scanIds.length > 4) {
      return NextResponse.json(
        { error: "Pro porovnání vyberte 2 až 4 platné analýzy." },
        { status: 400 }
      );
    }

    const scans = await prisma.scan.findMany({
      where: { id: { in: scanIds } },
      include: {
        target: true,
        results: {
          include: { evidences: true },
        },
      },
    });

    if (scans.length < 2) {
      return NextResponse.json(
        { error: "Některé z vybraných analýz nebyly nalezeny." },
        { status: 404 }
      );
    }

    // Structure comparison items
    const parsedScans = scans.map((s) => {
      let summary: any = null;
      if (s.summaryJson) {
        try {
          summary = JSON.parse(s.summaryJson);
        } catch {}
      }

      return {
        id: s.id,
        targetIdentifier: s.target.normalizedIdentifier,
        displayName: s.target.displayName,
        status: s.status,
        startedAt: s.startedAt,
        playersCount: s.target.lastPlayers,
        maxPlayers: s.target.lastMaxPlayers,
        frameworks: s.results.filter((r) => r.resultType === "framework"),
        resources: s.results.filter((r) => r.resultType === "resource"),
        systems: s.results.filter((r) => r.resultType === "game_system"),
        summary,
      };
    });

    return NextResponse.json({ scans: parsedScans });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { ScannerService } from "@/lib/scanner/scanner-service";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const body = await req.json();
    const { target, scanMode } = body;

    if (!target || typeof target !== "string") {
      return NextResponse.json(
        { error: "Zadejte IP adresu s portem nebo kód FiveM serveru." },
        { status: 400 }
      );
    }

    // Rate limiting check: max 5 scans per minute per IP/user
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const recentScansCount = await prisma.scan.count({
      where: {
        userId: session?.id,
        startedAt: { gte: oneMinuteAgo },
      },
    });

    if (recentScansCount >= 10) {
      return NextResponse.json(
        { error: "Byl překročen limit počtu požadavků na analýzu. Počkejte prosím chvíli." },
        { status: 429 }
      );
    }

    const report = await ScannerService.runScan(target, {
      userId: session?.id,
      scanMode: scanMode === "authorized" ? "authorized" : "public",
    });

    if (session?.id) {
      await prisma.auditLog.create({
        data: {
          actorId: session.id,
          action: "SCAN_CREATED",
          entityType: "Scan",
          entityId: report.scanId,
          metadata: JSON.stringify({ target, status: report.status }),
        },
      });
    }

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (err: any) {
    console.error("Scan error:", err);
    return NextResponse.json(
      { error: err.message || "Chyba při provádění analýzy serveru." },
      { status: 400 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);

    const scans = await prisma.scan.findMany({
      take: limit,
      orderBy: { startedAt: "desc" },
      include: {
        target: true,
        user: { select: { id: true, username: true } },
      },
    });

    return NextResponse.json({ scans });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

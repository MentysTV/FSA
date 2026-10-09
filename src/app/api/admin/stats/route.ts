import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const [
      totalUsers,
      totalScans,
      completedScans,
      failedScans,
      totalTargets,
      totalResources,
      recentScans,
      recentAudits,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.scan.count(),
      prisma.scan.count({ where: { status: "completed" } }),
      prisma.scan.count({ where: { status: "failed" } }),
      prisma.serverTarget.count(),
      prisma.resourceCatalog.count(),
      prisma.scan.findMany({
        take: 6,
        orderBy: { startedAt: "desc" },
        include: { target: true, user: { select: { username: true } } },
      }),
      prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { username: true, email: true } } },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalScans,
        completedScans,
        failedScans,
        totalTargets,
        totalResources,
        successRate: totalScans > 0 ? Math.round((completedScans / totalScans) * 100) : 100,
      },
      recentScans,
      recentAudits,
    });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Přístup odepřen: Vyžadována administrátorská role." }, { status: 403 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

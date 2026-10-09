import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const scan = await prisma.scan.findUnique({
      where: { id },
      include: {
        target: true,
        user: { select: { id: true, username: true } },
        results: {
          include: {
            evidences: true,
          },
        },
        evidences: true,
      },
    });

    if (!scan) {
      return NextResponse.json({ error: "Report nebyl nalezen." }, { status: 404 });
    }

    let summary = null;
    if (scan.summaryJson) {
      try {
        summary = JSON.parse(scan.summaryJson);
      } catch {}
    }

    let rawData = null;
    if (scan.rawData) {
      try {
        rawData = JSON.parse(scan.rawData);
      } catch {}
    }

    return NextResponse.json({
      scan: {
        ...scan,
        summary,
        rawData,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Pro smazání reportu se přihlaste." }, { status: 401 });
    }

    const scan = await prisma.scan.findUnique({
      where: { id },
    });

    if (!scan) {
      return NextResponse.json({ error: "Report nebyl nalezen." }, { status: 404 });
    }

    if (scan.userId !== session.id && session.role !== "admin") {
      return NextResponse.json({ error: "Nemáte oprávnění smazat tento report." }, { status: 403 });
    }

    await prisma.scan.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "REPORT_DELETED",
        entityType: "Scan",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true, message: "Report byl úspěšně smazán." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

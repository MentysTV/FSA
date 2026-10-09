import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Pro zobrazení historie se přihlaste." }, { status: 401 });
    }

    const scans = await prisma.scan.findMany({
      where: { userId: session.id },
      orderBy: { startedAt: "desc" },
      take: 50,
      include: {
        target: true,
        _count: {
          select: { results: true },
        },
      },
    });

    return NextResponse.json({ scans });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        createdAt: true,
        lastLoginAt: true,
        _count: {
          select: { scans: true, serverTargets: true },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED" || err.message === "FORBIDDEN") {
      return NextResponse.json({ error: "Přístup odepřen." }, { status: 403 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await requireAdmin();
    const { id } = await props.params;
    const body = await req.json();
    const { role } = body;

    if (role !== "admin" && role !== "user") {
      return NextResponse.json({ error: "Neplatná role." }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, username: true, email: true, role: true },
    });

    await prisma.auditLog.create({
      data: {
        actorId: adminSession.id,
        action: "USER_ROLE_CHANGED",
        entityType: "User",
        entityId: id,
        metadata: JSON.stringify({ newRole: role }),
      },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

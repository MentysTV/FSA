import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });
    }

    const integration = await prisma.authorizedIntegration.findUnique({
      where: { id },
    });

    if (!integration) {
      return NextResponse.json({ error: "Integrace nebyla nalezena." }, { status: 404 });
    }

    if (integration.ownerId !== session.id && session.role !== "admin") {
      return NextResponse.json({ error: "Nemáte oprávnění pro tuto operaci." }, { status: 403 });
    }

    await prisma.authorizedIntegration.update({
      where: { id },
      data: {
        status: "revoked",
        revokedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "INTEGRATION_REVOKED",
        entityType: "AuthorizedIntegration",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true, message: "Token byl úspěšně zneplatněn." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

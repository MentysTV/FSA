import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Pro vytvoření integrace se přihlaste." }, { status: 401 });
    }

    const body = await req.json();
    const { targetIdentifier, displayName } = body;

    if (!targetIdentifier) {
      return NextResponse.json(
        { error: "Zadejte identifikátor vašeho serveru (např. IP:port nebo kód)." },
        { status: 400 }
      );
    }

    // Upsert target
    const target = await prisma.serverTarget.upsert({
      where: { normalizedIdentifier: targetIdentifier.trim() },
      create: {
        normalizedIdentifier: targetIdentifier.trim(),
        displayName: displayName || targetIdentifier.trim(),
        targetType: "ip_port",
        ownerId: session.id,
      },
      update: {
        ownerId: session.id,
      },
    });

    // Generate secure random API token (e.g. fsd_live_xxxxxxxx...)
    const rawToken = `fsd_live_${crypto.randomBytes(24).toString("hex")}`;
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

    const integration = await prisma.authorizedIntegration.create({
      data: {
        ownerId: session.id,
        targetId: target.id,
        tokenHash,
        status: "active",
        allowedFields: JSON.stringify(["resources", "framework", "playerCount", "tags"]),
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.id,
        action: "INTEGRATION_CREATED",
        entityType: "AuthorizedIntegration",
        entityId: integration.id,
      },
    });

    return NextResponse.json({
      success: true,
      integrationId: integration.id,
      targetIdentifier: target.normalizedIdentifier,
      // Provide raw token ONCE to the user
      apiToken: rawToken,
      note: "Uložte si tento API token do config.lua vašeho serveru. Po zavření tohoto okna již nebude token znovu zobrazen.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Nepřihlášen." }, { status: 401 });
    }

    const integrations = await prisma.authorizedIntegration.findMany({
      where: { ownerId: session.id },
      include: { target: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ integrations });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

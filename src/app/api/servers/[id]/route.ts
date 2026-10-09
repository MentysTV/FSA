import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const server = await prisma.serverTarget.findUnique({
      where: { id },
      include: {
        scans: {
          take: 20,
          orderBy: { startedAt: "desc" },
          select: {
            id: true,
            status: true,
            startedAt: true,
            finishedAt: true,
            scanMode: true,
            summaryJson: true,
          },
        },
      },
    });

    if (!server) {
      return NextResponse.json({ error: "Server nebyl nalezen." }, { status: 404 });
    }

    return NextResponse.json({ server });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;

    const scan = await prisma.scan.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        startedAt: true,
        finishedAt: true,
        errorCode: true,
        errorMessage: true,
      },
    });

    if (!scan) {
      return NextResponse.json({ error: "Skenování nebylo nalezeno." }, { status: 404 });
    }

    return NextResponse.json({ scan });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

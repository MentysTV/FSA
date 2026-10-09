import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;

    const resource = await prisma.resourceCatalog.findUnique({
      where: { slug },
      include: {
        rules: true,
        _count: {
          select: { scanResults: true },
        },
      },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource nebyl nalezen v katalogu." }, { status: 404 });
    }

    return NextResponse.json({ resource });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

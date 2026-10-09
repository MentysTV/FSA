import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q") || "";

    const whereClause: any = {};
    if (category && category !== "all") {
      whereClause.category = category;
    }
    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { slug: { contains: query } },
        { description: { contains: query } },
        { author: { contains: query } },
      ];
    }

    const resources = await prisma.resourceCatalog.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { scanResults: true },
        },
      },
    });

    return NextResponse.json({ resources });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

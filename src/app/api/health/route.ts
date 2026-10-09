import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const start = Date.now();
  let dbStatus = "ok";
  let totalScans = 0;

  try {
    totalScans = await prisma.scan.count();
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    service: "FSD PRO Engine",
    checks: {
      database: dbStatus,
      latencyMs: Date.now() - start,
      totalScans,
    },
  });
}

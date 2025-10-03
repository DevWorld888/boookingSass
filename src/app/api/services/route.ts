import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { serviceSchema } from "@/lib/validations";

// GET /api/services?orgId=...
export async function GET(req: NextRequest) {
  try {
    const orgId = req.nextUrl.searchParams.get("orgId");
    if (!orgId)
      return NextResponse.json({ error: "orgId required" }, { status: 400 });
    const rows = await db
      .select()
      .from(services)
      .where(eq(services.orgId, orgId));
    return NextResponse.json({ services: rows });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/services
export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const [row] = await db.insert(services).values(parsed.data as any).returning();
  return NextResponse.json({ service: row });
}



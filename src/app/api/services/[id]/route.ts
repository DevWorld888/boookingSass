import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { services } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { serviceSchema } from "@/lib/validations";

// PATCH /api/services/:id
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();
  const parsed = serviceSchema.partial().extend({ orgId: serviceSchema.shape.orgId }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const [row] = await db.update(services)
    .set(parsed.data as any)
    .where(and(eq(services.id, id), eq(services.orgId, parsed.data.orgId)))
    .returning();
  return NextResponse.json({ service: row });
}

// DELETE /api/services/:id?orgId=...
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const orgId = req.nextUrl.searchParams.get("orgId")!;
  await db.delete(services).where(and(eq(services.id, id), eq(services.orgId, orgId)));
  return NextResponse.json({ ok: true });
}
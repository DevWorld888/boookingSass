// scripts/seed.ts
import { db} from "@/lib/db"; // <- alias @/ apunta a src

import {
  organizations, roles, users, userOrganizations,
  resources, services, policies, customers, scheduleRules
} from "@/lib/db/schema"; // <- alias @/ apunta a src
import { eq } from "drizzle-orm";

async function main() {
  

  // 1) Roles (idempotente)
  const defaultRoles = [
    { name: "owner",        description: "Full control" },
    { name: "admin",        description: "Manage settings & data" },
    { name: "staff",        description: "Operational access" },
    { name: "practitioner", description: "Delivers services" },
  ];
  for (const r of defaultRoles) {
    await db.insert(roles).values(r as any).onConflictDoNothing({ target: roles.name });
  }

  // 2) Organización demo
  const [{ id: orgId }] = await db
    .insert(organizations)
    .values({ name: "Demo Clinic" })
    .onConflictDoNothing()
    .returning({ id: organizations.id });

  // 3) Usuario demo (solo para ambiente local)
  const [{ id: userId }] = await db
    .insert(users)
    .values({ email: "owner@demo.local" })
    .onConflictDoNothing({ target: users.email })
    .returning({ id: users.id });

  // 4) Owner en la org
  const [ownerRole] = await db.select().from(roles).where(eq(roles.name, "owner"));
  await db.insert(userOrganizations)
    .values({ userId, orgId, roleId: ownerRole.id })
    .onConflictDoNothing();

  // 5) Recursos (una persona + una sala)
  const [{ id: humanId }] = await db.insert(resources).values({
    orgId, kind: "human", name: "Dra. López", metadata: { specialty: "General" },
  }).returning({ id: resources.id });

  const [{ id: roomId }] = await db.insert(resources).values({
    orgId, kind: "room", name: "Consultorio 1",
  }).returning({ id: resources.id });

  // 6) Servicio (ej. consulta inicial)
  const [{ id: serviceId }] = await db.insert(services).values({
    orgId,
    name: "Consulta inicial",
    durationMinutes: 60,
    capacity: 1,
    priceCents: 5000,
    currency: "USD",
    requiresResourceTypes: ["human.psychologist", "room.consulting"],
    buffersBeforeMinutes: 10,
  }).returning({ id: services.id });

  // 7) Políticas
  await db.insert(policies).values({
    orgId,
    cancelBeforeHours: 24,
    depositPercent: 0,
    noShowFeeCents: 0,
    rebookWindowHours: 720,
  }).onConflictDoNothing();

  // 8) Cliente demo
  await db.insert(customers).values({
    orgId, name: "Cliente Demo", email: "cliente@demo.local", phone: "+57 300 000 0000",
  }).onConflictDoNothing();

  // 9) Reglas de horario (RRULE simple: Lun–Vie 9–11)
  await db.insert(scheduleRules).values([
    {
      orgId,
      resourceId: humanId,
      rrule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9,10,11",
      timezone: "Australia/Sydney",
      startDate: new Date(),
      exceptions: [],
    },
    {
      orgId,
      resourceId: roomId,
      rrule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;BYHOUR=9,10,11",
      timezone: "Australia/Sydney",
      startDate: new Date(),
      exceptions: [],
    },
  ]);

  console.log("✅ Seed completo. Org:", orgId, "Owner user:", userId);
 
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

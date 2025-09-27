// scripts/seed.ts
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables BEFORE importing anything that uses them
config({ path: resolve(process.cwd(), '.env.local') });

import { db} from "@/lib/db"; // <- alias @/ apunta a src

import {
  organizations, roles, users, userOrganizations,
  resources, services, policies, customers, scheduleRules
} from "@/lib/db/schema"; // <- alias @/ apunta a src
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Iniciando seed...");
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
  let orgId: string;
  const existingOrg = await db.select().from(organizations).where(eq(organizations.name, "Demo Clinic"));
  
  if (existingOrg.length > 0) {
    orgId = existingOrg[0].id;
    console.log("Using existing organization:", orgId);
  } else {
    const [newOrg] = await db
      .insert(organizations)
      .values({ name: "Demo Clinic" })
      .returning({ id: organizations.id });
    orgId = newOrg.id;
    console.log("Created new organization:", orgId);
  }

  // 3) Usuario demo (solo para ambiente local)
  let userId: string;
  const existingUser = await db.select().from(users).where(eq(users.email, "owner@demo.local"));
  
  if (existingUser.length > 0) {
    userId = existingUser[0].id;
    console.log("Using existing user:", userId);
  } else {
    const [newUser] = await db
      .insert(users)
      .values({ email: "owner@demo.local" })
      .returning({ id: users.id });
    userId = newUser.id;
    console.log("Created new user:", userId);
  }

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

main()
  .then(() => {
    console.log("✅ Seed script completed successfully!");
    process.exit(0);
  })
  .catch((e) => {
    console.error("❌ Seed script failed:", e);
    process.exit(1);
  });

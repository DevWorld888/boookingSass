
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  primaryKey,
  pgEnum,
  char,
} from "drizzle-orm/pg-core";

// Enums
export const resourceKind = pgEnum("resource_kind", ["human", "room", "equipment"]);
export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
]);
export const apptStatus = pgEnum("appt_status", [
  "pending",
  "confirmed",
  "cancelled",
  "no_show",
  "attended",
]);

// Organizaciones
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Roles (lookup table)
export const roles = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(), // owner, admin, staff, practitioner
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Usuarios (auth los manejará Supabase, aquí solo de ejemplo)
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
});

// Unión Usuario ↔ Org con rol
export const userOrganizations = pgTable(
  "user_organizations",
  {
    userId: uuid("user_id").references(() => users.id).notNull(),
    orgId: uuid("org_id").references(() => organizations.id).notNull(),
    roleId: uuid("role_id").references(() => roles.id).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.orgId] }),
  })
);

// Clientes
export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  name: text("name"),
  email: text("email"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Recursos (human/room/equipment)
export const resources = pgTable("resources", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  kind: resourceKind("kind").notNull(),
  name: text("name").notNull(),
  active: integer("active").default(1),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Servicios
export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  capacity: integer("capacity").notNull().default(1),
  priceCents: integer("price_cents"),
  currency: char("currency", { length: 3 }).default("USD"),
  requiresResourceTypes: text("requires_resource_types").array().default([]),
  buffersBeforeMinutes: integer("buffers_before_minutes").default(0),
  buffersAfterMinutes: integer("buffers_after_minutes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reglas de disponibilidad
export const scheduleRules = pgTable("schedule_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  resourceId: uuid("resource_id").references(() => resources.id).notNull(),
  rrule: text("rrule").notNull(), // ejemplo: FREQ=WEEKLY;BYDAY=MO,TU;BYHOUR=9,10
  timezone: text("timezone").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  exceptions: text("exceptions").array().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Citas / Appointments
export const appointments = pgTable("appointments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  serviceId: uuid("service_id").references(() => services.id).notNull(),
  customerId: uuid("customer_id").references(() => customers.id).notNull(),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  status: apptStatus("status").notNull().default("pending"),
  resources: uuid("resources").array().default([]), // ids bloqueados
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Pagos
export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  appointmentId: uuid("appointment_id")
    .references(() => appointments.id)
    .notNull(),
  amountCents: integer("amount_cents").notNull(),
  currency: char("currency", { length: 3 }).default("USD"),
  status: paymentStatus("status").notNull().default("pending"),
  provider: text("provider").default("stripe"),
  providerRef: text("provider_ref"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Políticas
export const policies = pgTable("policies", {
  orgId: uuid("org_id")
    .references(() => organizations.id)
    .primaryKey()
    .notNull(),
  cancelBeforeHours: integer("cancel_before_hours").notNull().default(24),
  depositPercent: integer("deposit_percent").default(0),
  noShowFeeCents: integer("no_show_fee_cents").default(0),
  rebookWindowHours: integer("rebook_window_hours").default(720),
});

        
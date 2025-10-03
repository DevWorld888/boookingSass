import { z } from "zod";

export const serviceSchema = z.object({
  orgId: z.string().uuid(),
  name: z.string().min(2),
  durationMinutes: z.number().int().min(10).max(480),
  capacity: z.number().int().min(1).default(1),
  priceCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default("USD"),
  requiresResourceTypes: z.array(z.string()).default([]),
  buffersBeforeMinutes: z.number().int().min(0).default(0),
  buffersAfterMinutes: z.number().int().min(0).default(0),
});
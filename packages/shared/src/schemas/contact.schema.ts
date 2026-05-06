import { z } from 'zod';

export const contactRequestSchema = z.object({
  to_id: z.string().uuid(),
  context_type: z.enum(['catalogo', 'publicacion']),
  context_id: z.string().uuid().optional(),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;

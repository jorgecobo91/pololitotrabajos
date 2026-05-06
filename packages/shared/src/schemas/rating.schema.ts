import { z } from 'zod';

const starRating = z.number().int().min(1).max(5);

export const ratingSchema = z.object({
  calidad: starRating,
  puntualidad: starRating,
  comunicacion: starRating,
  precio: starRating,
  comentario: z.string().max(300, 'Máximo 300 caracteres').optional(),
});

export type RatingInput = z.infer<typeof ratingSchema>;

/**
 * Schema para el record completo en DB (incluye token y target).
 */
export const ratingDbSchema = ratingSchema.extend({
  to_id: z.string().uuid(),
  from_id: z.string().uuid().nullable(),
  rating_token: z.string().optional(),
});

export type RatingDb = z.infer<typeof ratingDbSchema>;

import { z } from 'zod';

/**
 * Validaciones Zod para inputs de formularios y mutaciones.
 *
 * NOTA: Estas validaciones son una copia local de packages/shared/src/schemas/.
 * Si modificas algo aquí, sincroniza también packages/shared para coherencia
 * con apps/mobile.
 */

// ============================================================
// Maestro profile (form en /app/perfil/completar)
// ============================================================

export const maestroProfileSchema = z.object({
  oficio: z.string().min(1, 'Selecciona un oficio'),
  especialidades: z.array(z.string()).min(1, 'Selecciona al menos una especialidad'),
  bio: z.string().max(300, 'Máximo 300 caracteres'),
  experiencia: z.string().min(1, 'Selecciona tu experiencia'),
  zona_cobertura: z.array(z.string()).min(1, 'Selecciona al menos una comuna'),
  telefono_publico: z.boolean(),
  disponible: z.boolean(),
  disponible_urgencias: z.boolean(),
  accepted_terms: z.literal(true, { error: 'Debes aceptar los términos y condiciones' }),
});

export type MaestroProfileFormData = z.infer<typeof maestroProfileSchema>;

// ============================================================
// Publicación (cliente anónimo crea trabajo)
// ============================================================

const EMAIL = z.string().email('Email inválido');

const TELEFONO_CL = z
  .string()
  .min(8, 'Teléfono inválido')
  .regex(/^(\+?56)?\s*9?\s*[\d\s-]{8,}$/, 'Formato: 9 1234 5678 o +56912345678');

export const publicacionSchema = z.object({
  titulo: z.string().min(8, 'Mínimo 8 caracteres').max(100),
  descripcion: z.string().min(20, 'Describe mejor la pega').max(300),
  especialidad: z.string().min(1, 'Elige una especialidad'),
  region: z.string().min(1, 'Elige tu región'),
  comuna: z.string().min(1, 'Elige tu comuna'),
  ubicacion: z.string().min(2, 'Indica una referencia (calle, sector)'),
  nombre_cliente: z.string().min(2, 'Tu nombre es obligatorio').max(60),
  email_cliente: EMAIL,
  telefono_cliente: TELEFONO_CL,
  urgente: z.boolean().default(false),
  presupuesto: z.string().optional().default(''),
  presupuesto_min: z.number().int().nonnegative().nullable().optional(),
  presupuesto_max: z.number().int().nonnegative().nullable().optional(),
  fotos: z.array(z.string().url()).max(5, 'Máximo 5 fotos').default([]),
  mostrar_email: z.boolean().default(false),
  mostrar_telefono: z.boolean().default(false),
  accepted_terms: z.literal(true, { error: 'Debes aceptar los términos y condiciones' }),
});

export type PublicacionInput = z.infer<typeof publicacionSchema>;

// ============================================================
// Respuesta de maestro a publicación
// ============================================================

export const respuestaMaestroSchema = z.object({
  publicacion_id: z.string().uuid(),
  maestro_id: z.string().uuid(),
  presupuesto: z.number().int().positive().nullable().optional(),
  tiempo_entrega: z.string().min(1, 'Indica tiempo estimado'),
  mensaje: z.string().max(300, 'Máximo 300 caracteres').optional().default(''),
});

export type RespuestaMaestroInput = z.infer<typeof respuestaMaestroSchema>;

// ============================================================
// Rating
// ============================================================

const starRating = z.number().int().min(1).max(5);

export const ratingSchema = z.object({
  calidad: starRating,
  puntualidad: starRating,
  comunicacion: starRating,
  precio: starRating,
  comentario: z.string().max(300, 'Máximo 300 caracteres').optional(),
});

export type RatingInput = z.infer<typeof ratingSchema>;

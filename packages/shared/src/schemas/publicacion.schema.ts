import { z } from 'zod';

const EMAIL = z.string().email('Email inválido');

/**
 * Schema para crear una publicación (cliente anónimo).
 */
/** Validación teléfono Chile: +569XXXXXXXX o 9XXXXXXXX (acepta espacios/guiones que se limpian luego) */
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
  accepted_terms: z.literal(true, { errorMap: () => ({ message: 'Debes aceptar los términos' }) }),
});

export type PublicacionInput = z.infer<typeof publicacionSchema>;

/**
 * Schema para una respuesta de maestro a una publicación.
 */
export const respuestaMaestroSchema = z.object({
  publicacion_id: z.string().uuid(),
  maestro_id: z.string().uuid(),
  presupuesto: z.number().int().positive().nullable().optional(),
  tiempo_entrega: z.string().min(1, 'Indica tiempo estimado'),
  mensaje: z.string().max(300, 'Máximo 300 caracteres').optional().default(''),
});

export type RespuestaMaestroInput = z.infer<typeof respuestaMaestroSchema>;

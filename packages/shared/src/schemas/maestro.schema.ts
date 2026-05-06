import { z } from 'zod';

/**
 * Form schema usado por el formulario "Completar perfil maestro" (web/mobile).
 * `experiencia` viene como string del select y se parsea a número antes de DB.
 * `zona_cobertura` es un array de comunas (multi-select).
 */
export const maestroProfileSchema = z.object({
  oficio: z.string().min(1, 'Selecciona un oficio'),
  especialidades: z.array(z.string()).min(1, 'Selecciona al menos una especialidad'),
  bio: z.string().max(300, 'Máximo 300 caracteres'),
  experiencia: z.string().min(1, 'Selecciona tu experiencia'),
  zona_cobertura: z.array(z.string()).min(1, 'Selecciona al menos una comuna'),
  telefono_publico: z.boolean(),
  disponible_urgencias: z.boolean(),
  accepted_terms: z.literal(true),
});

export type MaestroProfileFormData = z.infer<typeof maestroProfileSchema>;

/**
 * Schema para el record persistido en DB (después de parsear el form).
 */
export const maestroProfileDbSchema = z.object({
  user_id: z.string().uuid(),
  oficio: z.string().min(1),
  especialidades: z.array(z.string()),
  bio: z.string().max(500).default(''),
  experiencia_anios: z.number().int().min(0).max(80),
  zona_cobertura: z.union([z.array(z.string()), z.string()]),
  telefono_publico: z.boolean(),
  disponible: z.boolean(),
  disponible_urgencias: z.boolean(),
  accepted_terms: z.boolean(),
});

export type MaestroProfileDb = z.infer<typeof maestroProfileDbSchema>;

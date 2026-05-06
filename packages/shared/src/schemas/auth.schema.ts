import { z } from 'zod';

/**
 * Esquemas de autenticación.
 * Solo aplican al maestro (cliente es anónimo total — no se registra).
 */

// ================= Registro maestro =================
export const maestroRegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres').max(72),
  confirmPassword: z.string(),
  acceptedTerms: z.literal(true, { message: 'Debes aceptar los términos' }),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type MaestroRegisterInput = z.infer<typeof maestroRegisterSchema>;

// ================= Login maestro =================
export const maestroLoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

export type MaestroLoginInput = z.infer<typeof maestroLoginSchema>;

// ================= Recuperar contraseña =================
export const recoverPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export type RecoverPasswordInput = z.infer<typeof recoverPasswordSchema>;

// ================= Reset password =================
export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Mínimo 6 caracteres').max(72),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ================= Legacy aliases (compatibilidad temporal) =================
export const signupSchema = maestroRegisterSchema;
export const loginSchema = maestroLoginSchema;
export const otpSchema = z.object({ token: z.string().length(6) });

export type SignupInput = MaestroRegisterInput;
export type LoginInput = MaestroLoginInput;
export type OtpInput = z.infer<typeof otpSchema>;

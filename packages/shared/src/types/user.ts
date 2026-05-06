export type UserRole = 'cliente' | 'maestro';

export interface User {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  foto_url: string | null;
  roles: UserRole[];
  is_provider: boolean;
  comuna: string | null;
  region: string | null;
  created_at: string;
  updated_at: string;
}

export interface Direccion {
  id: string;
  user_id: string;
  label: string;
  detalle: string;
  lat: number | null;
  lng: number | null;
  created_at: string;
}

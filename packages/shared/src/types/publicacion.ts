export type PubEstado = 'abierta' | 'cerrada' | 'vencida';

export interface Publicacion {
  id: string;
  autor_id: string;
  titulo: string;
  descripcion: string;
  especialidad: string;
  ubicacion: string;
  lat: number | null;
  lng: number | null;
  urgente: boolean;
  fotos: string[];
  estado: PubEstado;
  contactos: number;
  created_at: string;
  updated_at: string;
}

export interface PublicacionWithAutor extends Publicacion {
  users: {
    nombre: string;
    foto_url: string | null;
  };
}

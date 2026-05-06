export interface MaestroProfile {
  id: string;
  user_id: string;
  oficio: string;
  especialidades: string[];
  bio: string;
  experiencia_anios: number;
  zona_cobertura: string;
  zona_centro_lat: number | null;
  zona_centro_lng: number | null;
  zona_radio_km: number;
  telefono_publico: boolean;
  disponible: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  maestro_id: string;
  image_url: string;
  caption: string | null;
  order: number;
  created_at: string;
}

export interface MaestroWithUser {
  id: string;
  user_id: string;
  oficio: string;
  especialidades: string[];
  bio: string;
  experiencia_anios: number;
  zona_cobertura: string;
  telefono_publico: boolean;
  disponible: boolean;
  users: {
    nombre: string;
    foto_url: string | null;
    comuna: string | null;
    telefono: string | null;
  };
  rating_promedio: number | null;
  total_ratings: number;
  portfolio_items: PortfolioItem[];
}

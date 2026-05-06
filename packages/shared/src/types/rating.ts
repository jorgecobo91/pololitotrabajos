export interface Rating {
  id: string;
  chat_id: string;
  from_id: string;
  to_id: string;
  calidad: number;
  puntualidad: number;
  comunicacion: number;
  precio: number;
  comentario: string | null;
  created_at: string;
}

export interface RatingSummary {
  promedio: number;
  total: number;
  calidad_avg: number;
  puntualidad_avg: number;
  comunicacion_avg: number;
  precio_avg: number;
}

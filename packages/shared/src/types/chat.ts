export type ChatStatus = 'nuevo' | 'en_negociacion' | 'aceptado' | 'completado' | 'rechazado';
export type ContactCtx = 'catalogo' | 'publicacion';
export type ReqStatus = 'pending' | 'accepted' | 'rejected' | 'expired';

export interface ContactRequest {
  id: string;
  from_id: string;
  to_id: string;
  context_type: ContactCtx;
  context_id: string | null;
  status: ReqStatus;
  chat_id: string | null;
  created_at: string;
  responded_at: string | null;
}

export interface Chat {
  id: string;
  client_id: string;
  maestro_id: string;
  estado: ChatStatus;
  trabajo_titulo: string | null;
  publicacion_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  from_id: string;
  text: string | null;
  image_url: string | null;
  lat: number | null;
  lng: number | null;
  read_at: string | null;
  created_at: string;
}

export interface ChatWithParticipant extends Chat {
  other_user: {
    id: string;
    nombre: string;
    foto_url: string | null;
  };
  last_message: Message | null;
  unread_count: number;
}

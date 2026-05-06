export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      categorias: {
        Row: { icon: string; id: string; nombre: string; order: number }
        Insert: { icon: string; id?: string; nombre: string; order?: number }
        Update: { icon?: string; id?: string; nombre?: string; order?: number }
        Relationships: []
      }
      chats: {
        Row: {
          client_id: string
          created_at: string
          estado: Database["public"]["Enums"]["chat_status"]
          id: string
          maestro_id: string
          publicacion_id: string | null
          trabajo_titulo: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          estado?: Database["public"]["Enums"]["chat_status"]
          id?: string
          maestro_id: string
          publicacion_id?: string | null
          trabajo_titulo?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          estado?: Database["public"]["Enums"]["chat_status"]
          id?: string
          maestro_id?: string
          publicacion_id?: string | null
          trabajo_titulo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      comunas: {
        Row: { id: string; lat: number | null; lng: number | null; nombre: string; region: string }
        Insert: { id?: string; lat?: number | null; lng?: number | null; nombre: string; region: string }
        Update: { id?: string; lat?: number | null; lng?: number | null; nombre?: string; region?: string }
        Relationships: []
      }
      maestro_profiles: {
        Row: {
          accepted_terms: boolean | null
          accepted_terms_at: string | null
          bio: string
          created_at: string
          disponible: boolean
          disponible_urgencias: boolean
          especialidades: string[]
          experiencia_anios: number
          id: string
          oficio: string
          rating_promedio: number | null
          telefono_publico: boolean
          terms_version: string | null
          total_ratings: number | null
          total_trabajos: number | null
          updated_at: string
          user_id: string
          zona_centro_lat: number | null
          zona_centro_lng: number | null
          zona_cobertura: string
          zona_radio_km: number
        }
        Insert: Partial<Database["public"]["Tables"]["maestro_profiles"]["Row"]> & { oficio: string; user_id: string }
        Update: Partial<Database["public"]["Tables"]["maestro_profiles"]["Row"]>
        Relationships: []
      }
      messages: {
        Row: {
          chat_id: string
          created_at: string
          from_id: string
          id: string
          image_url: string | null
          lat: number | null
          lng: number | null
          read_at: string | null
          text: string | null
        }
        Insert: Partial<Database["public"]["Tables"]["messages"]["Row"]> & { chat_id: string; from_id: string }
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>
        Relationships: []
      }
      publicaciones: {
        Row: {
          autor_id: string | null
          contactos: number
          created_at: string
          descripcion: string
          email_cliente: string | null
          especialidad: string
          estado: Database["public"]["Enums"]["pub_estado"]
          expires_at: string | null
          fotos: string[]
          id: string
          lat: number | null
          lng: number | null
          presupuesto_max: number | null
          presupuesto_min: number | null
          titulo: string
          token_acceso: string | null
          ubicacion: string
          updated_at: string
          urgente: boolean
        }
        Insert: Partial<Database["public"]["Tables"]["publicaciones"]["Row"]> & { descripcion: string; especialidad: string; titulo: string; ubicacion: string }
        Update: Partial<Database["public"]["Tables"]["publicaciones"]["Row"]>
        Relationships: []
      }
      rating_tokens: {
        Row: {
          cliente_email: string
          created_at: string | null
          expires_at: string | null
          id: string
          maestro_id: string
          rating_status: string | null
          respuesta_id: string | null
          token: string
        }
        Insert: Partial<Database["public"]["Tables"]["rating_tokens"]["Row"]> & { cliente_email: string; maestro_id: string; token: string }
        Update: Partial<Database["public"]["Tables"]["rating_tokens"]["Row"]>
        Relationships: []
      }
      ratings: {
        Row: {
          calidad: number
          chat_id: string
          comentario: string | null
          comunicacion: number
          created_at: string
          from_id: string
          id: string
          precio: number
          puntualidad: number
          to_id: string
        }
        Insert: Partial<Database["public"]["Tables"]["ratings"]["Row"]> & { calidad: number; chat_id: string; comunicacion: number; from_id: string; precio: number; puntualidad: number; to_id: string }
        Update: Partial<Database["public"]["Tables"]["ratings"]["Row"]>
        Relationships: []
      }
      respuestas_maestro: {
        Row: {
          created_at: string | null
          id: string
          maestro_id: string
          mensaje: string | null
          presupuesto: number
          publicacion_id: string
          tiempo_entrega: string
        }
        Insert: Partial<Database["public"]["Tables"]["respuestas_maestro"]["Row"]> & { maestro_id: string; presupuesto: number; publicacion_id: string; tiempo_entrega: string }
        Update: Partial<Database["public"]["Tables"]["respuestas_maestro"]["Row"]>
        Relationships: []
      }
      users: {
        Row: {
          comuna: string | null
          created_at: string
          email: string | null
          foto_url: string | null
          id: string
          nombre: string
          region: string | null
          roles: Database["public"]["Enums"]["user_role"][]
          telefono: string | null
          updated_at: string
        }
        Insert: Partial<Database["public"]["Tables"]["users"]["Row"]> & { id: string; nombre: string }
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      chat_status: "nuevo" | "en_negociacion" | "aceptado" | "completado" | "rechazado"
      contact_ctx: "catalogo" | "publicacion"
      pub_estado: "abierta" | "cerrada" | "vencida"
      req_status: "pending" | "accepted" | "rejected" | "expired"
      user_role: "cliente" | "maestro"
    }
    CompositeTypes: { [_ in never]: never }
  }
}

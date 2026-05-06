-- POLOLITOTRABAJOS Initial Schema
-- Applied via Supabase MCP on 2026-05-03

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('cliente', 'maestro');
CREATE TYPE pub_estado AS ENUM ('abierta', 'cerrada', 'vencida');
CREATE TYPE contact_ctx AS ENUM ('catalogo', 'publicacion');
CREATE TYPE req_status AS ENUM ('pending', 'accepted', 'rejected', 'expired');
CREATE TYPE chat_status AS ENUM ('nuevo', 'en_negociacion', 'aceptado', 'completado', 'rechazado');

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE,
  telefono TEXT UNIQUE,
  foto_url TEXT,
  roles user_role[] NOT NULL DEFAULT '{cliente}',
  comuna TEXT,
  region TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.categorias (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0
);

CREATE TABLE public.comunas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT NOT NULL,
  region TEXT NOT NULL,
  lat FLOAT,
  lng FLOAT
);

CREATE TABLE public.maestro_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  oficio TEXT NOT NULL,
  especialidades TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT NOT NULL DEFAULT '',
  experiencia_anios INT NOT NULL DEFAULT 0,
  zona_cobertura TEXT NOT NULL DEFAULT '',
  zona_centro_lat FLOAT,
  zona_centro_lng FLOAT,
  zona_radio_km INT NOT NULL DEFAULT 30,
  telefono_publico BOOLEAN NOT NULL DEFAULT false,
  disponible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  maestro_id UUID NOT NULL REFERENCES public.maestro_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.publicaciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  autor_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  especialidad TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  lat FLOAT,
  lng FLOAT,
  urgente BOOLEAN NOT NULL DEFAULT false,
  fotos TEXT[] NOT NULL DEFAULT '{}',
  estado pub_estado NOT NULL DEFAULT 'abierta',
  contactos INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_id UUID NOT NULL REFERENCES public.users(id),
  to_id UUID NOT NULL REFERENCES public.users(id),
  context_type contact_ctx NOT NULL,
  context_id UUID,
  status req_status NOT NULL DEFAULT 'pending',
  chat_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ
);

CREATE TABLE public.chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.users(id),
  maestro_id UUID NOT NULL REFERENCES public.users(id),
  estado chat_status NOT NULL DEFAULT 'nuevo',
  trabajo_titulo TEXT,
  publicacion_id UUID REFERENCES public.publicaciones(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  from_id UUID NOT NULL REFERENCES public.users(id),
  text TEXT,
  image_url TEXT,
  lat FLOAT,
  lng FLOAT,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES public.chats(id),
  from_id UUID NOT NULL REFERENCES public.users(id),
  to_id UUID NOT NULL REFERENCES public.users(id),
  calidad INT NOT NULL CHECK (calidad BETWEEN 1 AND 5),
  puntualidad INT NOT NULL CHECK (puntualidad BETWEEN 1 AND 5),
  comunicacion INT NOT NULL CHECK (comunicacion BETWEEN 1 AND 5),
  precio INT NOT NULL CHECK (precio BETWEEN 1 AND 5),
  comentario TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(chat_id, from_id)
);

CREATE TABLE public.direcciones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  detalle TEXT NOT NULL,
  lat FLOAT,
  lng FLOAT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.push_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_maestro_profiles_user ON public.maestro_profiles(user_id);
CREATE INDEX idx_publicaciones_autor ON public.publicaciones(autor_id);
CREATE INDEX idx_publicaciones_estado ON public.publicaciones(estado);
CREATE INDEX idx_messages_chat ON public.messages(chat_id, created_at DESC);
CREATE INDEX idx_chats_client ON public.chats(client_id);
CREATE INDEX idx_chats_maestro ON public.chats(maestro_id);
CREATE INDEX idx_ratings_to ON public.ratings(to_id);
CREATE INDEX idx_contact_requests_to ON public.contact_requests(to_id, status);

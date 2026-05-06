# API Spec — POLOLITOTRABAJOS

REST + WebSocket. Base URL: `https://api.pololitotrabajos.cl/v1`. Prefijo `/v1` versionado.

Auth: `Authorization: Bearer <jwt>`. Refresh: `POST /auth/refresh` con `refreshToken` cookie httpOnly.

Todas las respuestas: `{ data, meta?, error? }`. Errores: `{ error: { code, message, fields? } }`, HTTP status apropiado.

## Auth

| Endpoint | Body | Response |
|---|---|---|
| `POST /auth/signup` | `{ phone, nombre, role }` | `{ user, token, refreshToken }` |
| `POST /auth/otp/send` | `{ phone }` | `{ ok }` (envía SMS) |
| `POST /auth/otp/verify` | `{ phone, code }` | `{ user, token, refreshToken }` |
| `POST /auth/refresh` | cookie | `{ token }` |
| `POST /auth/logout` | — | `{ ok }` |

## Users / Profile

| Endpoint | Notas |
|---|---|
| `GET /me` | usuario actual + maestroProfile si aplica |
| `PATCH /me` | actualizar nombre, foto, comuna |
| `POST /me/role` | activar/desactivar rol maestro |
| `PATCH /me/maestro` | bio, especialidades, zona, disponible, telefonoPublico, experiencia |
| `POST /me/portfolio` | upload imagen con caption |
| `DELETE /me/portfolio/:id` | |
| `GET /me/direcciones` / `POST` / `PATCH/:id` / `DELETE/:id` | CRUD direcciones cliente |
| `POST /me/push-token` | `{ token, platform }` |

## Catálogo

| Endpoint | Query params | Notas |
|---|---|---|
| `GET /maestros` | `q, especialidad, comuna, lat, lng, ratingMin, sort, cursor, limit=20` | Paginación cursor |
| `GET /maestros/:id` | — | Perfil completo + ratings agregados + portfolio |
| `GET /maestros/:id/reviews` | `cursor` | Reviews recibidas |

## Publicaciones

| Endpoint | Body | Notas |
|---|---|---|
| `POST /publicaciones` | `{ titulo, descripcion, especialidad, ubicacion, lat, lng, urgente, fotos[] }` | Crear |
| `GET /publicaciones` | feed: `?especialidad, comuna, urgente, cursor` | Feed para maestros |
| `GET /publicaciones/mias` | — | Las del usuario |
| `GET /publicaciones/:id` | — | |
| `PATCH /publicaciones/:id` | parcial | Solo autor |
| `DELETE /publicaciones/:id` | — | Solo autor |
| `POST /publicaciones/:id/postular` | `{ mensaje? }` | Maestro postula → crea ContactRequest |

## Contact Requests

| Endpoint | Body | Notas |
|---|---|---|
| `POST /contact` | `{ toUserId, contextType: 'catalogo'\|'publicacion', contextId? }` | Cliente → Maestro o viceversa |
| `GET /contact/pending` | — | Pendientes de responder |
| `POST /contact/:id/accept` | — | Crea Chat, retorna chatId |
| `POST /contact/:id/reject` | `{ reason? }` | |

## Chats

| Endpoint | Notas |
|---|---|
| `GET /chats` | Lista del usuario, ordenada por último mensaje |
| `GET /chats/:id` | Detalle + últimos 50 mensajes |
| `GET /chats/:id/messages?before=cursor` | Paginación hacia atrás |
| `POST /chats/:id/messages` | `{ text?, imageUrl?, lat?, lng? }` |
| `POST /chats/:id/read` | Marca leído hasta ahora |
| `PATCH /chats/:id` | `{ estado }` — solo cliente puede marcar `completado` |

## Ratings

| Endpoint | Body | Notas |
|---|---|---|
| `POST /chats/:id/rating` | `{ calidad, puntualidad, comunicacion, precio, comentario? }` | 1..5 c/u |
| `GET /users/:id/ratings/summary` | — | `{ avg, calidad, puntualidad, ..., count }` |

## Uploads

| Endpoint | Notas |
|---|---|
| `POST /uploads/sign` | Body `{ type, mime, size }` → presigned URL para R2/S3 |

Cliente sube directo al storage con la URL firmada y luego envía la `imageUrl` final al endpoint que corresponda.

## Notifications

| Endpoint | Notas |
|---|---|
| `GET /notifications` | Historial |
| `POST /notifications/:id/read` | |

## WebSocket events

Conexión: `wss://api.pololitotrabajos.cl/ws?token=<jwt>`.

**Cliente → Server:** `chat:join`, `chat:leave`, `chat:typing`, `chat:read`.
**Server → Cliente:** `chat:message`, `chat:status`, `chat:typing`, `notification`.

Payload `notification`: `{ type: 'contact_request' | 'new_message' | 'rate_prompt' | 'nearby_request', ...payload }`.

## Rate limits

- Signup OTP: 5/h por phone, 20/h por IP
- Contact request: 30/día por usuario
- Mensajes: 60/min por chat
- Upload: 100MB/día por usuario en V1

## Códigos de error comunes

| Code | HTTP | Significado |
|---|---|---|
| `auth.invalid` | 401 | Token inválido/expirado |
| `auth.forbidden` | 403 | No autorizado para esta acción |
| `validation.failed` | 422 | `fields: { campo: 'mensaje' }` |
| `not_found` | 404 | |
| `rate_limited` | 429 | `meta.retryAfter` en segundos |
| `conflict` | 409 | Ej. publicación ya cerrada |
| `server_error` | 500 | |

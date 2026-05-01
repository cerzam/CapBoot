# CyclePost

Publica contenido de ciclismo en Instagram y Facebook automáticamente usando IA (Claude).

Sube una imagen → la IA la analiza y genera un caption en español → publicas en una o ambas redes con un clic.

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **IA:** Anthropic API (claude-sonnet-4-5 con visión)
- **Publicación:** Meta Graph API (Instagram + Facebook)

---

## Instalación rápida

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd cyclepost

# 2. Instalar todas las dependencias
npm run install:all

# 3. Configurar variables de entorno
cp server/.env.example server/.env
# Editar server/.env con tus claves reales (ver guía abajo)

# 4. Correr en desarrollo
npm run dev
```

- Cliente: `http://localhost:5173`
- Servidor: `http://localhost:3001`

---

## Variables de entorno

Archivo: `server/.env`

| Variable | Descripción |
|---|---|
| `ANTHROPIC_API_KEY` | Clave de Anthropic para generar captions con IA |
| `META_ACCESS_TOKEN` | Page Access Token de Meta (no User Token) |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | ID de tu cuenta Instagram Business |
| `FACEBOOK_PAGE_ID` | ID de tu página de Facebook |
| `PORT` | Puerto del servidor (default: 3001) |
| `PUBLIC_URL` | URL pública del servidor (requerida para Instagram) |

---

## Guía: obtener claves de Anthropic

1. Ir a [console.anthropic.com](https://console.anthropic.com/settings/keys)
2. Crear una nueva API key
3. Copiarla en `ANTHROPIC_API_KEY`

---

## Guía: configurar Meta Graph API

### Requisitos previos
- Una **página de Facebook** (no perfil personal)
- Una cuenta de **Instagram Business o Creator** vinculada a esa página

### Paso 1 — Crear app en Meta for Developers

1. Ir a [developers.facebook.com](https://developers.facebook.com/)
2. Click en **Mis apps → Crear app**
3. Tipo: **Empresa**
4. Agregar los productos: **Instagram Graph API** y **Pages API**

### Paso 2 — Obtener el Page Access Token

1. Ir al **Graph API Explorer** en Meta for Developers
2. Seleccionar tu app en el dropdown
3. Click en **Generar token de acceso** → seleccionar tu página
4. Agregar estos permisos:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `instagram_basic`
   - `instagram_content_publish`
5. Copiar el token → `META_ACCESS_TOKEN`

> **Importante:** El token expira en ~60 días. Para larga duración usa el endpoint de intercambio de tokens de Meta.

### Paso 3 — Obtener el Facebook Page ID

Opción A — Desde la página:
1. Ir a tu página de Facebook → **Acerca de** → el ID aparece al final

Opción B — Vía API:
```
GET https://graph.facebook.com/me/accounts?access_token=TU_TOKEN
```
Busca tu página en la respuesta y copia el `id`.

### Paso 4 — Obtener el Instagram Business Account ID

```
GET https://graph.facebook.com/{FACEBOOK_PAGE_ID}?fields=instagram_business_account&access_token=TU_TOKEN
```
Copia el `id` dentro de `instagram_business_account`.

### Paso 5 — Configurar PUBLIC_URL para Instagram

Instagram necesita descargar la imagen desde una URL pública. El servidor la sirve temporalmente en `/uploads`.

**En desarrollo (ngrok):**
```bash
# Terminal 1
npm run dev

# Terminal 2
ngrok http 3001
# Copiar la URL https://xxxx.ngrok.io → agregar como PUBLIC_URL en server/.env
```

**En producción:**
```
PUBLIC_URL=https://tudominio.com
```

---

## Estructura del proyecto

```
/
├── client/                        # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUploader.jsx  # Drag & drop + preview
│   │   │   ├── CaptionEditor.jsx  # Tono + textarea editable
│   │   │   └── PublishControls.jsx# Checkboxes + botón publicar
│   │   ├── App.jsx
│   │   └── index.css
│   ├── vite.config.js             # Proxy /api → :3001
│   └── tailwind.config.js
│
└── server/                        # Backend Express
    ├── routes/
    │   ├── caption.js             # POST /api/caption
    │   └── publish.js             # POST /api/publish
    ├── services/
    │   ├── anthropicService.js    # Integración Claude (visión)
    │   └── metaService.js         # Instagram + Facebook Graph API
    ├── uploads/                   # Imágenes temporales (auto-limpieza)
    ├── index.js
    └── .env.example
```

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run install:all` | Instala dependencias en raíz, client y server |
| `npm run dev` | Corre cliente y servidor en paralelo |
| `npm run dev:client` | Solo el frontend |
| `npm run dev:server` | Solo el backend |
| `npm run build` | Build de producción del frontend |

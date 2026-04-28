# CyclePost

Publicación automática de contenido de ciclismo en Instagram y Facebook usando IA (Claude).

## Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **IA:** Anthropic API (claude-sonnet-4-5, visión)
- **Publicación:** Meta Graph API

## Instalación

```bash
# 1. Instalar todas las dependencias (raíz + client + server)
npm run install:all

# 2. Configurar variables de entorno
cp server/.env.example server/.env
# Editar server/.env con tus claves reales

# 3. Correr en modo desarrollo (cliente + servidor en paralelo)
npm run dev
```

El cliente corre en `http://localhost:5173`  
El servidor corre en `http://localhost:3001`

## Variables de entorno

Ver `server/.env.example` para la lista completa con instrucciones de dónde obtener cada valor.

### Cómo obtener el Page Access Token de Meta

1. Ir a [Meta for Developers](https://developers.facebook.com/) y crear una app
2. Agregar el producto **Instagram Graph API** y **Pages API**
3. Desde el Graph API Explorer, seleccionar tu app y tu página
4. Solicitar los permisos: `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`
5. Generar el Page Access Token (larga duración recomendada)

## Estructura del proyecto

```
/
├── client/                  # Frontend React + Vite
│   ├── src/
│   │   ├── components/      # ImageUploader, CaptionEditor, PublishControls
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                  # Backend Express
│   ├── routes/
│   │   ├── caption.js       # POST /api/caption
│   │   └── publish.js       # POST /api/publish
│   ├── services/
│   │   ├── anthropicService.js
│   │   └── metaService.js
│   ├── index.js
│   └── .env.example
└── package.json             # Scripts raíz con concurrently
```

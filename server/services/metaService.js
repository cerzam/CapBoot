import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const GRAPH_URL = 'https://graph.facebook.com/v21.0'
const UPLOADS_DIR = path.resolve('uploads')

async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true })
}

async function saveTempImage(buffer, mimeType) {
  await ensureUploadsDir()
  const ext = mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : 'jpg'
  const filename = `${crypto.randomUUID()}.${ext}`
  const filepath = path.join(UPLOADS_DIR, filename)
  await fs.writeFile(filepath, buffer)
  return { filepath, filename }
}

async function deleteTempImage(filepath) {
  try {
    await fs.unlink(filepath)
  } catch {
    // ignorar si ya no existe
  }
}

export async function publishToInstagram(imageBuffer, mimeType, caption) {
  const token = process.env.META_ACCESS_TOKEN
  const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  const publicUrl = process.env.PUBLIC_URL

  if (!publicUrl) {
    throw new Error('PUBLIC_URL no configurado. Necesario para Instagram.')
  }

  const { filepath, filename } = await saveTempImage(imageBuffer, mimeType)
  const imageUrl = `${publicUrl}/uploads/${filename}`

  try {
    // Paso 1: crear el media container
    const containerRes = await fetch(`${GRAPH_URL}/${igAccountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption,
        access_token: token,
      }),
    })
    const containerData = await containerRes.json()

    if (!containerRes.ok || !containerData.id) {
      const msg = containerData.error?.message || 'Error al crear container de Instagram'
      throw new Error(msg)
    }

    // Paso 2: publicar el container
    const publishRes = await fetch(`${GRAPH_URL}/${igAccountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerData.id,
        access_token: token,
      }),
    })
    const publishData = await publishRes.json()

    if (!publishRes.ok || !publishData.id) {
      const msg = publishData.error?.message || 'Error al publicar en Instagram'
      throw new Error(msg)
    }

    return { success: true, postId: publishData.id }
  } finally {
    await deleteTempImage(filepath)
  }
}

export async function publishToFacebook(imageBuffer, mimeType, caption) {
  const token = process.env.META_ACCESS_TOKEN
  const pageId = process.env.FACEBOOK_PAGE_ID

  const formData = new FormData()
  const blob = new Blob([imageBuffer], { type: mimeType })
  formData.append('source', blob, 'photo.jpg')
  formData.append('message', caption)
  formData.append('access_token', token)

  const res = await fetch(`${GRAPH_URL}/${pageId}/photos`, {
    method: 'POST',
    body: formData,
  })
  const data = await res.json()

  if (!res.ok || !data.id) {
    const msg = data.error?.message || 'Error al publicar en Facebook'
    throw new Error(msg)
  }

  return { success: true, postId: data.id }
}

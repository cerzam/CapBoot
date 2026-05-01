import { Router } from 'express'
import { publishToInstagram, publishToFacebook } from '../services/metaService.js'

const router = Router()

router.post('/', async (req, res) => {
  const { imageBase64, caption, platforms } = req.body

  if (!imageBase64) {
    return res.status(400).json({ error: 'La imagen es requerida.' })
  }
  if (!caption?.trim()) {
    return res.status(400).json({ error: 'El caption es requerido.' })
  }
  if (!Array.isArray(platforms) || platforms.length === 0) {
    return res.status(400).json({ error: 'Selecciona al menos una red social.' })
  }

  const imageBuffer = Buffer.from(imageBase64, 'base64')
  // El frontend no envía el mimeType, inferimos por el buffer (o asumimos jpeg)
  const mimeType = detectMimeType(imageBuffer)

  const results = {}

  await Promise.allSettled([
    platforms.includes('instagram')
      ? publishToInstagram(imageBuffer, mimeType, caption.trim())
          .then((r) => { results.instagram = r })
          .catch((err) => { results.instagram = { success: false, error: err.message } })
      : Promise.resolve(),

    platforms.includes('facebook')
      ? publishToFacebook(imageBuffer, mimeType, caption.trim())
          .then((r) => { results.facebook = r })
          .catch((err) => { results.facebook = { success: false, error: err.message } })
      : Promise.resolve(),
  ])

  res.json(results)
})

function detectMimeType(buffer) {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png'
  if (buffer[0] === 0x52 && buffer[1] === 0x49) return 'image/webp'
  return 'image/jpeg'
}

export default router

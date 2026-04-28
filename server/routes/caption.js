import { Router } from 'express'
import multer from 'multer'
import { generateCaption } from '../services/anthropicService.js'

const router = Router()

const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    if (ACCEPTED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Formato no válido. Usa JPG, PNG o WEBP.'))
    }
  },
})

router.post('/', upload.single('image'), async (req, res) => {
  const { tone } = req.body

  if (!req.file) {
    return res.status(400).json({ error: 'La imagen es requerida.' })
  }
  if (!tone?.trim()) {
    return res.status(400).json({ error: 'El tono del caption es requerido.' })
  }

  try {
    const imageBase64 = req.file.buffer.toString('base64')
    const caption = await generateCaption(imageBase64, req.file.mimetype, tone.trim())
    res.json({ caption })
  } catch (err) {
    console.error('Error Anthropic:', err.message)
    res.status(500).json({ error: 'Error al generar el caption. Verifica tu ANTHROPIC_API_KEY.' })
  }
})

export default router

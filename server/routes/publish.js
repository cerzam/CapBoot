import { Router } from 'express'

const router = Router()

// POST /api/publish — implementado en v1.3
router.post('/', (_req, res) => {
  res.status(501).json({ error: 'Disponible en v1.3' })
})

export default router

import { Router } from 'express'

const router = Router()

// POST /api/caption — implementado en v1.2
router.post('/', (_req, res) => {
  res.status(501).json({ error: 'Disponible en v1.2' })
})

export default router

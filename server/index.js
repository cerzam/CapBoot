import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import captionRouter from './routes/caption.js'
import publishRouter from './routes/publish.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))

// Sirve imágenes temporales para Instagram (requiere URL pública)
app.use('/uploads', express.static(path.resolve('uploads')))

app.use('/api/caption', captionRouter)
app.use('/api/publish', publishRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' })
})

app.listen(PORT, () => {
  console.log(`CyclePost server corriendo en http://localhost:${PORT}`)
})

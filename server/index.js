import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import captionRouter from './routes/caption.js'
import publishRouter from './routes/publish.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '20mb' }))
app.use(express.urlencoded({ extended: true, limit: '20mb' }))

app.use('/api/caption', captionRouter)
app.use('/api/publish', publishRouter)

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0' })
})

app.listen(PORT, () => {
  console.log(`CyclePost server corriendo en http://localhost:${PORT}`)
})

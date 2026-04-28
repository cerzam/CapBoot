import { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import CaptionEditor from './components/CaptionEditor'
import PublishControls from './components/PublishControls'

export default function App() {
  const [image, setImage] = useState(null)
  const [tone, setTone] = useState('')
  const [caption, setCaption] = useState(null)
  const [platforms, setPlatforms] = useState([])
  const [generating, setGenerating] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [results, setResults] = useState(null)

  function togglePlatform(id) {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  async function handleGenerate() {
    if (!image) return alert('Sube una imagen primero.')
    if (!tone.trim()) return alert('Indica el tono del caption.')

    setGenerating(true)
    setCaption(null)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('tone', tone.trim())

      const res = await fetch('/api/caption', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error al generar el caption')
      setCaption(data.caption)
    } catch (err) {
      alert(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handlePublish() {
    if (!image) return alert('Sube una imagen primero.')
    if (!caption?.trim()) return alert('Genera o escribe un caption primero.')
    if (platforms.length === 0) return alert('Selecciona al menos una red social.')

    setPublishing(true)
    setResults(null)

    try {
      const reader = new FileReader()
      const imageBase64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(image)
      })

      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, caption, platforms }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al publicar')
      setResults(data)
    } catch (err) {
      alert(err.message)
    } finally {
      setPublishing(false)
    }
  }

  const canPublish = !!image && !!caption?.trim() && platforms.length > 0

  return (
    <div className="min-h-screen bg-carbon-900">
      <header className="border-b border-carbon-700 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🚴</span>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">CyclePost</h1>
            <p className="text-xs text-gray-500 mt-0.5">Publicación automática con IA</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
        <ImageUploader image={image} onImageSelect={setImage} />

        <CaptionEditor
          tone={tone}
          onToneChange={setTone}
          caption={caption}
          onCaptionChange={setCaption}
          onGenerate={handleGenerate}
          loading={generating}
        />

        {canPublish && (
          <PublishControls
            platforms={platforms}
            onToggle={togglePlatform}
            onPublish={handlePublish}
            publishing={publishing}
            results={results}
          />
        )}
      </main>

      <footer className="text-center text-xs text-gray-700 py-6">
        CyclePost — Powered by Claude AI
      </footer>
    </div>
  )
}

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
  const [captionError, setCaptionError] = useState('')
  const [publishError, setPublishError] = useState('')

  function handleImageSelect(file) {
    setImage(file)
    setCaption(null)
    setResults(null)
    setCaptionError('')
    setPublishError('')
  }

  function togglePlatform(id) {
    setPublishError('')
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  async function handleGenerate() {
    setCaptionError('')
    if (!image) return setCaptionError('Sube una imagen antes de generar el caption.')
    if (!tone.trim()) return setCaptionError('Indica el tono del caption (ej: "inspiracional").')

    setGenerating(true)
    setCaption(null)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('image', image)
      formData.append('tone', tone.trim())

      const res = await fetch('/api/caption', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error al generar el caption.')
      setCaption(data.caption)
    } catch (err) {
      setCaptionError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  async function handlePublish() {
    setPublishError('')
    if (!image) return setPublishError('Sube una imagen antes de publicar.')
    if (!caption?.trim()) return setPublishError('Genera o escribe un caption antes de publicar.')
    if (platforms.length === 0) return setPublishError('Selecciona al menos una red social.')

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
      if (!res.ok) throw new Error(data.error || 'Error al publicar.')
      setResults(data)
    } catch (err) {
      setPublishError(err.message)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-carbon-900 flex flex-col">
      <header className="border-b border-carbon-700 px-4 py-4 sticky top-0 z-10 bg-carbon-900/95 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className="text-2xl">🚴</span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white leading-none">CyclePost</h1>
            <p className="text-xs text-gray-500 mt-0.5">Publicación automática con IA</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto w-full px-4 py-6 sm:py-8 flex flex-col gap-5 flex-1">
        <ImageUploader image={image} onImageSelect={handleImageSelect} />

        <CaptionEditor
          tone={tone}
          onToneChange={setTone}
          caption={caption}
          onCaptionChange={setCaption}
          onGenerate={handleGenerate}
          loading={generating}
          error={captionError}
        />

        {caption !== null && (
          <PublishControls
            platforms={platforms}
            onToggle={togglePlatform}
            onPublish={handlePublish}
            publishing={publishing}
            results={results}
            error={publishError}
          />
        )}
      </main>

      <footer className="text-center text-xs text-gray-700 py-5 border-t border-carbon-800">
        CyclePost — Powered by Claude AI
      </footer>
    </div>
  )
}

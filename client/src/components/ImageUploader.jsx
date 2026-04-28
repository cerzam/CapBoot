import { useRef, useState } from 'react'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export default function ImageUploader({ onImageSelect, image }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  function validate(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato no válido. Usa JPG, PNG o WEBP.')
      return false
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('La imagen no puede superar 8 MB.')
      return false
    }
    setError('')
    return true
  }

  function handleFile(file) {
    if (!file || !validate(file)) return
    onImageSelect(file)
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  function handleChange(e) {
    handleFile(e.target.files[0])
  }

  function handleRemove() {
    onImageSelect(null)
    setError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  if (image) {
    return (
      <div className="card flex flex-col items-center gap-4">
        <img
          src={URL.createObjectURL(image)}
          alt="Preview"
          className="w-full max-h-72 object-contain rounded-lg"
        />
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-gray-400 truncate max-w-[70%]">{image.name}</p>
          <button onClick={handleRemove} className="text-sm text-red-400 hover:text-red-300 transition-colors">
            Quitar imagen
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center
          cursor-pointer transition-colors duration-200 select-none
          ${dragging
            ? 'border-cycle-orange bg-cycle-orange/10'
            : 'border-carbon-500 hover:border-cycle-orange hover:bg-carbon-700'}
        `}
      >
        <div className="text-5xl mb-4">🚴</div>
        <p className="text-white font-semibold text-center">
          Arrastra tu imagen aquí
        </p>
        <p className="text-gray-500 text-sm mt-1 text-center">
          o haz clic para seleccionar
        </p>
        <p className="text-gray-600 text-xs mt-3">JPG, PNG, WEBP · Máx. 8 MB</p>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  )
}

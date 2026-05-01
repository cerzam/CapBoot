import { useRef, useState } from 'react'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 8

export default function ImageUploader({ onImageSelect, image }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState('')

  function validate(file) {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Formato no válido. Usa JPG, PNG o WEBP.')
      return false
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`La imagen no puede superar ${MAX_SIZE_MB} MB.`)
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
    // Reset para permitir seleccionar el mismo archivo de nuevo
    e.target.value = ''
  }

  function handleRemove() {
    onImageSelect(null)
    setError('')
  }

  if (image) {
    return (
      <div className="card flex flex-col items-center gap-4">
        <img
          src={URL.createObjectURL(image)}
          alt="Preview de la imagen seleccionada"
          className="w-full max-h-64 sm:max-h-80 object-contain rounded-lg"
        />
        <div className="flex items-center justify-between w-full gap-2">
          <p className="text-sm text-gray-400 truncate">{image.name}</p>
          <button
            onClick={handleRemove}
            className="text-sm text-red-400 hover:text-red-300 transition-colors shrink-0 min-h-[44px] px-2"
          >
            Quitar
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
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Área para subir imagen"
        className={`
          border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center
          cursor-pointer transition-colors duration-200 select-none
          ${dragging
            ? 'border-cycle-orange bg-cycle-orange/10'
            : 'border-carbon-500 hover:border-cycle-orange hover:bg-carbon-700 active:bg-carbon-700'}
        `}
      >
        <div className="text-5xl mb-4 pointer-events-none">🚴</div>
        <p className="text-white font-semibold text-center pointer-events-none">
          Sube tu imagen
        </p>
        <p className="text-gray-500 text-sm mt-1 text-center pointer-events-none">
          Arrastra o toca para seleccionar
        </p>
        <p className="text-gray-600 text-xs mt-3 pointer-events-none">
          JPG · PNG · WEBP · Máx. {MAX_SIZE_MB} MB
        </p>
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
        aria-hidden="true"
      />
    </div>
  )
}

export default function CaptionEditor({ tone, onToneChange, caption, onCaptionChange, onGenerate, loading }) {
  return (
    <div className="card flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          ¿Cómo quieres el caption?
        </label>
        <input
          type="text"
          value={tone}
          onChange={(e) => onToneChange(e.target.value)}
          placeholder='Ej: "inspiracional", "humorístico", "informativo", "atractivo y entretenido"'
          className="input-field"
          disabled={loading}
        />
      </div>

      <button
        onClick={onGenerate}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Spinner />
            Generando caption...
          </>
        ) : (
          '✨ Generar caption'
        )}
      </button>

      {caption !== null && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Caption generado <span className="text-gray-500 font-normal">(puedes editarlo)</span>
          </label>
          <textarea
            value={caption}
            onChange={(e) => onCaptionChange(e.target.value)}
            rows={7}
            className="input-field resize-none leading-relaxed"
            placeholder="El caption aparecerá aquí..."
          />
          <p className="text-xs text-gray-600 mt-1 text-right">
            {caption.length} caracteres
          </p>
        </div>
      )}
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

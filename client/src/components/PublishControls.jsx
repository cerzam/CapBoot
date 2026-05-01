const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
]

export default function PublishControls({ platforms, onToggle, onPublish, publishing, results, error }) {
  const noneSelected = platforms.length === 0

  return (
    <div className="card flex flex-col gap-5">
      <div>
        <p className="text-sm font-medium text-gray-300 mb-3">Publicar en</p>
        <div className="flex gap-3 flex-wrap">
          {PLATFORMS.map(({ id, label, icon }) => {
            const active = platforms.includes(id)
            return (
              <button
                key={id}
                onClick={() => onToggle(id)}
                disabled={publishing}
                aria-pressed={active}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium text-sm
                  transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  min-h-[44px] min-w-[120px] justify-center
                  ${active
                    ? 'bg-cycle-orange/20 border-cycle-orange text-cycle-orange'
                    : 'bg-carbon-700 border-carbon-500 text-gray-400 hover:border-gray-400 active:bg-carbon-600'}
                `}
              >
                <span>{icon}</span>
                {label}
                {active && <span className="text-xs">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={onPublish}
        disabled={publishing || noneSelected}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {publishing ? (
          <>
            <Spinner />
            Publicando...
          </>
        ) : (
          '🚀 Publicar'
        )}
      </button>

      {noneSelected && !publishing && (
        <p className="text-xs text-gray-500 text-center -mt-2">
          Selecciona al menos una red social
        </p>
      )}

      {results && (
        <div className="flex flex-col gap-2">
          {results.instagram && (
            <ResultBadge
              platform="Instagram"
              success={results.instagram.success}
              postId={results.instagram.postId}
              error={results.instagram.error}
            />
          )}
          {results.facebook && (
            <ResultBadge
              platform="Facebook"
              success={results.facebook.success}
              postId={results.facebook.postId}
              error={results.facebook.error}
            />
          )}
        </div>
      )}
    </div>
  )
}

function ResultBadge({ platform, success, postId, error }) {
  return (
    <div
      role="status"
      className={`
        flex items-start gap-2 px-4 py-3 rounded-lg text-sm
        ${success
          ? 'bg-green-900/30 border border-green-700 text-green-400'
          : 'bg-red-900/30 border border-red-700 text-red-400'}
      `}
    >
      <span className="shrink-0">{success ? '✓' : '✗'}</span>
      <div>
        <span className="font-medium">{platform}</span>
        {success
          ? <span className="text-green-500 ml-1">— Publicado correctamente</span>
          : <span className="ml-1">{error || 'Error al publicar. Verifica tu token de Meta.'}</span>
        }
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  )
}

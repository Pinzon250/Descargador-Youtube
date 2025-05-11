import { useState } from 'react'

function App() {
  const [url, setUrl] = useState('')
  const [formato, setFormato] = useState('video')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const handleDescarga = async () => {
    if (!url) {
      setError('Por favor, ingresa una URL válida')
      return
    }

    setCargando(true)
    setError(null)

    try {
      const response = await fetch(
        `http://localhost:8000/descargar/?url=${encodeURIComponent(url)}&formato=${formato}`
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al descargar el archivo')
      }

      const blob = await response.blob()
      const tipo = formato === 'audio' ? 'audio.mp3' : 'video.mp4'
      const urlDescarga = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = urlDescarga
      link.setAttribute('download', tipo)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="relative isolate min-h-screen bg-gray-900 flex flex-col items-center justify-center">
      <div className="backdrop-blur-sm bg-[#1E293B]/60 box-shadow-mb rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-4xl font-semibold tracking-tight text-white text-center mb-4">Descargador de YouTube</h1>

        <label className="mb-2 text-lg text-gray-300 block">URL del video:</label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-WHITE focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
          placeholder="https://www.youtube.com/watch?v=..."
        />

        <label className="mt-2 text-lg text-gray-300 block">Formato:</label>
        <select
          value={formato}
          onChange={(e) => setFormato(e.target.value)}
          className="mt-2 mb-4 w-full flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
        >
          <option className='rounded-md text-black' value="video">Video</option>
          <option className='text-black' value="audio">Audio (MP3)</option>
        </select>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          onClick={handleDescarga}
          disabled={cargando}
          className="flex-none mt-3 w-full rounded-md bg-indigo-500 transition px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          {cargando ? 'Descargando...' : 'Descargar'}
        </button>
      </div>
      <div aria-hidden="true" className="absolute top-0 left-1/2 -z-10 -translate-x-1/2 blur-3xl xl:-top-6">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="aspect-1155/678 w-[72.1875rem] bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-80"
        />
      </div>
    </div>
  )
}

export default App

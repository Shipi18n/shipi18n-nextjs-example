'use client'

import { useState } from 'react'
import { translate } from '@/lib/shipi18n'
import Link from 'next/link'

const LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'it', name: 'Italian' },
]

export default function ClientSideExample() {
  const [text, setText] = useState('Hello! Welcome to our application.')
  const [selectedLanguages, setSelectedLanguages] = useState(['es', 'fr'])
  const [translations, setTranslations] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleTranslate = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)

    try {
      const result = await translate({
        text,
        targetLanguages: selectedLanguages,
        preservePlaceholders: true,
      })
      setTranslations(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleLanguage = (code) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.filter(l => l !== code)
        : [...prev, code]
    )
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to examples</Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🖥️ Client-Side Translation
        </h1>
        <p className="text-gray-600 mb-6">
          Translate text interactively in the browser using React state and the Shipi18n API.
        </p>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text to translate
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter text to translate..."
          />
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target languages
          </label>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => toggleLanguage(lang.code)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedLanguages.includes(lang.code)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim() || selectedLanguages.length === 0}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Translating...' : `Translate to ${selectedLanguages.length} language(s)`}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Results */}
        {translations && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Translations:</h3>
            {Object.entries(translations).map(([lang, items]) => (
              <div key={lang} className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-gray-700 mb-2 uppercase">{lang}</div>
                {Array.isArray(items) ? (
                  items.map((item, i) => (
                    <p key={i} className="text-gray-900">{item.translated}</p>
                  ))
                ) : (
                  <p className="text-gray-900">{JSON.stringify(items)}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Code Example */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Code Example</h2>
        <pre className="text-sm">{`'use client'
import { translate } from '@/lib/shipi18n'

const result = await translate({
  text: 'Hello, World!',
  targetLanguages: ['es', 'fr', 'de'],
  preservePlaceholders: true,
})

// Result:
// {
//   es: [{ original: '...', translated: 'Hola, Mundo!' }],
//   fr: [{ original: '...', translated: 'Bonjour le monde!' }],
//   de: [{ original: '...', translated: 'Hallo Welt!' }]
// }`}</pre>
      </div>
    </div>
  )
}

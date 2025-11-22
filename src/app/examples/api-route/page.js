'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ApiRouteExample() {
  const [text, setText] = useState('Hello! This translation goes through our API route.')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [translation, setTranslation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleTranslate = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Call our own API route instead of Shipi18n directly
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          targetLanguages: [targetLanguage],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Translation failed')
      }

      const result = await response.json()
      setTranslation(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="text-blue-600 hover:underline">&larr; Back to examples</Link>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🔌 API Route Proxy
        </h1>
        <p className="text-gray-600 mb-6">
          This example uses a Next.js API route to proxy translation requests.
          Your API key stays on the server &mdash; never exposed to the client!
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">Why use an API route?</h3>
          <ul className="text-yellow-700 space-y-1">
            <li>✓ API key stays secret (server-side only)</li>
            <li>✓ Add custom rate limiting</li>
            <li>✓ Log translations for analytics</li>
            <li>✓ Add authentication checks</li>
            <li>✓ Cache translations in your database</li>
          </ul>
        </div>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Text to translate
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
          />
        </div>

        {/* Language Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target language
          </label>
          <select
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
            <option value="zh">Chinese</option>
          </select>
        </div>

        {/* Translate Button */}
        <button
          onClick={handleTranslate}
          disabled={loading || !text.trim()}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Translating via API route...' : 'Translate'}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Result */}
        {translation && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="font-medium text-gray-700 mb-2 uppercase">{targetLanguage}</div>
            <p className="text-gray-900">
              {translation[targetLanguage]?.[0]?.translated || JSON.stringify(translation)}
            </p>
          </div>
        )}
      </div>

      {/* Code Example */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">API Route Code</h2>
        <p className="text-gray-600 mb-4">
          <code className="bg-gray-100 px-2 py-1 rounded">src/app/api/translate/route.js</code>
        </p>
        <pre className="text-sm">{`import { translate } from '@/lib/shipi18n'

export async function POST(request) {
  const { text, targetLanguages } = await request.json()

  // Add your own logic here:
  // - Rate limiting
  // - Authentication
  // - Logging
  // - Caching

  try {
    const result = await translate({
      text,
      targetLanguages,
      preservePlaceholders: true,
    })

    return Response.json(result)
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}`}</pre>
      </div>
    </div>
  )
}
